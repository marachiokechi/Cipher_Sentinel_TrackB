import assert from "node:assert";
import { Claim } from "./verifier/types.js";
import { verifyAgeClaim } from "./verifier/verifier.js";
import { generateIssuerKeyPair, signPayload } from "./crypto/ed25519.js";

async function runTestSuite() {
    console.log("Running Sentinel Integrated Crypto & Security Test Suite...");

    const activeNonce = "SESSION-9981-FDZ"

    const { privateKey, publicKeyHex } = await generateIssuerKeyPair();

    const claimPayload = {
        id: "CLAIM-100",
        subjectId: "USER-99",
        isOver18: true,
        expiresAt: Date.now() + 10000,
        nonce: activeNonce,
    };

    const validSignature = await signPayload(claimPayload, privateKey);

    const validClaim: Claim = {
        ...claimPayload,
        issuerPublicKey: publicKeyHex,
        signature: validSignature
    };

        // Real cryptographic proof passes
        assert.strictEqual(
            await verifyAgeClaim(validClaim, activeNonce),
            true,
            "FAILED: Real cryptographic proof rejected"
        );
        console.log("Test 1 Passed: Valid Ed25519 Claim accepted.");

    // Tampered payload fails cryptographic check
    const tamperedClaim: Claim = {
        ...validClaim,
        isOver18: false
    };
    assert.strictEqual(
        await verifyAgeClaim(tamperedClaim, activeNonce),
        false,
        "FAILED: Tampered payload accepted"
    );
    console.log("Test 2 Passed: Tampered claim signature rejected.");

    // Expired proof fails
    const expiredClaim = {
        ...validClaim,
        expiresAt: Date.now() - 1000
    };
    assert.strictEqual(
        await verifyAgeClaim(expiredClaim, activeNonce),
        false,
        "FAILED: Expired Claim accepted"
    );
    console.log("Test 3 Passed: Expired Claim rejected.");

    // Replayed/Mismatched Nonce Fails
    const replayedClaim = { ...validClaim, nonce: "STALE_NONCE_999" };
    assert.strictEqual(
        await verifyAgeClaim(replayedClaim, activeNonce),
        false,
        "FAILED: Replayed nonce accepted"
    );
    console.log("Test 4 Passed: Replayed nonce rejected.");

    console.log("Cryptographic verification engine verified end-to-end!");
}

runTestSuite();