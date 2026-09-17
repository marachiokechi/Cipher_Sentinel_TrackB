import { Claim, ClaimPayload } from "./types.js";
import { verifySignature } from "../crypto/ed25519.js";

export async function verifyAgeClaim(claim: Claim, expectedNonce: string): Promise<boolean> {
    const hasValidAge = claim.isOver18 === true;
    const hasSignature = claim.signature.trim() !== "";
    const hasPublicKey = claim.issuerPublicKey.trim() !== "";
    const isNotExpired = Date.now() < claim.expiresAt;
    const isValidNonce = claim.nonce === expectedNonce && claim.nonce.trim() !== "";

    if (!hasValidAge || !hasSignature || !hasPublicKey || !isNotExpired || !isValidNonce) {
        return false;
    }

    try {
        const payloadToVerify: ClaimPayload = {
        id: claim.id,
        subjectId: claim.subjectId,
        isOver18: claim.isOver18,
        expiresAt: claim.expiresAt,
        nonce: claim.nonce
        };

        return await verifySignature(claim.signature, payloadToVerify, claim.issuerPublicKey);
    } catch (error) {
        return false;
    }
};