import openai
import anthropic

def call_anthropic_model(api_key: str, prompt: str, model: str = "claude-opus-4-20250514") -> str:
    """
    Calls the Anthropic AI model with the given prompt and returns the response.

    Args:
        api_key (str): The API key for authenticating with the Anthropic service.
        prompt (str): The input prompt to send to the model.
        model (str): The model to use (default is "claude-2").

    Returns:
        str: The response from the model.
    """
    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    return message.content[0].text


def call_openai_model(api_key: str, prompt: str, model: str = "gpt-4") -> str:
    """
    Calls the OpenAI model with the given prompt and returns the response.

    Args:
        api_key (str): The API key for authenticating with the OpenAI service.
        prompt (str): The input prompt to send to the model.
        model (str): The model to use (default is "gpt-4").

    Returns:
        str: The response from the model.
    """
    print("OPEN API KEY: ", api_key)
    print("Prompt: ", prompt)
    client = openai.OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model=model,
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    print("OpenAI response: ", response)
    
    return response.choices[0].message.content
