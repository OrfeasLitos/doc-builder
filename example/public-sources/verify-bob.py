from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.Signature import pss
from Cryptodome.Hash import SHA3_256
from Cryptodome.PublicKey import RSA

with open("bob-privkey.pem", "rb") as f:
    my_key = RSA.import_key(f.read())

with open("alice-pubkey.pem", "rb") as f:
    alice_key = RSA.import_key(f.read())

with open("alice-ciphertext", "rb") as f:
    ciphertext = f.read()

with open("alice-signature", "rb") as f:
    signature = f.read()

decrypter = PKCS1_OAEP.new(my_key)
verifier = pss.new(alice_key)

digest = SHA3_256.new(ciphertext)
verifier.verify(digest, signature)

plaintext = decrypter.decrypt(ciphertext)
print("Alice says:", '"' + plaintext.decode() + '"')
