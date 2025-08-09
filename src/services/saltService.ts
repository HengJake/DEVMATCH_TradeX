import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  aud?: string;
  iss?: string;
  iat?: number;
  exp?: number;
}

export class SaltService {
  /**
   * Get or generate salt for a user based on their JWT
   */
  async getSaltFromJWT(jwt: string): Promise<string> {
    try {
      const payload = jwtDecode(jwt) as JwtPayload;
      console.log("JWT payload for salt generation:", payload);

      // Use a combination of sub (subject) and iss (issuer) to create a unique identifier
      const userId = payload.sub;
      const issuer = payload.iss;

      if (!userId || !issuer) {
        throw new Error("Invalid JWT: missing sub or iss claims");
      }

      // Create a deterministic key for the user
      const userKey = `${issuer}:${userId}`;
      console.log("User key for salt:", userKey);

      // Check if we have a cached salt for this user
      const cachedSalt = this.getCachedSalt(userKey);
      if (cachedSalt) {
        console.log("Using cached salt for user:", userKey);
        return cachedSalt;
      }

      // Generate a new salt for this user
      const newSalt = this.generateSalt(userKey);

      // Cache the salt for future use
      this.cacheSalt(userKey, newSalt);

      console.log("Generated new salt for user:", userKey);
      return newSalt;
    } catch (error) {
      console.error("Error getting salt from JWT:", error);
      throw new Error("Failed to generate user salt");
    }
  }

  /**
   * Generate a deterministic salt from user key
   */
  private generateSalt(userKey: string): string {
    // Use crypto API to generate a deterministic salt
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.subtle
    ) {
      // Browser environment - use WebCrypto API
      return this.generateSaltBrowser(userKey);
    } else {
      // Fallback for environments without WebCrypto
      return this.generateSaltFallback(userKey);
    }
  }

  /**
   * Generate salt using WebCrypto API (browser)
   */
  private generateSaltBrowser(userKey: string): string {
    // Create a simple hash of the user key for now
    // In production, you might want to use a more sophisticated approach
    const encoder = new TextEncoder();
    const data = encoder.encode(userKey);

    // Create a simple deterministic salt using the user key
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }

    // Ensure the salt is positive and within the valid range for ZKLogin
    const salt = Math.abs(hash).toString();
    console.log("Generated browser salt:", salt);
    return salt;
  }

  /**
   * Fallback salt generation for environments without WebCrypto
   */
  private generateSaltFallback(userKey: string): string {
    // Simple hash function for fallback
    let hash = 0;
    for (let i = 0; i < userKey.length; i++) {
      const char = userKey.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const salt = Math.abs(hash).toString();
    console.log("Generated fallback salt:", salt);
    return salt;
  }

  /**
   * Get cached salt for a user
   */
  private getCachedSalt(userKey: string): string | null {
    try {
      if (typeof window !== "undefined") {
        const cachedSalt = localStorage.getItem(`salt_${userKey}`);
        return cachedSalt;
      }
      return null;
    } catch (error) {
      console.error("Error getting cached salt:", error);
      return null;
    }
  }

  /**
   * Cache salt for a user
   */
  private cacheSalt(userKey: string, salt: string): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`salt_${userKey}`, salt);
        console.log("Cached salt for user:", userKey);
      }
    } catch (error) {
      console.error("Error caching salt:", error);
    }
  }

  /**
   * Clear all cached salts (for logout or cleanup)
   */
  public clearAllCachedSalts(): void {
    try {
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("salt_")) {
            localStorage.removeItem(key);
          }
        });
        console.log("Cleared all cached salts");
      }
    } catch (error) {
      console.error("Error clearing cached salts:", error);
    }
  }
}
