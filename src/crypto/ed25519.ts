import * as ed from '@noble/ed25519';

export interface KeyPair {
    privateKey: Uint8Array;
    publicKeyHex: string;
}

export async function generateIssuerKeyPair(): Promise<KeyPair> {
    const privateKey = ed.etc.randomBytes(32);
    const publicKeyBytes = await ed.getPublicKeyAsync(privateKey);
    const publicKeyHex = Buffer.from(publicKeyBytes).toString('hex');

    return { privateKey, publicKeyHex };
}

function serializePayload(payload: any): string {
    if (typeof payload === 'string') return payload;
    return JSON.stringify(payload, Object.keys(payload).sort());
}

export async function signPayload(payload: object, privateKey: Uint8Array): Promise<string> {
    const messageBytes = Buffer.from(JSON.stringify(payload));
    const signatureBytes = await ed.signAsync(messageBytes, privateKey);
    return Buffer.from(signatureBytes).toString('hex');
}

export async function verifySignature(
    signatureHex: string,
    payload: object,
    publicKeyHex: string
): Promise<boolean> {
    try {
        const signatureBytes = Buffer.from(signatureHex, 'hex');
        const messageString = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const messageBytes = Buffer.from(messageString);
        const publicKeyBytes = Buffer.from(publicKeyHex, 'hex');

        return await ed.verifyAsync(signatureBytes, messageBytes, publicKeyBytes);
    } catch (error) {
        return false;
    }
}