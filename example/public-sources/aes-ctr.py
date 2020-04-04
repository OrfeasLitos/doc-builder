from Cryptodome.Cipher import AES

key = b"I'm a little placeholder"
nonce = b"block//2"
ciphertext = bytes.fromhex("57acf58fd1ce9c7d1880dbe22bc8d55ca99ffb")

init_plaintext = b"0123456789"
encrypter = AES.new(key, AES.MODE_CTR, nonce = nonce)
init_ciphertext = encrypter.encrypt(init_plaintext)
decrypter = AES.new(key, AES.MODE_CTR, nonce = nonce)
decrypter.decrypt(init_ciphertext)

decrypted = decrypter.decrypt(ciphertext)
print('"' + decrypted.decode() + '"')
