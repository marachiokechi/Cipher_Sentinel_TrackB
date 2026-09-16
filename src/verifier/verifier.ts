import { Claim  } from "./types.js";

export function verifyAgeClaim(claim: Claim, expectedNonce: string): boolean {
    const hasValidAge = claim.isOver18 === true;
    const hasSignature = claim.signature.trim() !== "";
    const hasPublicKey = claim.issuerPublicKey.trim() !== "";
    const isNotExpired = Date.now() < claim.expiresAt;
    const isValidNonce = claim.nonce === expectedNonce && claim.nonce.trim() !== "";

    return (
        hasValidAge &&
        hasSignature && 
        hasPublicKey &&
        isNotExpired &&
        isValidNonce
    );
};