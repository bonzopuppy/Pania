# Sprints

## Completed

### Sprint 0: Privacy & Security (Before Launch)
- ~~Move Anthropic API key server-side (Supabase Edge Function proxy)~~ — Done
- ~~Client-side encryption for stored content (AES-256-GCM via @noble/ciphers)~~ — Done
- ~~Anonymize entries before sending to AI (strip PII before sending to Anthropic)~~ — Done
- ~~Rotate exposed Anthropic API key~~ — Done
- ~~Add Privacy Policy and Terms of Service links in the app profile screen~~ — Done

### Sprint 1: Authentication
- ~~Hook up Google OAuth (replace "Coming Soon" alert with real sign-in)~~ — Done
- ~~Hook up Apple OAuth (replace "Coming Soon" alert with real sign-in)~~ — Done

### Sprint 2a: Quick Performance Wins
Targeted optimizations that reduce card retrieval latency with minimal risk. Combined impact: ~40-60% perceived improvement.

1. **Use Haiku for classification** — Switch `classifyIntent()` from Sonnet to `claude-haiku-4-5-20251001`. Simple yes/no classification doesn't need Sonnet-level reasoning. 3-5x faster, 10-12x cheaper. Lower `max_tokens` from 1024 → 64.
2. **Reduce auth overhead** — Cache user email in `AIService` instead of calling `supabase.auth.getUser()` on every `anonymizeText()` call (~100-300ms round-trip wasted per API call). Parallelize the 3 sequential `anonymizeText()` calls in `getWisdomPassages()` with `Promise.all`.
3. **Prompt optimization** — Lower `max_tokens` per call type (256 for clarify, 64 for classification, keep 1024 for wisdom). Add explicit length constraints to prompts ("Keep acknowledgment under 15 words"). Use JSON prefill (pre-seed assistant response with `{`) to eliminate markdown wrapping and the regex extraction step.
4. **UX: Skeleton cards + staggered reveal** — Show 4 placeholder cards with pulsing gray shapes during loading (skeleton screens reduce perceived latency 20-30%). Stagger card appearance with 150-200ms delays. Use rotating loading messages ("Searching across traditions...", "Gathering voices...").

### Sprint 2b: Streaming & Prefetching
Higher-impact changes that transform the loading experience. Combined impact: near-instant perceived card delivery.

5. **Streaming responses** — Stream from Anthropic → Edge Function (SSE passthrough) → client (`expo/fetch` or `react-native-sse`). Time-to-first-token drops from 2-5s to ~200-500ms. For JSON responses, accumulate chunks then parse on stream complete. Requires Edge Function changes to pipe SSE and client-side stream consumer.
6. **Speculative prefetching** — Start generating wisdom cards (with empty clarification) while user reads/answers the clarifying question. If the clarification aligns with the initial input, skip the second wait entirely. Discard and re-fetch if the user's clarification significantly changes direction. ~30-50% reduction on second API call.

### Sprint 2c: Future Performance Enhancements
Optimizations to revisit when the app scales or prompts evolve.

7. **Prompt caching** — Anthropic's cache requires 1024+ tokens for Sonnet. Current system prompts are ~200-300 tokens — too small. Becomes viable if we add few-shot examples or richer tradition descriptions to improve quality AND cross the threshold. Cache hits reduce latency up to 85% and cost up to 90% for the cached portion. 5-minute TTL, refreshed on use.
8. **Structured outputs** — Anthropic's structured output mode guarantees valid JSON schema compliance. Eliminates regex extraction and parsing failures. Slight first-request overhead (100-300ms for schema compilation, cached 24h). Particularly valuable combined with streaming.
9. **Edge Function warm-up** — Supabase cold starts are already fast (~42ms avg, P99 <500ms). Cron ping every 4 minutes to keep isolates warm. Only matters for first request after long inactivity — diminishing returns for active users.

### Sprint 2d: Journal UX & Features
- Delete individual journal entries from the UI
- Conversational follow-up after voice selection (retrieve only initial 4 voice cards, one card per reflection; after selection, allow the user to chat with the AI using guided prompts and parameters instead of retrieving additional cards)
- Day One-style Privacy Pledge page (plain language, not legalese — "your entries are yours, we can't read them, we don't sell data, AI doesn't train on your data, delete means delete")
- Data export feature (let users export all their data regardless of subscription status)

### Sprint 3: Monetization — [Full Spec](monetization.md)
- ~~Decide on paywall model (freemium vs straight subscription)~~ — Done (freemium with voice-based gating)
- Implement paid feature gating (voice counter, server-side enforcement)
- Integrate payment provider (App Store / Google Play IAP via RevenueCat)
- Build upgrade UX (interstitial, voice counter, scholarship flow)

### Sprint 3.5: Android Launch
- Expo EAS build configuration for Android
- Google Play Console setup (listing, screenshots, metadata)
- Google Play Billing products (mirror App Store products via RevenueCat)
- Android-specific testing (Keystore encryption, OAuth redirects, UI differences)
- Play Store review and release

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
