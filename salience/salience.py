import numpy as np
import torch
from sentence_transformers import SentenceTransformer
import nltk.data
import nltk

nltk.download('punkt')

model = SentenceTransformer('all-mpnet-base-v2')
sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')

def cos_sim(a, b):
    sims = a @ b.T
    a_norm = np.linalg.norm(a, axis=-1)
    b_norm = np.linalg.norm(b, axis=-1)
    a_normalized = (sims.T / a_norm.T).T
    sims = a_normalized / b_norm
    return sims

def degree_power(A, k):
    degrees = np.power(np.array(A.sum(1)), k).ravel()
    D = np.diag(degrees)
    return D

def normalized_adjacency(A):
    normalized_D = degree_power(A, -0.5)
    return torch.from_numpy(normalized_D.dot(A).dot(normalized_D))

def get_sentences(source_text):
    sentence_ranges = list(sent_detector.span_tokenize(source_text))
    sentences = [source_text[start:end] for start, end in sentence_ranges]
    return sentences, sentence_ranges

def text_rank(sentences):
    vectors = model.encode(sentences)
    adjacency = torch.tensor(cos_sim(vectors, vectors)).fill_diagonal_(0.)
    adjacency[adjacency < 0] = 0
    return normalized_adjacency(adjacency)

def terminal_distr(adjacency, initial=None):
    sample = initial if initial is not None else torch.full((adjacency.shape[0],), 1.)
    scores = sample.matmul(torch.matrix_power(adjacency, 10)).numpy().tolist()
    return scores

def extract(source_text):
    sentences, sentence_ranges = get_sentences(source_text)
    adjacency = text_rank(sentences)
    return sentence_ranges, adjacency

def get_results(sentences, adjacency):
    scores = terminal_distr(adjacency)
    for score, sentence in sorted(zip(scores, sentences), key=lambda xs: xs[0]):
        if score > 1.1:
            print('{:0.2f}: {}'.format(score, sentence))
