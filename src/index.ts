import { Claim } from "./verifier/types.js";
import { verifyAgeClaim } from "./verifier/verifier.js";

const validClaim: Claim = {
    id: "CLAIM-101",
    subjectId: "USER-404",
    isOver18: true,
    issuerPublicKey: "a3f890b2c12",
    signature: "99e1a05ff78"
};

const invalidClaim: Claim = {
    id: "CLAIM-102",
    subjectId: "USER-505",
    isOver18: false,
    issuerPublicKey: "a3f890b2c12",
    signature: "99e1a05fd63"
};

console.log("Running Sentinel Verifier Offline Checks...");
console.log("Valid Claim Result:", verifyAgeClaim(validClaim));
console.log("Invalid Claim Result:", verifyAgeClaim(invalidClaim));