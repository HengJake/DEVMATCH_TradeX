import React, { useEffect } from "react";
import { OAuthService } from "../services/oauthService";

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          console.error("OAuth error:", error);
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "OAUTH_ERROR",
                error: error,
              },
              window.location.origin
            );
          }
          window.close();
          return;
        }

        if (code && state) {
          console.log("OAuth callback received code and state");

          // Determine provider from the stored state or URL
          const provider = determineProvider();
          console.log("Detected provider:", provider);

          if (!provider) {
            throw new Error("Could not determine OAuth provider");
          }

          // Exchange authorization code for tokens
          const oauthService = new OAuthService();
          console.log("Exchanging authorization code for tokens...");

          const tokenResponse = await oauthService.exchangeCodeForToken(
            provider,
            code,
            state
          );

          console.log("Token exchange successful:", tokenResponse);

          // The id_token is the JWT we need for ZKLogin
          const jwt = tokenResponse.id_token;

          if (!jwt) {
            throw new Error("No id_token (JWT) received from OAuth provider");
          }

          console.log("Received real JWT from OAuth provider");

          if (window.opener) {
            window.opener.postMessage(
              {
                type: "OAUTH_SUCCESS",
                jwt: jwt,
                code,
                state,
                provider,
              },
              window.location.origin
            );
          }

          window.close();
        } else {
          throw new Error("Missing authorization code or state");
        }
      } catch (err) {
        console.error("Callback handling error:", err);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "OAUTH_ERROR",
              error: err instanceof Error ? err.message : "Unknown error",
            },
            window.location.origin
          );
        }
        window.close();
      }
    };

    // Send health check response
    const handleHealthCheck = (event: MessageEvent) => {
      if (event.data && event.data.type === "POPUP_HEALTH_CHECK") {
        if (event.source) {
          (event.source as Window).postMessage(
            {
              type: "POPUP_HEALTH_RESPONSE",
            },
            event.origin
          );
        }
      }
    };

    window.addEventListener("message", handleHealthCheck);

    // Handle the callback
    handleCallback();

    return () => {
      window.removeEventListener("message", handleHealthCheck);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-white mt-4">Processing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">
          This window will close automatically.
        </p>
      </div>
    </div>
  );
};

/**
 * Determine the OAuth provider from the current URL or stored state
 */
function determineProvider(): string | null {
  try {
    // First, try to get provider from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const scope = urlParams.get("scope");

    // Check the current URL or domain to determine provider
    const currentUrl = window.location.href;

    // Google OAuth URLs contain accounts.google.com
    if (
      currentUrl.includes("accounts.google.com") ||
      (scope && scope.includes("openid email profile"))
    ) {
      return "google";
    }

    // Fallback: try to get from sessionStorage or referrer
    const storedProvider = sessionStorage.getItem("oauth_provider");
    if (storedProvider) {
      return storedProvider;
    }

    // If we can access the opener window, try to get provider from there
    if (window.opener && window.opener.location) {
      const openerUrl = window.opener.location.href;
      if (openerUrl.includes("google")) return "google";
    }

    // Default to google if we can't determine
    console.warn("Could not determine OAuth provider, defaulting to google");
    return "google";
  } catch (error) {
    console.error("Error determining provider:", error);
    return "google"; // Default fallback
  }
}

export default CallbackPage;
