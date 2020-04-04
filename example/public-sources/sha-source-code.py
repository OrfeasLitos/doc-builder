from hashlib import sha256
from urllib.request import urlopen

source_url = ("http://dl-cdn.alpinelinux.org/alpine/v3.10/"
"releases/armv7/alpine-minirootfs-3.10.3-armv7.tar.gz")

hash_url = source_url + ".sha256"

iso = urlopen(source_url).read()
expected_hash = urlopen(hash_url).read()

print(sha256(iso).hexdigest())
print(expected_hash.decode())
