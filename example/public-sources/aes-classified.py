from Cryptodome.Cipher import AES

key = b"I'm a little placeholder"
iv = b"My length is 16B"
ciphertext = bytes.fromhex("ebaf9dac3461ba9a988740eec1bd68452a83")

decrypter = AES.new(key, AES.MODE_CFB, iv)
decrypted = decrypter.decrypt(ciphertext)
print('"' + decrypted.decode() + '"')
