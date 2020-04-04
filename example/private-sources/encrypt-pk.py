from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.PublicKey import RSA
import json

# next line automatically changed by build.js
key = RSA.generate(4096)

message = (b"Congratulations! If you enjoyed this, you can play "
           b"more here: https://cryptopals.com/")

cipher = PKCS1_OAEP.new(key)
print(json.dumps({"ciphertext": cipher.encrypt(message).hex()}))
