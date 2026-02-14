# Sprints

## Completed

### Sprint 0: Privacy & Security (Before Launch)
- ~~Move Anthropic API key server-side (Supabase Edge Function proxy)~~ — Done
- ~~Client-side encryption for stored content (AES-256-GCM via @noble/ciphers)~~ — Done
- ~~Anonymize entries before sending to AI (strip PII before sending to Anthropic)~~ — Done
- ~~Rotate exposed Anthropic API key~~ — Done
- Day One-style Privacy Pledge page (plain language, not legalese — "your entries are yours, we can't read them, we don't sell data, AI doesn't train on your data, delete means delete")
- Data export feature (let users export all their data regardless of subscription status)
- ~~Add Privacy Policy and Terms of Service links in the app profile screen~~ — Done

### Sprint 1: Authentication
- ~~Hook up Google OAuth (replace "Coming Soon" alert with real sign-in)~~ — Done
- ~~Hook up Apple OAuth (replace "Coming Soon" alert with real sign-in)~~ — Done

### Sprint 2: Card Loading Performance
- Reduce initial card retrieval time (optimize API calls, prompt, or response streaming)
- Loading UX strategy (skeleton cards, progressive reveal, or animation to mask latency)

### Sprint 3: Monetization
- Decide on paywall model (freemium vs straight subscription)
- Implement paid feature gating
- Integrate payment provider (App Store / Google Play IAP)

### Sprint 4: Push Notifications
- Daily wisdom reminders
- Journal prompts / check-in nudges
- Notification preferences and scheduling

### Sprint 5: Streak Tracking
- Track consecutive days of engagement
- Visual streak indicator in the UI
- Streak milestones / encouragement

### Sprint 6: Personalization
- Tradition preferences (favorite/prioritize certain traditions)
- Tailored wisdom based on journal history and themes
- Adaptive question depth based on user engagement

### Sprint 7: Deeper Journaling
- Extended journal sessions with follow-up questions
- Journal entry summaries and insights over time
- Reflection history and patterns

## Post-Launch: Privacy Enhancements
- Cloud encryption key backup (iCloud Keychain sync for iOS, Google encrypted backup for Android)
- Zero Data Retention agreement with Anthropic (eliminates even the 30-day API log window)
- Biometric / passcode app lock
- On-device AI for sensitive classification tasks (reduce content sent to Anthropic)
- Switch OAuth from implicit flow to PKCE (Proof Key for Code Exchange) for defense-in-depth
- Third-party security audit
