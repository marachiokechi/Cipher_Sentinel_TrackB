export class NonceManager {
    private activeNonces: Map<string, number> = new Map();

    public generateNonce(ttlMs: number = 5 * 60 * 1000): string {
        const nonce = `nonce_${crypto.randomUUID()}`;
        const expiresAt = Date.now() + ttlMs;
        this.activeNonces.set(nonce, expiresAt);
        return nonce;
    }

    public consumeNonce(nonce: string): boolean {
        const expiresAt = this.activeNonces.get(nonce);

        if (!expiresAt) {
        return false;
        }

        
        this.activeNonces.delete(nonce);

        if (Date.now() > expiresAt) {
        return false;
        }

        return true;
    }

    public cleanup(): void {
        const now = Date.now();
        for (const [nonce, expiresAt] of this.activeNonces.entries()) {
        if (now > expiresAt) {
            this.activeNonces.delete(nonce);
        }
        }
    }
}

export const nonceManager = new NonceManager();