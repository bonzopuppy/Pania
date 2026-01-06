# Guides: Product Specification

> "Life is a journey. You don't need one guide — you need many."

---

## Core Concept

A daily companion app that listens to what's happening in your life, asks thoughtful questions, and surfaces wisdom from across spiritual and philosophical traditions — letting you discover which voices resonate with you.

**Not prescriptive. Not proselytizing. Just presence.**

---

## Core Flow

### Screen 1: Opening Prompt

Simple, warm, low-pressure.

```
┌─────────────────────────────────┐
│                                 │
│   Good evening, David.          │
│                                 │
│   What's on your mind?          │
│                                 │
│   ┌───────────────────────────┐ │
│   │                           │ │
│   │                           │ │
│   │                           │ │
│   └───────────────────────────┘ │
│                                 │
│   Or choose a prompt:           │
│   • Something happened today    │
│   • I'm struggling with...      │
│   • I'm grateful for...         │
│   • I need perspective on...    │
│                                 │
└─────────────────────────────────┘
```

**Design notes:**
- No quiz, no onboarding personality test
- You can write freely or use a prompt
- Feels like opening a journal, not an app

---

### Screen 2: Guided Clarification

AI asks 1-2 gentle questions to understand the emotional core.

```
┌─────────────────────────────────┐
│                                 │
│   "My boss dismissed my idea    │
│   in front of everyone today.   │
│   I felt so small."             │
│                                 │
│   ─────────────────────────     │
│                                 │
│   That sounds painful.          │
│                                 │
│   What stung most —             │
│   the public nature of it,      │
│   or feeling unheard?           │
│                                 │
│   ┌───────────────────────────┐ │
│   │                           │ │
│   └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**AI behavior:**
- Acknowledge first, always
- Ask ONE clarifying question
- Focus on emotion/meaning, not logistics
- Never diagnose or label

---

### Screen 3: Wisdom Surfaces

After understanding the situation, present 3-4 passages from different traditions.

```
┌─────────────────────────────────┐
│                                 │
│   Some voices on this:          │
│                                 │
│   ┌───────────────────────────┐ │
│   │ MARCUS AURELIUS           │ │
│   │ Stoic philosopher         │ │
│   │                           │ │
│   │ "It never ceases to       │ │
│   │ amaze me: we all love     │ │
│   │ ourselves more than       │ │
│   │ other people, but care    │ │
│   │ more about their opinion  │ │
│   │ than our own."            │ │
│   └───────────────────────────┘ │
│                                 │
│   ┌───────────────────────────┐ │
│   │ PAUL THE APOSTLE          │ │
│   │ Christian scripture       │ │
│   │                           │ │
│   │ "Am I now trying to win   │ │
│   │ the approval of human     │ │
│   │ beings, or of God?"       │ │
│   │ — Galatians 1:10          │ │
│   └───────────────────────────┘ │
│                                 │
│   ┌───────────────────────────┐ │
│   │ RUMI                      │ │
│   │ Sufi poet                 │ │
│   │                           │ │
│   │ "Why do you stay in       │ │
│   │ prison when the door      │ │
│   │ is so wide open?"         │ │
│   └───────────────────────────┘ │
│                                 │
│   ┌───────────────────────────┐ │
│   │ THICH NHAT HANH           │ │
│   │ Buddhist teacher          │ │
│   │                           │ │
│   │ "Letting go gives us      │ │
│   │ freedom, and freedom      │ │
│   │ is the only condition     │ │
│   │ for happiness."           │ │
│   └───────────────────────────┘ │
│                                 │
│   Which of these lands         │
│   for you today?               │
│                                 │
└─────────────────────────────────┘
```

**Key design decisions:**
- Always multiple traditions represented
- Brief attribution (name + tradition)
- Passages are short and punchy
- User chooses — app doesn't recommend

---

### Screen 4: Deeper Reflection

When user taps a passage, expand with context and reflection.

```
┌─────────────────────────────────┐
│                                 │
│   MARCUS AURELIUS               │
│   Roman Emperor, 161-180 AD     │
│   Stoic philosopher             │
│                                 │
│   "It never ceases to amaze     │
│   me: we all love ourselves     │
│   more than other people,       │
│   but care more about their     │
│   opinion than our own."        │
│                                 │
│   — Meditations, Book 12        │
│                                 │
│   ─────────────────────────     │
│                                 │
│   Marcus wrote this while       │
│   leading Rome through war      │
│   and plague. Even an emperor   │
│   wrestled with caring too      │
│   much what others thought.     │
│                                 │
│   ─────────────────────────     │
│                                 │
│   A question to sit with:       │
│                                 │
│   If your own opinion of your   │
│   idea matters more than your   │
│   boss's — what do YOU think    │
│   of it?                        │
│                                 │
│   ┌───────────────────────────┐ │
│   │ Save to journal           │ │
│   └───────────────────────────┘ │
│   ┌───────────────────────────┐ │
│   │ See another voice         │ │
│   └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

### Screen 5: Journey View (Over Time)

Show patterns in which traditions resonate.

```
┌─────────────────────────────────┐
│                                 │
│   Your Guides This Month        │
│                                 │
│   ████████████░░░  Stoics       │
│   ████████░░░░░░░  Buddhist     │
│   ████░░░░░░░░░░░  Christian    │
│   ███░░░░░░░░░░░░  Sufi         │
│                                 │
│   ─────────────────────────     │
│                                 │
│   You've been drawn to the      │
│   Stoics lately — especially    │
│   when facing situations        │
│   outside your control.         │
│                                 │
│   ─────────────────────────     │
│                                 │
│   │ Explore Stoicism deeper │   │
│   │ Read Meditations        │   │
│                                 │
└─────────────────────────────────┘
```

**This is the meta-insight:**
Over time, users discover their own spiritual fingerprint — which traditions speak to them, and when.

---

## Traditions & Thinkers

### Tier 1: Core Traditions (Launch)

| Tradition | Key Thinkers | Core Themes |
|-----------|--------------|-------------|
| **Stoicism** | Marcus Aurelius, Seneca, Epictetus | Control, resilience, virtue, acceptance |
| **Christianity** | Jesus, Paul, Solomon (Proverbs/Ecclesiastes), Augustine, C.S. Lewis | Grace, forgiveness, love, humility, hope |
| **Buddhism** | Buddha, Thich Nhat Hanh, Pema Chödrön | Attachment, impermanence, compassion, presence |
| **Sufism/Islamic mysticism** | Rumi, Hafiz, Al-Ghazali | Love, surrender, divine longing, joy |
| **Taoism** | Lao Tzu, Chuang Tzu | Flow, wu wei, simplicity, nature |
| **Judaism** | Psalms, Ecclesiastes, Hillel, Heschel | Justice, questioning, covenant, meaning |

### Tier 2: Expand Over Time

| Tradition | Key Thinkers |
|-----------|--------------|
| **Hindu philosophy** | Bhagavad Gita, Upanishads, Ramana Maharshi |
| **Transcendentalism** | Emerson, Thoreau, Whitman |
| **Existentialism** | Kierkegaard, Frankl, Camus |
| **Native American wisdom** | Black Elk, Chief Seattle (with cultural care) |
| **Confucianism** | Confucius, Mencius |
| **Modern spiritual teachers** | Ram Dass, Eckhart Tolle, Richard Rohr |

---

## Data Sources

### Public Domain Texts (Free to Use)

| Text | Source | Notes |
|------|--------|-------|
| **Bible (KJV, ASV, WEB)** | [Bible Gateway](https://www.biblegateway.com), [OpenBible](https://openbible.com) | KJV is public domain; many modern translations are not |
| **Meditations** (Marcus Aurelius) | [Project Gutenberg](https://gutenberg.org/ebooks/2680), [MIT Classics](http://classics.mit.edu) | Multiple translations available |
| **Letters from a Stoic** (Seneca) | Project Gutenberg | Public domain |
| **Enchiridion** (Epictetus) | Project Gutenberg, MIT Classics | Public domain |
| **Tao Te Ching** | Multiple translations on Gutenberg | Older translations are public domain |
| **Dhammapada** | [Access to Insight](https://accesstoinsight.org) | Theravada Buddhist texts, freely available |
| **Rumi** (older translations) | Various | Coleman Barks translations are copyrighted; older ones are public domain |
| **Bhagavad Gita** | Gutenberg, [sacred-texts.com](https://sacred-texts.com) | Multiple public domain translations |
| **Quran** | [quran.com](https://quran.com) API | Many translations available |
| **Torah / Hebrew Bible** | [Sefaria](https://sefaria.org) API | Excellent API with commentary |
| **Analects** (Confucius) | Project Gutenberg | Public domain |
| **Upanishads** | sacred-texts.com | Public domain translations |

### Structured APIs

| Source | What it offers | Access |
|--------|----------------|--------|
| **Sefaria** | Jewish texts with API | Free API, open source |
| **Bible API** | Multiple translations | Free tier available |
| **Quran.com API** | Full Quran with translations | Free |
| **OpenBible** | Topical Bible verses | Free |

### Curated Collections (Require Licensing or Creation)

| Need | Approach |
|------|----------|
| **Thich Nhat Hanh quotes** | May need licensing from Plum Village |
| **Pema Chödrön quotes** | Copyrighted — need licensing |
| **C.S. Lewis quotes** | Copyrighted — need licensing |
| **Modern teachers** | Build relationships, seek permission |

### Recommended Approach

**Phase 1: Build with public domain**
- Stoics (Marcus, Seneca, Epictetus) — all public domain
- Bible (KJV/ASV) — public domain
- Tao Te Ching — public domain
- Dhammapada — freely available
- Rumi (older translations) — public domain
- Bhagavad Gita — public domain

**Phase 2: Add APIs**
- Sefaria for Jewish texts
- Quran.com for Islamic texts

**Phase 3: License modern voices**
- Thich Nhat Hanh, Pema Chödrön, Richard Rohr, etc.
- These are beloved and worth paying for

---

## AI Behavior: Guiding Without Leading

### Core Principles

1. **Ask before telling**
   - Always understand the emotional core before surfacing wisdom
   - One clarifying question max, not an interrogation

2. **Surface, don't prescribe**
   - "Here are some voices on this" — not "Here's the answer"
   - Never say "You should..."

3. **Multiple perspectives, always**
   - Every response includes 3-4 traditions
   - User chooses what resonates

4. **No hidden agenda**
   - Don't weight toward any tradition
   - Don't editorialize or interpret unless asked

5. **Reflect patterns, gently**
   - "You've been drawn to Stoic voices lately"
   - Not "You're a Stoic"

### What the AI Should NOT Do

- Diagnose mental health conditions
- Provide therapy or medical advice
- Argue for any tradition's superiority
- Push toward conversion or belief
- Quote passages out of context to manipulate
- Pretend to be the thinkers themselves

### Sample AI Behaviors

**User:** "I'm so angry at my friend who betrayed me"

**Bad response:**
> "You should forgive them. The Bible says to turn the other cheek."

**Good response:**
> "Betrayal cuts deep. Is it the broken trust that hurts most, or losing someone you thought you knew?"
>
> [After user clarifies...]
>
> "Some voices on betrayal and what comes after:"
> - [Stoic passage on what we can control]
> - [Buddhist passage on attachment and letting go]
> - [Christian passage on forgiveness as freedom]
> - [Rumi on the wound being where light enters]
>
> "Which of these speaks to where you are right now?"

---

## Prompt Engineering Approach

### System Prompt (Conceptual)

```
You are a thoughtful companion who helps people find wisdom 
from across spiritual and philosophical traditions.

Your role:
1. Listen to what the user shares about their life
2. Ask ONE gentle clarifying question to understand the emotional core
3. Surface 3-4 passages from DIFFERENT traditions that speak to their situation
4. Let them choose what resonates — never prescribe
5. If they select a passage, provide brief context and a reflection question

You have access to a database of passages tagged by:
- Tradition (Stoic, Christian, Buddhist, Sufi, Taoist, Jewish, Hindu)
- Theme (loss, anger, fear, gratitude, purpose, relationships, work, etc.)
- Thinker (Marcus Aurelius, Jesus, Buddha, Rumi, Lao Tzu, etc.)

When surfacing wisdom:
- Always include multiple traditions
- Keep passages short (1-3 sentences)
- Provide brief attribution (Name + tradition)
- Never editorialize or rank them

Tone: Warm, present, unhurried. Like a wise friend who listens well.
```

### Passage Retrieval Logic

1. **Extract themes from user input**
   - "Boss dismissed my idea" → themes: [rejection, work, self-worth, external validation]

2. **Query passage database by theme**
   - Pull top passages tagged with relevant themes
   - Ensure diversity of traditions

3. **Rank by relevance to emotional core**
   - The clarifying question helps weight this

4. **Surface 3-4 passages**
   - One Stoic, one religious, one Eastern, one poetic (for example)
   - Vary the mix based on what's available

---

## Data Model

### Passage Schema

```json
{
  "id": "ma-med-12-4",
  "text": "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
  "thinker": "Marcus Aurelius",
  "thinker_dates": "121-180 AD",
  "tradition": "Stoicism",
  "source": "Meditations",
  "source_location": "Book 12, Chapter 4",
  "themes": ["external validation", "self-worth", "opinion of others", "self-love"],
  "contexts": ["rejection", "criticism", "people-pleasing", "work"],
  "brief_context": "Written during his reign as Roman Emperor, while facing war and plague.",
  "reflection_questions": [
    "Whose opinion are you valuing more than your own right now?",
    "What would change if you trusted your own judgment here?"
  ]
}
```

### User Journey Schema

```json
{
  "user_id": "...",
  "entries": [
    {
      "date": "2025-12-30",
      "prompt": "What's on your mind?",
      "user_input": "My boss dismissed my idea in front of everyone.",
      "clarifying_question": "What stung most — the public nature, or feeling unheard?",
      "user_clarification": "Being unheard. Like my contribution doesn't matter.",
      "passages_shown": ["ma-med-12-4", "gal-1-10", "rumi-prison", "tnh-letting-go"],
      "passage_selected": "ma-med-12-4",
      "saved_to_journal": true
    }
  ],
  "tradition_affinity": {
    "Stoicism": 14,
    "Christianity": 8,
    "Buddhism": 11,
    "Sufism": 5
  }
}
```

---

## MVP Scope

### Week 1-2: Core Data
- [ ] Curate 200 passages across 6 traditions
- [ ] Tag with themes, contexts, reflection questions
- [ ] Build simple JSON database

### Week 3-4: Core Flow
- [ ] Opening prompt screen
- [ ] AI clarifying question
- [ ] Passage surfacing (3-4 per response)
- [ ] Selection and expansion

### Week 5-6: Polish
- [ ] Journey view (which traditions resonate)
- [ ] Save to journal
- [ ] Basic onboarding (name only, no quiz)

### Post-MVP
- [ ] Add more traditions
- [ ] License modern teachers
- [ ] Audio readings of passages
- [ ] Push notification: "Good morning. What's on your mind?"
- [ ] Community (optional) — share anonymous reflections

---

## Open Questions

1. **Name?** 
   - Guides, Sages, Compass, Council, Waymarks?

2. **Voice recordings?**
   - Would it be meaningful to hear passages read aloud?

3. **Community?**
   - Anonymous sharing of reflections? Or keep it private?

4. **Monetization?**
   - Freemium (limited traditions free, all with subscription)?
   - Straight subscription ($5-10/mo)?

5. **Platform?**
   - Mobile-first? Or web too?

---

## Why This Could Work

| Factor | Assessment |
|--------|------------|
| **Market** | "Spiritual but not religious" = 30%+ of Americans, growing |
| **Habit** | Daily check-in, like journaling — high retention potential |
| **Differentiation** | Cross-tradition without agenda is underserved |
| **AI fit** | Perfect use case — empathy, synthesis, personalization |
| **Founder fit** | You'd use it yourself |

---

*Built with care. December 2025.*
