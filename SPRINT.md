# Pania Sprint Tracker

Current: **Sprint 2d — Journal UX & Features + Sprint 3 Monetization**

---

## In Progress

### Bugs
- [ ] Follow-ups to initial voice card not being saved

### Sprint 2d: Journal UX & Features
- [ ] Delete individual journal entries from the UI
- [ ] Conversational follow-up after voice selection
- [ ] Privacy Pledge page (Day One-style, plain language)
- [ ] Data export feature

### v1.x Near-term
- [ ] Timestamps on all entries
- [ ] Multiple cards display on My Journals page — rethink layout

## Backlog

### Sprint 3: Monetization
- [ ] Implement paid feature gating (voice counter, server-side enforcement)
- [ ] Integrate payment provider (RevenueCat for App Store / Google Play IAP)
- [ ] Build upgrade UX (interstitial, voice counter, scholarship flow)

### Sprint 3.5: Android Launch
- [ ] Expo EAS build configuration for Android
- [ ] Google Play Console setup (listing, screenshots, metadata)
- [ ] Google Play Billing products (mirror App Store via RevenueCat)
- [ ] Android-specific testing (Keystore encryption, OAuth redirects, UI)
- [ ] Play Store review and release

### Sprint 4: Push Notifications
- [ ] Daily wisdom reminders
- [ ] Journal prompts / check-in nudges
- [ ] Notification preferences and scheduling

### Sprint 5: Streak Tracking
- [ ] Track consecutive days of engagement
- [ ] Visual streak indicator in the UI
- [ ] Streak milestones / encouragement

### Sprint 6: Personalization
- [ ] Tradition preferences (favorite/prioritize certain traditions)
- [ ] Tailored wisdom based on journal history and themes
- [ ] Adaptive question depth based on user engagement

### Sprint 7: Deeper Journaling
- [ ] Extended journal sessions with follow-up questions
- [ ] Journal entry summaries and insights over time
- [ ] Reflection history and patterns

## Completed

- [x] Sprint 0: Privacy & Security — API key server-side, client-side encryption, PII scrubbing (2026-02-14)
- [x] Sprint 1: Authentication — Google OAuth, Apple OAuth (2026-02-14)
- [x] Sprint 2a: Quick Performance Wins — Haiku for classification, auth caching, prompt optimization, skeleton cards (2026-02-14)
- [x] Sprint 2b: Streaming — SSE from Anthropic through Edge Function to client (2026-02-14)
- [x] Monetization model decided — freemium with voice-based gating (2026-02-14)
