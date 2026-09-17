import { generateIssuerKeyPair, signPayload } from "./crypto/ed25519.js";

    async function runClientTest() {
    const nonceRes = await fetch("http://localhost:3000/api/v1/nonce");
    const { nonce } = await nonceRes.json();
    console.log("1. Fetched Nonce:", nonce);

    const { privateKey, publicKeyHex } = await generateIssuerKeyPair();
    const claimPayload = {
        id: "CLAIM-200",
        subjectId: "USER-101",
        isOver18: true,
        expiresAt: Date.now() + 10000,
        nonce: nonce,
    };

    const signature = await signPayload(claimPayload, privateKey);
    const fullClaim = {
        ...claimPayload,
        issuerPublicKey: publicKeyHex,
        signature,
    };

    const verifyRes = await fetch("http://localhost:3000/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullClaim),
    });

    const result = await verifyRes.json();
    console.log("2. Verification Result:", result);
}

runClientTest();