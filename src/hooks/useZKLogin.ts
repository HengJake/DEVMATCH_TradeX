import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { OAuthService } from "../services/oauthService";
import { ZKLoginService } from "../services/zkLoginService";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  aud?: string;
  iss?: string;
  iat?: number;
  exp?: number;
}

interface UserInfo {
  email?: string;
  name?: string;
  picture?: string;
  provider: string;
  createdAt: Date;
}

export const useZKLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setZKLoginData, clearZKLoginData } = useAuth();

  const zkLoginService = new ZKLoginService("https://fullnode.devnet.sui.io");
  const oauthService = new OAuthService();

  const extractUserInfoFromJWT = (jwt: string, provider: string): UserInfo => {
    const payload = jwtDecode(jwt) as JwtPayload;

    return {
      email: payload.email,
      name: payload.name || payload.given_name || "",
      picture: payload.picture,
      provider,
      createdAt: new Date(),
    };
  };

  const startZKLoginFlow = useCallback(
    async (provider: string) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Starting ZKLogin flow for provider:", provider);

        // Step 1: Generate ephemeral key pair and nonce
        const flowData = await zkLoginService.generateEphemeralKeyPair();
        console.log("Generated ephemeral key pair and nonce");

        // Step 2: Generate OAuth URL and store state
        const authUrl = oauthService.generateAuthUrl(provider, flowData.nonce);
        sessionStorage.setItem("oauth_state", flowData.nonce);
        sessionStorage.setItem("oauth_provider", provider); // Store provider for callback
        console.log("Generated OAuth URL:", authUrl);

        // Step 3: Open OAuth popup
        const jwt = await openOAuthPopup(authUrl);
        console.log("Received JWT from OAuth popup");

        // Step 4: Decode JWT to get user info
        const decodedJwt = jwtDecode(jwt) as JwtPayload;
        console.log("Decoded JWT:", decodedJwt);

        // Step 5: Extract user information from JWT
        const userInfo = extractUserInfoFromJWT(jwt, provider);
        console.log("Extracted user info:", userInfo);

        // Step 6: Get user salt
        const salt = await zkLoginService.getUserSaltFromJWT(jwt);
        console.log("Got user salt:", salt);

        // Step 7: Generate zkLogin address
        const address = zkLoginService.generateZKLoginAddress(jwt, salt);
        console.log("Generated zkLogin address:", address);

        // Step 8: Generate ZK proof
        const proof = await zkLoginService.generateZKProof(
          jwt,
          flowData.ephemeralKeyPair,
          flowData.maxEpoch,
          flowData.randomness,
          salt
        );
        console.log("Generated ZK proof");

        // Step 9: Store data in context with user info
        setZKLoginData(jwt, address, salt, userInfo);
        console.log("Stored data in context with user info");

        // Step 10: Cache ephemeral key pair and proof in session storage
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "zkLogin_ephemeralKeyPair",
            JSON.stringify(flowData.ephemeralKeyPair)
          );
          sessionStorage.setItem("zkLogin_proof", JSON.stringify(proof));
          sessionStorage.setItem(
            "zkLogin_maxEpoch",
            flowData.maxEpoch.toString()
          );
          console.log("Cached data in session storage");
        }

        return { address, salt, proof, userInfo };
      } catch (err) {
        console.error("ZKLogin flow failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "ZKLogin flow failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setZKLoginData]
  );

  const logout = useCallback(() => {
    clearZKLoginData();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("zkLogin_ephemeralKeyPair");
      sessionStorage.removeItem("zkLogin_proof");
      sessionStorage.removeItem("zkLogin_maxEpoch");
      sessionStorage.removeItem("oauth_state");
      sessionStorage.removeItem("oauth_provider");
    }
  }, [clearZKLoginData]);

  return {
    startZKLoginFlow,
    logout,
    isLoading,
    error,
  };
};

// Helper function to open OAuth popup
function openOAuthPopup(authUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("Opening OAuth popup with URL:", authUrl);

    const popupFeatures = [
      "width=500",
      "height=600",
      "scrollbars=yes",
      "resizable=yes",
      "status=yes",
      "location=yes",
      "menubar=no",
      "toolbar=no",
    ].join(",");

    const popup = window.open(authUrl, "oauth_popup", popupFeatures);

    if (!popup) {
      reject(
        new Error(
          "Popup blocked by browser. Please allow popups for this site and try again."
        )
      );
      return;
    }

    let messageHandler: ((event: MessageEvent) => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let checkClosedInterval: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (messageHandler) {
        window.removeEventListener("message", messageHandler);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (checkClosedInterval) {
        clearInterval(checkClosedInterval);
      }
    };

    // Set a timeout to reject if no response is received
    timeoutId = setTimeout(() => {
      cleanup();
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch (error) {
        console.warn("Could not close popup:", error);
      }
      reject(
        new Error(
          "OAuth timeout - no response received within 5 minutes. Please try again."
        )
      );
    }, 300000); // 5 minute timeout

    messageHandler = (event) => {
      console.log(
        "Received message from popup:",
        event.data,
        "from origin:",
        event.origin
      );

      // Check origin
      const allowedOrigins = [window.location.origin];
      if (!allowedOrigins.includes(event.origin)) {
        console.log("Ignoring message from different origin:", event.origin);
        return;
      }

      if (event.data && event.data.type === "OAUTH_SUCCESS") {
        console.log("✅ OAuth success, resolving with JWT");
        cleanup();
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch (error) {
          console.warn("Could not close popup after success:", error);
        }
        resolve(event.data.jwt);
      } else if (event.data && event.data.type === "OAUTH_ERROR") {
        console.log("❌ OAuth error:", event.data.error);
        cleanup();
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch (error) {
          console.warn("Could not close popup after error:", error);
        }
        reject(new Error(`OAuth failed: ${event.data.error}`));
      }
    };

    // Check if popup is closed
    checkClosedInterval = setInterval(() => {
      try {
        if (popup.closed) {
          cleanup();
          reject(new Error("OAuth was cancelled - popup window was closed"));
        }
      } catch (error) {
        // If we can't access popup.closed, assume it's still open
        console.warn("Cannot check popup status:", error);
      }
    }, 1000);

    window.addEventListener("message", messageHandler);

    // Focus the popup window
    try {
      popup.focus();
    } catch (error) {
      console.warn("Could not focus popup window:", error);
    }
  });
}
