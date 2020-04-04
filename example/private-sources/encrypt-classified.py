# this file is now unused
from Cryptodome.Cipher import AES
from Cryptodome import Random

key = Random.new().read(AES.key_size[2])
iv = Random.new().read(AES.block_size)

plaintext = (b"If someone else can run arbitrary"
  b" code on your computer, it\'s not YOUR computer any more. -"
  b" Rich Kulawiec")

encrypter = AES.new(key, AES.MODE_CFB, iv)
print(key.hex(), iv.hex(), encrypter.encrypt(plaintext).hex())
