from flask import Flask
import numpy as np
from .salience import extract
import json

app = Flask(__name__)

with open('./transcript.txt', 'r') as file:
    source_text = file.read().strip()
sentence_ranges, adjacency = extract(source_text)

@app.route("/salience")
def salience_view():
    return json.dumps({
        'source': source_text,
        'intervals': sentence_ranges,
        'adjacency': np.nan_to_num(adjacency.numpy()).tolist(),
    })
