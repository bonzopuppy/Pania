/**
 * AI Service for Pania
 * Handles communication with Claude API for clarifying questions and passage retrieval
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Types for our AI responses
export interface ClarifyResponse {
  acknowledgment: string;
  question: string;
}

export interface Passage {
  id: string;
  tradition: 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';
  thinker: string;
  thinkerDates?: string;
  role: string;
  text: string;
  source?: string;
  context: string;
  reflectionQuestion: string;
}

export interface WisdomResponse {
  passages: Passage[];
}

export interface ReflectionAcknowledgmentResponse {
  acknowledgment: string;
}

export interface IntentClassificationResponse {
  intent: 'wants_more_voices' | 'continue_reflecting';
  confidence: number;
}

// System prompts
const CLARIFY_SYSTEM_PROMPT = `You are a thoughtful companion in a spiritual wisdom app called Pania. Your role is to help users explore what's on their mind before surfacing wisdom from various traditions.

When a user shares something, you should:
1. Provide a brief, warm acknowledgment (1 short sentence)
2. Ask ONE gentle clarifying question to understand the emotional core

Guidelines:
- Never diagnose, label, or give advice
- Focus on feelings and meaning, not logistics
- Keep your tone warm, present, and unhurried
- The question should help surface what really matters to them

Respond in JSON format:
{
  "acknowledgment": "Brief warm acknowledgment",
  "question": "Your single clarifying question"
}`;

const WISDOM_SYSTEM_PROMPT = `You are a thoughtful companion in a spiritual wisdom app called Pania. Based on what the user has shared, surface 4 passages from different spiritual and philosophical traditions that speak to their situation.

Available traditions (use exactly these names):
- stoicism
- christianity
- buddhism
- sufism
- taoism
- judaism

For each passage:
- Use real, accurate quotes from public domain texts or well-known teachings
- Include proper attribution (thinker name, their role/tradition, source if known)
- Provide brief historical context about the thinker
- Create a personalized reflection question based on the user's specific situation

Guidelines:
- Always include passages from at least 3-4 DIFFERENT traditions
- Keep quotes short and punchy (1-3 sentences)
- Never editorialize or rank the passages
- The reflection question should connect the wisdom to their specific situation

Respond in JSON format:
{
  "passages": [
    {
      "id": "unique-id",
      "tradition": "stoicism",
      "thinker": "Marcus Aurelius",
      "thinkerDates": "121-180 AD",
      "role": "Roman Emperor, Stoic philosopher",
      "text": "The quote here",
      "source": "Meditations, Book 4",
      "context": "Brief context about when/why this was written",
      "reflectionQuestion": "A question connecting this to their situation"
    }
  ]
}`;

const INTENT_CLASSIFICATION_PROMPT = `You are a text classifier for a spiritual reflection app.

Context: The system just asked the user "Would you like to hear more voices on this?"

Classify the user's response into ONE of these categories:
- "wants_more_voices": User wants to see more passages (e.g., "yes", "sure", "more please", "I'd like that", "absolutely", "why not")
- "continue_reflecting": User wants to continue their current reflection or is sharing more thoughts (e.g., "let me think", "not yet", "I'm still processing", or any substantive reflection text)

Respond in JSON format only:
{"intent": "wants_more_voices", "confidence": 0.95}`;

class AIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async callClaude(systemPrompt: string, userMessage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not set. Call setApiKey() first.');
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async getClarifyingQuestion(userInput: string): Promise<ClarifyResponse> {
    const response = await this.callClaude(
      CLARIFY_SYSTEM_PROMPT,
      `The user shared: "${userInput}"`
    );

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]) as ClarifyResponse;
    } catch (e) {
      console.error('Failed to parse clarify response:', response);
      // Fallback response
      return {
        acknowledgment: 'That sounds meaningful.',
        question: 'What feeling comes up most strongly when you think about this?',
      };
    }
  }

  async getWisdomPassages(
    userInput: string,
    clarification: string,
    conversationContext?: string,    // Full conversation summary
    excludeThinkers?: string[]       // Previously shown thinker names
  ): Promise<WisdomResponse> {
    const userMessage = `The user initially shared: "${userInput}"

When asked to clarify, they said: "${clarification}"

${conversationContext ? `Additional context from the conversation:\n${conversationContext}\n` : ''}${excludeThinkers?.length ? `IMPORTANT: Do NOT include passages from these thinkers who were already shown: ${excludeThinkers.join(', ')}\n` : ''}
Please surface 4 NEW passages from different traditions that speak to this situation.`;

    const response = await this.callClaude(
      WISDOM_SYSTEM_PROMPT,
      userMessage
    );

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]) as WisdomResponse;
    } catch (e) {
      console.error('Failed to parse wisdom response:', response);
      // Return fallback passages
      return {
        passages: getFallbackPassages(),
      };
    }
  }

  async getReflectionAcknowledgment(
    userInput: string,
    selectedVoice: Passage,
    reflection: string
  ): Promise<ReflectionAcknowledgmentResponse> {
    const systemPrompt = `You are a thoughtful companion helping someone reflect on wisdom.

The user shared: "${userInput}"
They read this passage from ${selectedVoice.thinker}: "${selectedVoice.text}"
They reflected: "${reflection}"

Respond with a brief, warm acknowledgment (2-3 sentences) that:
- Honors their reflection
- Connects it to the wisdom they encountered
- Feels genuine, not formulaic

Then, in a SEPARATE paragraph (use \\n\\n), ask if they'd like to hear more voices on this.

Respond with JSON: { "acknowledgment": "your response with two paragraphs separated by \\n\\n" }`;

    const response = await this.callClaude(systemPrompt, reflection);

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]) as ReflectionAcknowledgmentResponse;
    } catch (e) {
      console.error('Failed to parse reflection acknowledgment response:', response);
      // Fallback response
      return {
        acknowledgment: "Thank you for sharing that reflection.\n\nWould you like to hear more voices on this?",
      };
    }
  }

  async classifyIntent(userMessage: string): Promise<IntentClassificationResponse> {
    const response = await this.callClaude(INTENT_CLASSIFICATION_PROMPT, userMessage);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]) as IntentClassificationResponse;
    } catch (e) {
      console.error('Failed to parse intent classification:', response);
      // Fallback: treat as continue_reflecting to be safe
      return {
        intent: 'continue_reflecting',
        confidence: 0.5,
      };
    }
  }
}

// Fallback passages in case API fails
function getFallbackPassages(): Passage[] {
  return [
    {
      id: 'ma-med-12-4',
      tradition: 'stoicism',
      thinker: 'Marcus Aurelius',
      thinkerDates: '121-180 AD',
      role: 'Stoic philosopher',
      text: '"It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own."',
      source: 'Meditations',
      context: 'Written during his reign as Roman Emperor, while facing war and plague.',
      reflectionQuestion: 'Whose opinion are you valuing more than your own right now?',
    },
    {
      id: 'gal-1-10',
      tradition: 'christianity',
      thinker: 'Paul the Apostle',
      role: 'Christian scripture',
      text: '"Am I now trying to win the approval of human beings, or of God?"',
      source: 'Galatians 1:10',
      context: 'Paul wrote this letter defending his message against those who questioned his authority.',
      reflectionQuestion: 'Whose approval are you seeking right now?',
    },
    {
      id: 'rumi-prison',
      tradition: 'sufism',
      thinker: 'Rumi',
      thinkerDates: '1207-1273',
      role: 'Sufi poet',
      text: '"Why do you stay in prison when the door is so wide open?"',
      context: 'Rumi was a 13th-century Persian poet whose work explores themes of divine love and freedom.',
      reflectionQuestion: 'What door might be open for you that you haven\'t walked through?',
    },
    {
      id: 'tnh-letting-go',
      tradition: 'buddhism',
      thinker: 'Thich Nhat Hanh',
      thinkerDates: '1926-2022',
      role: 'Buddhist teacher',
      text: '"Letting go gives us freedom, and freedom is the only condition for happiness."',
      context: 'Thich Nhat Hanh was a Vietnamese Buddhist monk who taught mindfulness for over 60 years.',
      reflectionQuestion: 'What would you need to let go of to feel more free right now?',
    },
  ];
}

// Export singleton instance with API key initialized
import { ANTHROPIC_API_KEY } from './config';

const aiServiceInstance = new AIService();
if (ANTHROPIC_API_KEY) {
  aiServiceInstance.setApiKey(ANTHROPIC_API_KEY);
}
export const aiService = aiServiceInstance;
