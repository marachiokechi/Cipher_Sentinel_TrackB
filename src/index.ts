import assert from "node:assert";
import { Claim } from "./verifier/types.js";
import { verifyAgeClaim } from "./verifier/verifier.js";
import { verifySignature } from "./crypto/ed25519.js";

const activeNonce = "SESSION-9981-FDZ"

const validClaim: Claim = {
    id: "CLAIM-100",
    subjectId: "USER-99",
    isOver18: true,
    issuerPublicKey: "pub_key_b2c12",
    signature: "sig_5ff78",
    expiresAt: Date.now() + 10000,
    nonce: activeNonce,
};

function runTestSuite() {
    console.log("Running Sentinel Security Test Suite...");

    // Valid proof success
    assert.strictEqual(
        verifyAgeClaim(validClaim, activeNonce),
        true,
        "FAILED: Valid claim was rejected"
    );
    console.log("Test 1 Passes: Valid Claim accepted.");

// Expired Proof fails
const expiredClaim = {
    ...validClaim,
    expiresAt: Date.now() - 1000
};
assert.strictEqual(
    verifyAgeClaim(expiredClaim, activeNonce),
    false,
    "FAILED: Expired Claim was accepted"
);
console.log("Test 2 Passed: Expired Claim rejected.");

// Replayed/Mismatched Nonce Fails
const replayedClaim = { ...validClaim, nonce: "STALE_NONCE_999" };
  assert.strictEqual(
    verifyAgeClaim(replayedClaim, activeNonce),
    false,
    "FAILED: Replayed nonce was accepted"
  );
  console.log("Test 3 Passed: Replayed nonce rejected.");

  // Test 4: Underage payload fails
  const underageClaim = { ...validClaim, isOver18: false };
  assert.strictEqual(
    verifyAgeClaim(underageClaim, activeNonce),
    false,
    "FAILED: Underage claim was accepted"
  );
  console.log("Test 4 Passed: Underage claim rejected.");

  console.log("All 4 core security tests passed!");
}

runTestSuite();