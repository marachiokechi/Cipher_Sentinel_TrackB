import * as ed from '@noble/ed25519';

import { Buffer } from 'buffer'

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
        const messageBytes = Buffer.from(JSON.stringify(payload));
        const publicKeyBytes = Buffer.from(publicKeyHex, 'hex');

        return await ed.verifyAsync(signatureBytes, messageBytes, publicKeyBytes);
    } catch (error) {
        return false;
    }
}