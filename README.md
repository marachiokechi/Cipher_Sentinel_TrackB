# Sentinel Verification Node (Track B)
Stateless cryptographic verification engine with stateful single-use nonce management (TTL-backed) and selective-disclosure capabilities.

## Technical Architecture
* **Cryptography:** Ed25519 signature verification with deterministic JSON serialization (`@noble/ed25519`).
* **State Management:** In-memory `NonceManager` with active TTL expiration and single-use invalidation to prevent replay attacks.
* **Selective Disclosure:** SHA-256 salted commitment generation for zero-knowledge field verification.
* **API Layer:** Express.js endpoints exposing `/api/v1/nonce` and `/api/v1/verify`.

---

## API Documentation

### 1. Request Nonce
Generates a fresh single-use cryptographic token.

* **URL:** `/api/v1/nonce`
* **Method:** `GET`
* **Response (200 OK):**
```json
{
  "nonce": "nonce_ce823526-5f5a-430d-ac82-f347cd729609"
}
```

### 2. Verify Claim
Verifies an Ed25519-signed claim payload against the active nonce store.

* **URL:** `/api/v1/verify`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "id": "CLAIM-100",
  "subjectId": "USER-99",
  "isOver18": true,
  "expiresAt": 1750000000000,
  "nonce": "nonce_ce823526-5f5a-430d-ac82-f347cd729609",
  "issuerPublicKey": "<64-byte hex string>",
  "signature": "<12-byte hex string>"
}
```
* **Response (200 OK):**
```json
{
  "verified": true,
  "message": "Proof verified successfully."
}
```

---

## Local Execution & Testing
### Run full cryptographic & security assertion test suite
```bash
npx tsx src/index.ts
```
### Run selective disclosure commitment tests
```bash
npx tsx src/testDisclosure.ts
```
### Start Express server
```bash
npx tsx src/server.ts
```
### Run end-to-end API client test
```bash
npx tsx src/clientTest.ts
```