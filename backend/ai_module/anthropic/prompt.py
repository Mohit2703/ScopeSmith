from .call_model import call_anthropic_model

class AnthropicPrompt:
    def __init__(self, api_key: str, model: str = "claude-2"):
        self.api_key = api_key
        self.model = model

    def get_question_prompt(self, all_questions: list) -> str:
        """
        Constructs a prompt for the Anthropic model based on a list of questions.

        Args:
            all_questions (list): A list of questions to include in the prompt.

            question struct:
            {
                "id": int,
                "question_text": str,
                "answer_text": str or None,
                "question_asked_by": str
            }
        """

        prompt = "You are an AI assistant for getting the project requirements from the client.\n Following are the predifined and ai asked questions along with their answers(if available).\n Please ask relevant questions to get the complete requirements from the client based on the below questions and answers if any are missing.\n"
        for question in all_questions:
            prompt += f"Question: {question['question_text']}\n"
            if question['answer_text']:
                prompt += f"Answer: {question['answer_text']}\n"
            else:
                prompt += "Answer: [No answer provided]\n"
            
            prompt += f"Asked by: {question['question_asked_by']}\n\n"

        prompt += "Please provide only the list of questions that need to be asked to the client to get the complete project requirements. Do not include any other text."

        return prompt
    
    def get_generating_requirement_prompt(self, all_questions: list) -> str:
        """
        Constructs a prompt for generating project requirements based on a list of questions.

        Args:
            all_questions (list): A list of questions to include in the prompt.

            question struct:
            {
                "id": int,
                "question_text": str,
                "answer_text": str or None,
                "question_asked_by": str
            }
        """

        prompt = """
        You are an AI assistant for generating project requirements including PDF includes:
            • Project overview
            • Detailed functional requirements
            • Technical requirements
            • User stories
            • Acceptance criteria
            • Wireframe descriptions (text)
            • Database schema suggestions
            • API endpoint list 
        Excludes:
            • User flow diagrams
            • Timeline
            • Costing
        Based on the client's answers to the questions asked.\n Following are the questions along with their answers provided by the client.\n Please generate a comprehensive project requirement based on the below answers to be presented to the client.\n"""

        for question in all_questions:
            prompt += f"Question: {question['question_text']}\n"
            if question['answer_text']:
                prompt += f"Answer: {question['answer_text']}\n"
            else:
                prompt += "Answer: [No answer provided]\n"
            prompt += f"Asked by: {question['question_asked_by']}\n\n"
        return prompt
    
    def get_model_response(self, prompt: str) -> str:
        """
        Calls the Anthropic model with the constructed prompt and returns the response.

        Args:
            prompt (str): The input prompt to send to the model.

        Returns:
            str: The response from the model.
        """
        response = call_anthropic_model(
            api_key=self.api_key,
            prompt=prompt,
            model=self.model
        )
        return response
    
    def ask_questions(self, all_questions: list) -> str:
        prompt = self.get_question_prompt(all_questions)
        response = self.get_model_response(prompt)
        questions = response.strip().split('\n\n')
        return questions
    
    def generate_requirements(self, all_questions: list) -> str:
        prompt = self.get_generating_requirement_prompt(all_questions)
        response = self.get_model_response(prompt)
        return response
        
anthropic_prompt = AnthropicPrompt(api_key="your_anthropic_api_key")
