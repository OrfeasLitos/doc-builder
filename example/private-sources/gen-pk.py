from Cryptodome.PublicKey import RSA
import json

print(json.dumps({"key": RSA.generate(1024).export_key().hex()}))
