import { SaltService } from "./saltService";
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from "@mysten/sui/zklogin";
import { jwtDecode } from "jwt-decode";

export interface FlowData {
  ephemeralKeyPair: Ed25519Keypair;
  nonce: string;
  maxEpoch: number;
  randomness: string;
}

export interface ZKProofRequest {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: string;
  jwtRandomness: string;
  salt: string;
  keyClaimName: string;
}

export interface ZKProofResponse {
  proofPoints: {
    a: string[];
    b: string[][];
    c: string[];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export class ZKLoginService {
  private client: SuiClient;
  private saltService: SaltService;
  private proverEndpoint: string;

  constructor(fullnodeUrl: string) {
    this.client = new SuiClient({ url: fullnodeUrl });
    this.saltService = new SaltService();
    // For development, use a mock prover endpoint
    this.proverEndpoint =
      import.meta.env.VITE_PROVER_ENDPOINT || "http://localhost:3000/api/prove";
  }

  /**
   * Generate ephemeral key pair and nonce for ZKLogin flow
   */
  async generateEphemeralKeyPair(): Promise<FlowData> {
    try {
      // Get current epoch
      const { epoch } = await this.client.getLatestSuiSystemState();
      const maxEpoch = Number(epoch) + 2; // Allow 2 epochs for the transaction

      // Generate ephemeral key pair
      const ephemeralKeyPair = new Ed25519Keypair();

      // Generate randomness
      const randomness = generateRandomness();

      // Generate nonce
      const nonce = generateNonce(
        ephemeralKeyPair.getPublicKey(),
        maxEpoch,
        randomness
      );

      return {
        ephemeralKeyPair,
        nonce,
        maxEpoch,
        randomness,
      };
    } catch (error) {
      console.error("Error generating ephemeral key pair:", error);
      throw new Error("Failed to generate ephemeral key pair");
    }
  }

  /**
   * Get user salt from JWT
   */
  async getUserSaltFromJWT(jwt: string): Promise<string> {
    return await this.saltService.getSaltFromJWT(jwt);
  }

  /**
   * Generate ZKLogin address from JWT and salt
   */
  generateZKLoginAddress(jwt: string, salt: string): string {
    try {
      console.log("Generating ZKLogin address with salt:", salt);

      // Ensure salt is numeric for jwtToAddress
      const numericSalt = this.ensureNumericSalt(salt);
      console.log("Using numeric salt:", numericSalt);

      // Use the Sui SDK jwtToAddress utility directly
      const address = jwtToAddress(jwt, numericSalt);
      console.log("Generated ZKLogin address:", address);

      return address;
    } catch (error) {
      console.error("Error generating ZKLogin address:", error);
      console.error("JWT length:", jwt.length);
      console.error("Salt value:", salt);
      console.error("Salt type:", typeof salt);
      throw new Error("Failed to generate ZKLogin address");
    }
  }

  /**
   * Ensure salt is numeric for jwtToAddress compatibility
   * ZKLogin requires exactly 16 bytes (128 bits) for the salt
   */
  private ensureNumericSalt(salt: string): string {
    // If salt is already numeric, validate it's within 16-byte range
    if (/^\d+$/.test(salt)) {
      const saltBigInt = BigInt(salt);
      const maxValue = BigInt(2) ** BigInt(128) - BigInt(1); // 2^128 - 1 (16 bytes max)

      if (saltBigInt <= maxValue) {
        return salt;
      } else {
        console.warn("Salt exceeds 16-byte limit, truncating:", salt);
        return (saltBigInt % (maxValue + BigInt(1))).toString();
      }
    }

    console.warn("Converting non-numeric salt to 16-byte numeric salt:", salt);

    // Convert string to 16-byte salt using crypto
    if (typeof window !== "undefined" && window.crypto) {
      // Browser environment
      const encoder = new TextEncoder();
      const data = encoder.encode(salt);
      const array = new Uint8Array(16);

      // Use the string data to seed a deterministic 16-byte value
      for (let i = 0; i < 16; i++) {
        array[i] = data[i % data.length] ^ (i * 7); // Simple mixing
      }

      // Convert to BigInt string
      let result = "0";
      for (let i = 0; i < array.length; i++) {
        result = (BigInt(result) * BigInt(256) + BigInt(array[i])).toString();
      }

      console.log("Converted salt to 16-byte numeric:", result);
      return result;
    } else {
      // Fallback for Node.js environment
      const crypto = require("crypto");
      const hash = crypto.createHash("md5").update(salt).digest();

      // Convert MD5 hash (16 bytes) to BigInt string
      let result = "0";
      for (let i = 0; i < hash.length; i++) {
        result = (BigInt(result) * BigInt(256) + BigInt(hash[i])).toString();
      }

      console.log("Converted salt to 16-byte numeric:", result);
      return result;
    }
  }

  /**
   * Generate ZK proof for authentication
   */
  async generateZKProof(
    jwt: string,
    ephemeralKeyPair: Ed25519Keypair,
    maxEpoch: number,
    randomness: string,
    salt: string
  ): Promise<ZKProofResponse> {
    try {
      const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
        ephemeralKeyPair.getPublicKey()
      );

      const request: ZKProofRequest = {
        jwt,
        extendedEphemeralPublicKey: extendedEphemeralPublicKey.toString(),
        maxEpoch: maxEpoch.toString(),
        jwtRandomness: randomness,
        salt,
        keyClaimName: "sub",
      };

      console.log("Attempting to generate ZK proof with request:", request);

      // For development, use mock proof
      console.warn("Using mock ZK proof for development");
      return this.generateMockZKProof(jwt, salt, randomness);
    } catch (error) {
      console.error("Error generating ZK proof:", error);
      throw new Error("Failed to generate ZK proof");
    }
  }

  /**
   * Submit transaction using ZKLogin
   */
  async submitZKLoginTransaction(
    proof: ZKProofResponse,
    ephemeralKeyPair: Ed25519Keypair,
    maxEpoch: number
  ): Promise<string> {
    try {
      // This is a placeholder for actual transaction submission
      console.log("Submitting ZKLogin transaction:", {
        proof,
        ephemeralKeyPair,
        maxEpoch,
      });

      // Return a mock transaction hash
      return `0x${this.generateRandomHash()}`;
    } catch (error) {
      console.error("Error submitting ZKLogin transaction:", error);
      throw new Error("Failed to submit ZKLogin transaction");
    }
  }

  /**
   * Simple hash function for demo purposes
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate random hash for demo purposes
   */
  private generateRandomHash(): string {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate ZKLogin proof
   */
  async validateProof(proof: ZKProofResponse): Promise<boolean> {
    try {
      // This would validate the proof on-chain or with a verifier
      // For demo purposes, we'll just return true
      return true;
    } catch (error) {
      console.error("Error validating proof:", error);
      return false;
    }
  }

  /**
   * Generate a mock ZK proof for development testing
   */
  private generateMockZKProof(
    jwt: string,
    salt: string,
    randomness: string
  ): ZKProofResponse {
    console.warn("Using mock ZK proof - this is for development only!");

    // Generate deterministic mock values based on inputs
    const mockHash = this.hashString(jwt + salt + randomness);

    return {
      proofPoints: {
        a: [mockHash, (parseInt(mockHash, 16) % 1000000).toString(), "1"],
        b: [
          [
            (parseInt(mockHash, 16) % 2000000).toString(),
            (parseInt(mockHash, 16) % 3000000).toString(),
          ],
          [
            (parseInt(mockHash, 16) % 4000000).toString(),
            (parseInt(mockHash, 16) % 5000000).toString(),
          ],
          ["1", "0"],
        ],
        c: [
          (parseInt(mockHash, 16) % 6000000).toString(),
          (parseInt(mockHash, 16) % 7000000).toString(),
          "1",
        ],
      },
      issBase64Details: {
        value: "mock_iss_base64",
        indexMod4: 0,
      },
      headerBase64: "mock_header_base64",
    };
  }
}
