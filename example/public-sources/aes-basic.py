from Cryptodome.Cipher import AES
from Cryptodome import Random

# key and plaintext must be bytes(), not strings
key = b"I am a short key"
plaintext = b"Alice I love you"

# may be public, but must be chosen at random
iv = Random.new().read(AES.block_size)
# or, if using `secrets`:
#iv = secrets.randbits(AES.block_size*8).to_bytes(AES.block_size, 'big')

# this object remembers how many bytes have been encrypted
encrypter = AES.new(key, AES.MODE_CFB, iv)

ciphertext = encrypter.encrypt(plaintext)
print("Gibberish incoming:", ciphertext.hex())

# the same as the encrypter, but initialized anew
decrypter = AES.new(key, AES.MODE_CFB, iv)

decrypted = decrypter.decrypt(ciphertext)
if plaintext == decrypted:
    print("All good!")
