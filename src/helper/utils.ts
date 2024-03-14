/**
 * @format
 * Helper functions
 */

import * as crypto from 'crypto';

/**
 * Remove null and empty value from a object for updation
 * @param {*} obj
 * @returns
 */
const removeNullParams = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
  return obj;
};

/**
 * Encrypt data
 * @param data
 * @param encryptionKey
 * @returns
 */
const encryptData = (data: string, encryptionKey?: string): string => {
  if (!encryptionKey) {
    throw new Error('Encryption key is missing');
  }

  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  const combinedString = iv.toString('hex') + encryptedData;
  return combinedString;
};

/**
 * Decrypt data
 * @param data
 * @param encryptionKey
 * @returns
 */
const decryptData = (
  combinedString: string,
  encryptionKey?: string,
): string => {
  if (!encryptionKey) {
    throw new Error('Encryption key is missing');
  }

  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);

  const iv = Buffer.from(combinedString.slice(0, 32), 'hex');
  const encryptedData = combinedString.slice(32);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return JSON.parse(decryptedData);
};

export { removeNullParams, encryptData, decryptData };
