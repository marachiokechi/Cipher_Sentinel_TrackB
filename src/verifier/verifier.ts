import { Claim  } from "./types.js";

export function verifyAgeClaim(claim: Claim): boolean {
    const hasValidAge = claim.isOver18 === true;
    const hasSignature = claim.signature.trim() !== "";
    const hasPublicKey = claim.issuerPublicKey.trim() !== "";
    return hasValidAge && hasSignature && hasPublicKey;
};