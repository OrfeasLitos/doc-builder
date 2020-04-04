from Cryptodome.Hash import SHA256 # pycrypto

hex_hash = SHA256.new(b"Hello world!").hexdigest()
print(hex_hash)
