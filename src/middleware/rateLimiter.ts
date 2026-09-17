import rateLimit from "express-rate-limit";

export const nonceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: "Too many nonce requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

export const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many verification requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});