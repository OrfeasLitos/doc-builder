from Cryptodome.Cipher import AES
import secrets

plaintext = b"<Your name here>"
key = secrets.randbits(AES.key_size[1]*8).to_bytes(AES.key_size[1], 'big')
iv = secrets.randbits(AES.block_size*8).to_bytes(AES.block_size, 'big')

encrypter = AES.new(key, AES.MODE_CFB, iv)
decrypter = AES.new(key, AES.MODE_CFB, iv)

ciphertext = encrypter.encrypt(plaintext)
decrypted = decrypter.decrypt(ciphertext)

print('"' + decrypted.decode() + '"')
