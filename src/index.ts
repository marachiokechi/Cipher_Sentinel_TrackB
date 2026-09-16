import { Claim } from "./verifier/types.js";
import { verifyAgeClaim } from "./verifier/verifier.js";

const currentSessionNonce = "SESSION-9981-FDE"

const validClaim: Claim = {
    id: "CLAIM-101",
    subjectId: "USER-404",
    isOver18: true,
    issuerPublicKey: "a3f890b2c12",
    signature: "99e1a05ff78",
    expiresAt: Date.now() + 60000,
    nonce: currentSessionNonce,
};

const invalidClaim: Claim = {
    id: "CLAIM-102",
    subjectId: "USER-505",
    isOver18: false,
    issuerPublicKey: "a3f890b2c12",
    signature: "99e1a05fd63",
    expiresAt: Date.now() - 5000,
    nonce: currentSessionNonce,
};

const badNonceClaim: Claim = {
    ...validClaim,
    id: "CLAIM-103",
    nonce: "OLD-REPLAYED-NONCE",
}

console.log("Running Sentinel Extended Verifier Checks...");
console.log("Valid Claim:", verifyAgeClaim(validClaim, currentSessionNonce));
console.log("Expired Claim:", verifyAgeClaim(invalidClaim, currentSessionNonce));
console.log("Replayed Nonce Claim:", verifyAgeClaim(badNonceClaim, currentSessionNonce));