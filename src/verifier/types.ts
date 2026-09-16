export interface Claim {
    id: string;
    subjectId: string;
    isOver18: boolean;
    issuerPublicKey: string;
    signature: string;
    expiresAt: number;
    nonce: string;
}

