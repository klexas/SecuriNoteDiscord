// PBKDF2 iterations - OWASP recommends at least 600,000 for PBKDF2-SHA256
const PBKDF2_ITERATIONS = 600000;

// Convert a string key to a CryptoKey for AES-GCM
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import the password as a key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive an AES-GCM key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Helper function to convert Uint8Array to base64 string (chunked to avoid stack overflow)
function uint8ArrayToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 0x8000; // 32KB chunks
  let result = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(result);
}

// Helper function to convert base64 string to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypts plaintext using AES-GCM with the provided key
 * Returns a base64-encoded string containing salt, iv, and ciphertext
 */
export async function encrypt(plaintext: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive encryption key from password
  const cryptoKey = await deriveKey(key, salt);

  // Encrypt the data
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    cryptoKey,
    data
  );

  // Combine salt + iv + ciphertext into a single buffer
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  // Convert to base64 for storage/transmission
  return uint8ArrayToBase64(combined);
}

/**
 * Decrypts ciphertext that was encrypted with the encrypt function
 * Returns the plaintext string
 * Throws an error if decryption fails (wrong key or corrupted data)
 */
export async function decrypt(encryptedData: string, key: string): Promise<string> {
  // Decode from base64
  const combined = base64ToUint8Array(encryptedData);

  // Extract salt, iv, and ciphertext
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);

  // Derive decryption key from password
  const cryptoKey = await deriveKey(key, salt);

  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    cryptoKey,
    ciphertext
  );

  // Decode to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export const cryptoService = {
  encrypt,
  decrypt
};