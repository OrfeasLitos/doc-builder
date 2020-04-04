from Cryptodome.Hash import SHA256

incremental_hash = SHA256.new()
incremental_hash.update(b"Hello ")
incremental_hash.update(b"world!")
print(incremental_hash.hexdigest())
