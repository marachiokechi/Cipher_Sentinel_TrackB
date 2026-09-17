import { createHash, randomBytes } from "node:crypto";

export interface SaltingResult {
    saltedHash: string;
    salt: string;
}

export function createCommitment(fieldValue: string, salt?: string): SaltingResult {
    const generatedSalt = salt || randomBytes(16).toString("hex");
    const hash = createHash("sha256")
        .update(`${fieldValue}:${generatedSalt}`)
        .digest("hex");

    return {
        saltedHash: hash,
        salt: generatedSalt,
    };
}

export function verifyCommitment(fieldValue: string, salt: string, expectedHash: string): boolean {
    const { saltedHash } = createCommitment(fieldValue, salt);
    return saltedHash === expectedHash;
}