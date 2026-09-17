import assert from "node:assert";
import { Claim } from "./verifier/types.js";
import { verifyAgeClaim } from "./verifier/verifier.js";
import { generateIssuerKeyPair, signPayload } from "./crypto/ed25519.js";
import { nonceManager } from "./security/nonceStore.js";

async function runTestSuite() {
    console.log("Running Sentinel Integrated Crypto & Security Test Suite...");

    const activeNonce = nonceManager.generateNonce()

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

        // Valid Claim with active nonce passes
        assert.strictEqual(
            await verifyAgeClaim(validClaim),
            true,
            "FAILED: Valid Claim rejected"
        );
        console.log("Test 1 Passed: Valid Ed25519 Claim with active nonce accepted.");

    // Tampered Payload
    const tamperNonce = nonceManager.generateNonce();
    const tamperedPayload = { ...claimPayload, isOver18: false, nonce: tamperNonce };
    const tamperedClaim: Claim = {
        ...tamperedPayload,
        issuerPublicKey: publicKeyHex,
        signature: validSignature,
    };
    assert.strictEqual(
        await verifyAgeClaim(tamperedClaim),
        false,
        "FAILED: Tampered payload accepted"
    );
    console.log("Test 2 Passed: Tampered claim signature rejected.");

    // Expired Claim
    const expireNonce = nonceManager.generateNonce();
    const expiredPayload = { ...claimPayload, expiresAt: Date.now() - 1000, nonce: expireNonce };
    const expiredSignature = await signPayload(expiredPayload, privateKey);
    const expiredClaim: Claim = {
        ...expiredPayload,
        issuerPublicKey: publicKeyHex,
        signature: expiredSignature,
    };
    assert.strictEqual(
        await verifyAgeClaim(expiredClaim),
        false,
        "FAILED: Expired Claim accepted"
    );
    console.log("Test 3 Passed: Expired Claim rejected.");

    // Replayed/Invalid Nonce
    const replayedClaim: Claim = { ...validClaim, nonce: "STALE_NONCE_999" };
    assert.strictEqual(
        await verifyAgeClaim(replayedClaim),
        false,
        "FAILED: Replayed nonce accepted"
    );
    console.log("Test 4 Passed: Replayed nonce rejected.");

    console.log("Cryptographic verification engine verified end-to-end!");
}

runTestSuite();