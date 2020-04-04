const crypto = require('crypto')

const algorithm = 'aes-256-cfb8'
const KEY_SIZE = 32
const BLOCK_SIZE = 16

const key = crypto.randomBytes(KEY_SIZE)
const iv = crypto.randomBytes(BLOCK_SIZE)

const plaintext = Buffer.from('If someone else can run '
  + 'arbitrary code on your computer, it\'s not YOUR '
  + 'computer any more. - Rich Kulawiec')

const cipher = crypto.createCipheriv(algorithm, key, iv)

const ciphertext = cipher.update(plaintext)

module.exports = { key, iv, ciphertext }
