from Cryptodome.Signature import pss
from Cryptodome.Hash import SHA3_256
from Cryptodome.PublicKey import RSA
from Cryptodome import Random

KEY_SIZE = 4096

key = RSA.generate(KEY_SIZE)

# we export only the public part of the key!
# exporting the private key is usually a bad idea
pubkey = key.publickey()
with open("pubkey.pem", "wb") as f:
    f.write(pubkey.export_key())

message = b"I, Alice hereby vouch for the veracity of the present statement"
digest = SHA3_256.new(message)

signer = pss.new(key)
signature = signer.sign(digest)

with open("signature", "wb") as f:
    f.write(signature)
