import hashlib
import json

def sha256(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()

def compute_merkle_root(records):
    if not records:
        return None

    # Step 1: Hash each record
    layer = [sha256(record) for record in records]

    # Step 2: Pair and hash again
    while len(layer) > 1:
        new_layer = []
        for i in range(0, len(layer), 2):
            left = layer[i]
            right = layer[i+1] if i + 1 < len(layer) else left
            new_layer.append(sha256(left + right))
        layer = new_layer

    return layer[0]

def compute_dataset_hash(records):
    return sha256(records)
