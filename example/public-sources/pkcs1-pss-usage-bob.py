from Cryptodome.Signature import pss
from Cryptodome.Hash import SHA3_256
from Cryptodome.PublicKey import RSA
from Cryptodome import Random

with open("pubkey.pem", "rb") as f:
    key = RSA.import_key(f.read())

with open("signature", "rb") as f:
    signature = f.read()

message = b"I, Alice hereby vouch for the veracity of the present statement"
digest = SHA3_256.new(message)

verifier = pss.new(key)
try:
    verifier.verify(digest, signature)
    print("Signature A-OK!")

except (ValueError, TypeError):
    print("Your attempt at forging signatures is deplorable")
