from Cryptodome.PublicKey import RSA

key = RSA.generate(4096)

with open("bob-pubkey.pem", "wb") as f:
    f.write(key.publickey().export_key())

with open("bob-privkey.pem", "wb") as f:
    f.write(key.export_key())
