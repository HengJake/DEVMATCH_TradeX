import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// JWT Payload interface
export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

// User info interface
export interface UserInfo {
  email?: string;
  name?: string;
  picture?: string;
  provider: string;
  createdAt: Date;
}

/**
 * Extract user information from JWT token
 */
export function extractUserInfoFromJWT(
  jwt: string,
  provider: string
): UserInfo {
  try {
    const decoded = jwtDecode(jwt) as JwtPayload;

    // Extract user information based on provider
    let userInfo: UserInfo = {
      provider,
      createdAt: new Date(),
    };

    switch (provider) {
      case "google":
        userInfo = {
          email: decoded.email,
          name:
            decoded.name ||
            `${decoded.given_name || ""} ${decoded.family_name || ""}`.trim(),
          picture: decoded.picture,
          provider,
          createdAt: new Date(),
        };
        break;

      default:
        userInfo = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          provider,
          createdAt: new Date(),
        };
    }

    return userInfo;
  } catch (error) {
    console.error("Error extracting user info from JWT:", error);
    return {
      email: "unknown@example.com",
      name: "Unknown User",
      picture: "",
      provider,
      createdAt: new Date(),
    };
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string, length: number = 8): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Validate if an address is a valid Sui address
 */
export function isValidSuiAddress(address: string): boolean {
  if (!address) return false;

  // Sui addresses should start with 0x and be 66 characters total (0x + 64 hex chars)
  const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
  return suiAddressRegex.test(address);
}
