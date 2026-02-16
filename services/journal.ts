import { supabase, JournalEntry } from './supabase';
import { Passage } from './ai';
import { encryptField, decryptField, looksEncrypted } from './encryption';

export type { JournalEntry };

// Message types for conversation replay
export type ConversationMessage =
  | { type: 'greeting'; text: string; timestamp: string }
  | { type: 'user_input'; text: string; timestamp: string }
  | { type: 'clarifying_question'; text: string; acknowledgment?: string; timestamp: string }
  | { type: 'user_response'; text: string; timestamp: string }
  | { type: 'voices_intro'; text: string; timestamp: string }
  | { type: 'voice_cards'; voices: Passage[]; timestamp: string }
  | { type: 'selected_voice'; voice: Passage; timestamp: string }
  | { type: 'reflection_acknowledgment'; text: string; timestamp: string };

// Structured conversation data for storage
export type ConversationData = {
  messages: ConversationMessage[];
  stage: string;
  userInput: string;
  clarification: string;
  selectedVoice: Passage | null;
  availableVoices?: Passage[]; // The original set of voice cards for "see another voice"
  shownThinkers: string[];
  savedAt: string;
  isComplete: boolean; // true when a voice has been selected
};

export type CreateJournalEntryParams = {
  userInput: string;
  clarification?: string;
  tradition?: string;
  thinker?: string;
  passageText?: string;
  source?: string;
  context?: string;
  reflectionQuestion?: string;
  notes?: string;
  conversationData?: ConversationData;
};

// Sensitive fields that get encrypted before storage
const ENCRYPTED_FIELDS = ['user_input', 'clarification', 'notes', 'conversation_data'] as const;

/**
 * Encrypt sensitive fields before writing to Supabase
 */
async function encryptSensitiveFields(
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const result = { ...data };

  for (const field of ENCRYPTED_FIELDS) {
    const value = result[field];
    if (value == null) continue;

    // Stringify objects (conversation_data is JSON)
    const plaintext = typeof value === 'string' ? value : JSON.stringify(value);
    result[field] = await encryptField(plaintext);
  }

  return result;
}

/**
 * Decrypt a journal entry after reading from Supabase.
 * Handles backward compatibility with old unencrypted entries.
 */
async function decryptEntry(entry: JournalEntry): Promise<JournalEntry> {
  const result: Record<string, unknown> = { ...entry };

  // Decrypt string fields
  for (const field of ['user_input', 'clarification', 'notes']) {
    const value = result[field];
    if (typeof value === 'string' && looksEncrypted(value)) {
      try {
        result[field] = await decryptField(value);
      } catch {
        // If decryption fails, leave as-is (may be old unencrypted data)
      }
    }
  }

  // Decrypt conversation_data (encrypted as string, old format is object or JSON string)
  const convData = result.conversation_data;
  if (typeof convData === 'string') {
    if (looksEncrypted(convData)) {
      try {
        const decrypted = await decryptField(convData);
        result.conversation_data = JSON.parse(decrypted);
      } catch {
        // Leave as-is if decryption fails
      }
    } else {
      // Old unencrypted entry: column changed from JSONB to TEXT, so parse it back
      try {
        result.conversation_data = JSON.parse(convData);
      } catch {
        // Not valid JSON, leave as-is
      }
    }
  }

  return result as JournalEntry;
}

/**
 * Save a journal entry to Supabase
 */
export async function saveJournalEntry(
  params: CreateJournalEntryParams
): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  try {
    // Check session first
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'exists' : 'null');

    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user from getUser():', user ? user.id : 'null');

    if (!user) {
      return { entry: null, error: new Error('User not authenticated') };
    }

    const rawData: Record<string, unknown> = {
      user_id: user.id,
      user_input: params.userInput,
      clarification: params.clarification || null,
      tradition: params.tradition || null,
      thinker: params.thinker || null,
      passage_text: params.passageText || null,
      source: params.source || null,
      context: params.context || null,
      reflection_question: params.reflectionQuestion || null,
      notes: params.notes || null,
      conversation_data: params.conversationData || null,
    };

    const encryptedData = await encryptSensitiveFields(rawData);

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(encryptedData)
      .select()
      .single();

    if (error) {
      return { entry: null, error };
    }

    const decrypted = await decryptEntry(data);
    return { entry: decrypted, error: null };
  } catch (error) {
    return { entry: null, error: error as Error };
  }
}

/**
 * Update an existing journal entry
 */
export async function updateJournalEntry(
  id: string,
  updates: Partial<CreateJournalEntryParams>
): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { entry: null, error: new Error('User not authenticated') };
    }

    // Build the update object with snake_case column names
    const updateData: Record<string, unknown> = {};
    if (updates.userInput !== undefined) updateData.user_input = updates.userInput;
    if (updates.clarification !== undefined) updateData.clarification = updates.clarification;
    if (updates.tradition !== undefined) updateData.tradition = updates.tradition;
    if (updates.thinker !== undefined) updateData.thinker = updates.thinker;
    if (updates.passageText !== undefined) updateData.passage_text = updates.passageText;
    if (updates.source !== undefined) updateData.source = updates.source;
    if (updates.context !== undefined) updateData.context = updates.context;
    if (updates.reflectionQuestion !== undefined) updateData.reflection_question = updates.reflectionQuestion;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.conversationData !== undefined) updateData.conversation_data = updates.conversationData;

    const encryptedUpdate = await encryptSensitiveFields(updateData);

    const { data, error } = await supabase
      .from('journal_entries')
      .update(encryptedUpdate)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { entry: null, error };
    }

    const decrypted = await decryptEntry(data);
    return { entry: decrypted, error: null };
  } catch (error) {
    return { entry: null, error: error as Error };
  }
}

/**
 * Get all journal entries for the current user
 */
export async function getJournalEntries(): Promise<{ entries: JournalEntry[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { entries: [], error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { entries: [], error };
    }

    const decrypted = await Promise.all((data || []).map(decryptEntry));
    return { entries: decrypted, error: null };
  } catch (error) {
    return { entries: [], error: error as Error };
  }
}

/**
 * Get a single journal entry by ID
 */
export async function getJournalEntry(id: string): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { entry: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { entry: null, error };
    }

    const decrypted = await decryptEntry(data);
    return { entry: decrypted, error: null };
  } catch (error) {
    return { entry: null, error: error as Error };
  }
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Get traditions per day from journal entries for calendar display
 * Returns a map of date strings (YYYY-MM-DD) to arrays of tradition names
 */
export function getTraditionsPerDay(entries: JournalEntry[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  entries.forEach((entry) => {
    const dateKey = new Date(entry.created_at).toISOString().split('T')[0];
    if (!map[dateKey]) map[dateKey] = [];
    if (entry.tradition && !map[dateKey].includes(entry.tradition)) {
      map[dateKey].push(entry.tradition);
    }
    // Limit to 3 traditions per day
    map[dateKey] = map[dateKey].slice(0, 3);
  });
  return map;
}
