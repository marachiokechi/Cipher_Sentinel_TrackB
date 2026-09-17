export interface Claim {
    id: string;
    subjectId: string;
    isOver18: boolean;
    issuerPublicKey: string;
    signature: string;
    expiresAt: number;
    nonce: string;
};

export interface ClaimPayload {
    id: string;
    subjectId: string;
    isOver18: boolean;
    expiresAt: number;
    nonce: string;
};

