from Cryptodome.Cipher import AES
from Cryptodome import Random

# Randomly generated keys are better than hardcoded ones
key = Random.new().read(AES.key_size[1]) # 192 bits
plaintext1 = b"My love for Alice is immeasurable" # length: 34
plaintext2 = b"It is quite true that Bob loves Alice" # length: 38

iv = Random.new().read(AES.block_size)

#####################
## Correct usage: one object for encryption, one for decryption
## E.g. for chat between two, a pair of AES objects for each client

aes1 = AES.new(key, AES.MODE_CFB, iv)
aes2 = AES.new(key, AES.MODE_CFB, iv)

ciphertext1 = aes1.encrypt(plaintext1)
# plaintext1 encrypted at positions 0:34, aes1 at 34

ciphertext2 = aes1.encrypt(plaintext2)
# plaintext2 encrypted at positions 34:(34+38), aes1 at 34+38

decrypted1 = aes2.decrypt(ciphertext1)
# decrypting at positions 0:34, aes2 at 34

decrypted2 = aes2.decrypt(ciphertext2)
# decrypting at positions 34:(34+38) at 34+38

assert(decrypted1 == plaintext1)
assert(decrypted2 == plaintext2)

#####################
## Common error 1: encrypting and decrypting with same object

aes3 = AES.new(key, AES.MODE_CFB, iv)

ciphertext3 = aes3.encrypt(plaintext1)
# decrypted3 = aes3.decrypt(ciphertext1) -- TypeError

#####################
## Common error 2: encrypting and decrypting in wrong order

aes4 = AES.new(key, AES.MODE_CFB, iv)
aes5 = AES.new(key, AES.MODE_CFB, iv)

ciphertext1 = aes4.encrypt(plaintext1)
ciphertext2 = aes4.encrypt(plaintext2)

decrypted4 = aes5.decrypt(ciphertext2)
decrypted5 = aes5.decrypt(ciphertext1)

assert(decrypted4 != plaintext2)
assert(decrypted5 != plaintext1)
