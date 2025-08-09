export class OAuthService {
  private readonly clientConfigs = {
    google: {
      clientId:
        import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
      redirectUri: `${window.location.origin}/callback`,
      scope: "openid email profile",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    },
  };

  constructor() {
    // Validate configuration on initialization
    this.validateConfiguration();
  }

  /**
   * Validate OAuth configuration and provide helpful warnings
   */
  private validateConfiguration(): void {
    Object.entries(this.clientConfigs).forEach(([provider, config]) => {
      if (config.clientId.startsWith("YOUR_")) {
        console.warn(
          `⚠️ OAuth not configured for ${provider}. ` +
            `Set VITE_${provider.toUpperCase()}_CLIENT_ID in your environment. ` +
            `See OAUTH_SETUP.md for detailed instructions.`
        );
      }
    });
  }

  /**
   * Generate OAuth authorization URL for the specified provider
   */
  generateAuthUrl(provider: string, nonce: string): string {
    const config =
      this.clientConfigs[provider as keyof typeof this.clientConfigs];

    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Generate a random state parameter for security
    const state = this.generateRandomState();

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
      nonce,
    });

    // For OpenID Connect providers, add additional parameters
    if (provider === "google") {
      params.append("response_mode", "query");
    }

    const authUrl = `${config.authUrl}?${params.toString()}`;
    console.log(`Generated ${provider} OAuth URL:`, authUrl);

    return authUrl;
  }

  /**
   * Exchange authorization code for access token and ID token
   * Note: For production use, this should ideally be done through a backend service
   * to keep client secrets secure. For development/demo purposes, we use public client flow.
   */
  async exchangeCodeForToken(
    provider: string,
    code: string,
    _state: string
  ): Promise<{
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const config =
      this.clientConfigs[provider as keyof typeof this.clientConfigs];

    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const tokenEndpoint = this.getTokenEndpoint(provider);

    // For public clients (frontend apps), we don't include client_secret
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code,
    });

    // Note: Some providers require client_secret even for public clients
    // In production, this should be handled by a backend service
    const clientSecret = this.getClientSecret(provider);
    if (clientSecret) {
      body.append("client_secret", clientSecret);
    }

    console.log(`Exchanging code for token with ${provider}:`, {
      code: code.substring(0, 10) + "...",
      redirect_uri: config.redirectUri,
    });

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Token exchange failed for ${provider}:`, errorText);

        // Provide helpful error messages for common issues
        if (errorText.includes("client_secret is missing")) {
          throw new Error(
            `OAuth Configuration Error: client_secret is required for Google OAuth. ` +
              `Please add VITE_GOOGLE_CLIENT_SECRET to your environment variables, ` +
              `or configure your Google OAuth application as a 'Public' client. ` +
              `See OAUTH_SETUP.md for detailed setup instructions.`
          );
        }

        throw new Error(
          `Token exchange failed: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const tokenData = await response.json();
      console.log(`Successfully exchanged code for token with ${provider}`);

      // Validate that we received an id_token (JWT)
      if (!tokenData.id_token) {
        console.error("No id_token in response:", tokenData);
        throw new Error(
          "No id_token (JWT) received from OAuth provider. Make sure your OAuth application is configured for OpenID Connect."
        );
      }

      return tokenData;
    } catch (error) {
      console.error(`Error exchanging code for token with ${provider}:`, error);
      throw new Error(
        `Failed to exchange authorization code for token: ${error}`
      );
    }
  }

  /**
   * Get the token endpoint for the specified provider
   */
  private getTokenEndpoint(provider: string): string {
    switch (provider) {
      case "google":
        return "https://oauth2.googleapis.com/token";
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Get client secret for the provider (if available)
   * WARNING: In production, client secrets should NEVER be exposed in frontend code!
   * This is only for development/demo purposes. Use a backend service for production.
   */
  private getClientSecret(provider: string): string | null {
    switch (provider) {
      case "google":
        const googleSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
        if (!googleSecret) {
          console.warn(
            "⚠️ VITE_GOOGLE_CLIENT_SECRET not set. If you get 'client_secret is missing' errors, " +
              "you need to configure your Google OAuth app as a 'Public' client or provide the client secret."
          );
        }
        return googleSecret || null;
      default:
        return null;
    }
  }

  /**
   * Generate a random state parameter for OAuth security
   */
  private generateRandomState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  /**
   * Validate the state parameter returned from OAuth provider
   */
  validateState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
  }

  /**
   * Get user information from the access token
   */
  async getUserInfo(
    provider: string,
    accessToken: string
  ): Promise<{
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  }> {
    const userInfoEndpoint = this.getUserInfoEndpoint(provider);

    try {
      const response = await fetch(userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get user info: ${response.status} ${response.statusText}`
        );
      }

      const userInfo = await response.json();
      console.log(`Retrieved user info from ${provider}:`, userInfo);

      return this.normalizeUserInfo(provider, userInfo);
    } catch (error) {
      console.error(`Error getting user info from ${provider}:`, error);
      throw new Error(`Failed to retrieve user information`);
    }
  }

  /**
   * Get the user info endpoint for the specified provider
   */
  private getUserInfoEndpoint(provider: string): string {
    switch (provider) {
      case "google":
        return "https://www.googleapis.com/oauth2/v2/userinfo";
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Normalize user info from different providers to a common format
   */
  private normalizeUserInfo(
    provider: string,
    rawUserInfo: any
  ): {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  } {
    switch (provider) {
      case "google":
        return {
          id: rawUserInfo.id,
          email: rawUserInfo.email,
          name: rawUserInfo.name,
          picture: rawUserInfo.picture,
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
