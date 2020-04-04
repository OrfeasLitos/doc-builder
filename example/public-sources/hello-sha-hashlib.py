from hashlib import sha256

hex_hash = sha256(b"Hello world!").hexdigest()
print(hex_hash)

bin_hash = sha256(b"Hello world!").digest()
printable = bin_hash.hex()
print(printable)

incremental_hash = sha256()
incremental_hash.update(b"Hello ")
incremental_hash.update(b"world!")
print(incremental_hash.hexdigest())
