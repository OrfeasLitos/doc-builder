from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.Signature import pss
from Cryptodome.Hash import SHA3_256
from Cryptodome.PublicKey import RSA

my_key = RSA.generate(4096)

with open("bob-pubkey.pem", "rb") as f:
    bob_key = RSA.import_key(f.read())

message = b"I love you Bob!"
encrypter = PKCS1_OAEP.new(bob_key)
ciphertext = encrypter.encrypt(message)

digest = SHA3_256.new(ciphertext)
signer = pss.new(my_key)
signature = signer.sign(digest)

with open("alice-pubkey.pem", "wb") as f:
    f.write(my_key.publickey().export_key())

with open("alice-ciphertext", "wb") as f:
    f.write(ciphertext)

with open("alice-signature", "wb") as f:
    f.write(signature)
