const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secret = process.env.ENCRYPTION_SECRET; 
const SALT = process.env.ENCRYPTION_SALT
const key = crypto.scryptSync(secret, SALT, 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    content: encrypted,
    iv: iv.toString('hex')
  };
}

function decrypt({ content, iv }) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
