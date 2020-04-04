from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.PublicKey import RSA
#from textwrap import wrap

ciphertext = b"Not really a ciphertext"
key = RSA.generate(4096)

decrypter = PKCS1_OAEP.new(key)
print('"' + decrypter.decrypt(ciphertext).decode() + '"')
