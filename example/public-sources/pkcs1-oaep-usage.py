from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.PublicKey import RSA
from textwrap import wrap

KEY_SIZE = 4096

# generic RSA key generation
key = RSA.generate(KEY_SIZE)

# instantiation of most practical specification of RSA
cipher = PKCS1_OAEP.new(key)

message = b"It is I who undergoes encryption!"

# as simple as one can wish
ciphertext = cipher.encrypt(message)
plaintext = cipher.decrypt(ciphertext)

print("More gibberish your way:")
[print(line) for line in wrap(ciphertext.hex(), 79)]
print("The plaintext is more readable:", '"' + plaintext.decode() + '"')
