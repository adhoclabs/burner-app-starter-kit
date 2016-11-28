import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const PASSWORD = process.env.BURNER_APP_STARTER_KIT_KEY_ENCRYPTION_PASSWORD;

/**
 * Encrypt the specified text.
 *
 * @param {String} text - The text to encrypt.
 * @returns {String} The encrypted text.
 */
export function encrypt(text) {
  const cipher = crypto.createCipher(ALGORITHM, PASSWORD);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');

  return crypted;
}

/**
 * Decrypt the specified text.
 *
 * @param {String} text - The text to decrypt.
 * @returns {String} The decrypted text.
 */
export function decrypt(text) {
  const decipher = crypto.createDecipher(ALGORITHM, PASSWORD);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');

  return dec;
}
