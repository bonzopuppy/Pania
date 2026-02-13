/**
 * Client-Side Encryption Service
 * AES-256-GCM encryption for sensitive journal entry fields.
 * Key is stored in expo-secure-store (iOS Keychain / Android Keystore)
 * or localStorage as a web fallback.
 */

// @ts-ignore — @noble/ciphers uses subpath exports
import { gcm } from '@noble/ciphers/aes';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  Crypto.getRandomValues(bytes);
  return bytes;
}

const ENCRYPTION_KEY_STORAGE = 'pania_encryption_key';
const NONCE_LENGTH = 12; // 96 bits for AES-GCM

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let cachedKey: Uint8Array | null = null;

/**
 * Get or create the 256-bit encryption key.
 * Stored in expo-secure-store (native) or localStorage (web fallback).
 */
export async function getOrCreateEncryptionKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;

  // Try to load existing key
  let storedKeyHex: string | null = null;

  if (Platform.OS === 'web') {
    if (isBrowser) {
      storedKeyHex = window.localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    }
  } else {
    storedKeyHex = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE);
  }

  if (storedKeyHex) {
    const key = hexToBytes(storedKeyHex);
    cachedKey = key;
    return key;
  }

  // Generate new 256-bit key
  const newKey = randomBytes(32);
  const newKeyHex = bytesToHex(newKey);

  if (Platform.OS === 'web') {
    if (isBrowser) {
      window.localStorage.setItem(ENCRYPTION_KEY_STORAGE, newKeyHex);
    }
  } else {
    await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE, newKeyHex);
  }

  cachedKey = newKey;
  return newKey;
}

/**
 * Encrypt a plaintext string. Returns a base64-encoded string
 * containing the nonce + ciphertext.
 */
export async function encryptField(plaintext: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const nonce = randomBytes(NONCE_LENGTH);
  const aes = gcm(key, nonce);
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = aes.encrypt(encoded);

  // Prepend nonce to ciphertext: [12-byte nonce][ciphertext+tag]
  const combined = new Uint8Array(NONCE_LENGTH + ciphertext.length);
  combined.set(nonce, 0);
  combined.set(ciphertext, NONCE_LENGTH);

  return bytesToBase64(combined);
}

/**
 * Decrypt a base64-encoded encrypted string back to plaintext.
 */
export async function decryptField(encrypted: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const combined = base64ToBytes(encrypted);

  const nonce = combined.slice(0, NONCE_LENGTH);
  const ciphertext = combined.slice(NONCE_LENGTH);

  const aes = gcm(key, nonce);
  const decrypted = aes.decrypt(ciphertext);

  return new TextDecoder().decode(decrypted);
}

/**
 * Delete the encryption key. Call on account deletion.
 * WARNING: This makes all encrypted data permanently unrecoverable.
 */
export async function deleteEncryptionKey(): Promise<void> {
  cachedKey = null;
  if (Platform.OS === 'web') {
    if (isBrowser) {
      window.localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
    }
  } else {
    await SecureStore.deleteItemAsync(ENCRYPTION_KEY_STORAGE);
  }
}

/**
 * Heuristic to check if a value looks like it's encrypted (base64).
 * Used for backward compatibility with old unencrypted entries.
 */
export function looksEncrypted(value: string): boolean {
  // Encrypted values are base64 and at least nonce (12 bytes) + some ciphertext
  // Base64 of 12+ bytes = at least 16 chars, all base64 chars
  if (value.length < 16) return false;
  return /^[A-Za-z0-9+/]+=*$/.test(value);
}

// --- Helpers ---

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
