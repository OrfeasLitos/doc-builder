from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes
import json

# next line automatically changed by build.js
key = bytes.fromhex("99b5") * 12
nonce = get_random_bytes(AES.block_size//2)
plaintext = b"Cryptography rocks!"

init_plaintext = b"0123456789"

encrypter = AES.new(key, AES.MODE_CTR, nonce = nonce)
init_ciphertext = encrypter.encrypt(init_plaintext)
ciphertext = encrypter.encrypt(plaintext)

print(json.dumps({
    "ciphertext": ciphertext.hex(),
    "nonce": nonce.hex()
}))
