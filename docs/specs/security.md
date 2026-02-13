# Pania Security & Privacy

## Our Principle

Your journal is yours. We can't read it, we don't sell it, and AI doesn't train on it.

---

## What We've Done (Sprint 0)

### API Key Protection
- The Anthropic API key **never touches the client**. It lives as a secret on our Supabase Edge Function (`claude-proxy`), which acts as a secure proxy between the app and Claude.
- Only authenticated users can make AI calls — the edge function verifies the user's JWT before forwarding anything to Anthropic.
- The `@anthropic-ai/sdk` package was removed from the client bundle entirely.

### Client-Side Encryption (AES-256-GCM)
- Sensitive journal fields (`user_input`, `clarification`, `notes`, `conversation_data`) are **encrypted on the device before they ever leave it**.
- We use AES-256-GCM via `@noble/ciphers` (audited by Trail of Bits, zero native dependencies).
- The encryption key is generated per-device and stored in iOS Keychain / Android Keystore via `expo-secure-store`. We never see it.
- Even with full database access, journal content is unreadable — it's base64 ciphertext in Supabase.
- Public/non-personal fields (tradition, thinker, passage text, source, context, reflection question) are **not encrypted** — these are published wisdom, not user data.

### PII Scrubbing Before AI
- Before any text is sent to Anthropic, we strip:
  - Email addresses
  - Phone numbers (US + international)
  - SSNs, credit card numbers, UUIDs
  - The user's known name and email (from their profile/auth)
- Claude never sees who you are — only what you're reflecting on.

### Account Deletion
- Deleting your account destroys the device encryption key, making all encrypted data permanently unrecoverable.
- All journal entries and profile data are deleted from Supabase.

---

## What's Left To Do

### Near-Term
- ~~**Rotate the Anthropic API key**~~ — Done. Old exposed key revoked, new key set via Supabase secrets only.
- **Cloud encryption key backup** — right now, key loss = data loss. We need iCloud Keychain sync (iOS) and Google encrypted backup (Android) so users don't lose entries when they switch devices.
- **Privacy Pledge page** — Day One-style plain language page in the app: "your entries are yours, we can't read them, we don't sell data, AI doesn't train on your data, delete means delete."
- **Data export** — let users export all their data regardless of subscription status.
- **Handle unauthenticated AI calls gracefully** — AI now requires auth. Show a signup prompt instead of a cryptic error when logged-out users try to chat.

### Post-Launch
- **Zero Data Retention agreement with Anthropic** — eliminates even the 30-day API log window.
- **Biometric / passcode app lock** — extra layer before the app opens.
- **On-device AI for sensitive classification** — reduce what gets sent to Anthropic at all.
- **Third-party security audit** — independent verification of our encryption and data handling.

---

## Talking Points

**"Can you read my journal?"**
No. Journal entries are encrypted on your device before they're stored. We don't have the key.

**"Does AI train on my data?"**
No. We use Anthropic's API which has a zero-retention policy for API usage. We're also pursuing a formal Zero Data Retention agreement. On top of that, we scrub personal information before anything reaches AI.

**"What happens if I delete my account?"**
Everything goes — your entries, your profile, and your encryption key. Encrypted data becomes permanently unrecoverable.

**"What if someone hacks your database?"**
They'd see encrypted gibberish for all personal content. The encryption keys live on users' devices, not on our servers.

**"What data does the AI see?"**
The emotional content of what you share — but not who you are. We strip names, emails, phone numbers, and other identifiers before sending anything to Claude.

**"What about my encryption key — what if I lose my phone?"**
Right now, the key lives on-device only. Key loss means data loss. Cloud key backup (via iCloud Keychain and Google encrypted backup) is our top privacy priority for the next sprint.
