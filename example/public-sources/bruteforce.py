from hashlib import sha256

TARGET = "0123"

def test_prefix(prefix, string):
    if len(string) < len(prefix):
        return False
    return string[0:len(prefix)] == prefix

def bytes_increment(arr):
    for i in range(len(arr) - 1, -1, -1):
        if arr[i] != 255:
            arr[i] += 1
            for j in range(i + 1, len(arr)):
                arr[j] = 0
            return arr
    return bytearray(len(arr) + 1)

preimage = bytearray(0)
while not test_prefix(TARGET, sha256(preimage).hexdigest()):
    preimage = bytes_increment(preimage)

print(preimage.hex())
