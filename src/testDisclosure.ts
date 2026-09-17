import { createCommitment, verifyCommitment } from "./verifier/selectiveDisclosure.js";

    function testSelectiveDisclosure() {
    console.log("Testing Selective Disclosure Commitment Engine...");

    const secretId = "USER-99";

    const { saltedHash, salt } = createCommitment(secretId);
    console.log("1. Generated Commitment Hash:", saltedHash);
    console.log("2. Generated Salt:", salt);

    const isValid = verifyCommitment(secretId, salt, saltedHash);
    console.log("3. Valid Commitment Check:", isValid ? "PASSED" : "FAILED");

    const isTamperedValid = verifyCommitment("USER-100", salt, saltedHash);
    console.log("4. Tampered Input Rejection:", !isTamperedValid ? "PASSED" : "FAILED");
}

testSelectiveDisclosure();