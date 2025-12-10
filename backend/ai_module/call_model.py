from transformers import pipeline
import torch

# Initialize pipeline
pipe = pipeline(
    task="text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.1",
    dtype=torch.bfloat16,
    device_map="auto"
)

# Basic prompt
prompt = """Classify the text into neutral, negative or positive.
Text: This movie is definitely one of my favorite movies of its kind.
Sentiment:"""

outputs = pipe(prompt, max_new_tokens=50)