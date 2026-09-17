import { Router, Request, Response } from "express";
import { verifyAgeClaim } from "../verifier/verifier.js";
import { nonceManager } from "../security/nonceStore.js";
import { nonceLimiter, verifyLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.get("/nonce", nonceLimiter, (_req: Request, res: Response) => {
    const nonce = nonceManager.generateNonce();
    res.status(200).json({ nonce });
});

router.post("/verify", verifyLimiter, async (req: Request, res: Response) => {
    try {
        const claim = req.body;

        if (!claim || !claim.id || !claim.signature || !claim.nonce) {
        return res.status(400).json({
            error: "Invalid request payload. Missing claim metadata or signature."
        });
        }

        const isValid = await verifyAgeClaim(claim);

        if (!isValid) {
        return res.status(401).json({
            verified: false,
            message: "Verification failed. Claim signature is invalid, expired, or nonce was replayed."
        });
        }

        return res.status(200).json({
        verified: true,
        message: "Proof verified successfully."
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server verification error." });
    }
});

export default router;