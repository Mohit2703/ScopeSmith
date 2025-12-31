from .call_model import call_openai_model
from core.settings import OPENAI_API_ENV
class AnthropicPrompt:
    def __init__(self, api_key: str, model: str = "gpt-4"):
        self.api_key = api_key
        self.model = model

    def get_question_prompt(self, all_questions: list, project_info) -> str:
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

        prompt = f"You are an AI assistant for getting the project requirements with project info {str(project_info)} from the client.\n Following are the predifined and ai asked questions along with their answers(if available).\n Please ask relevant questions to get the complete requirements from the client based on the below questions and answers if any are missing.\n"
        for question in all_questions:
            prompt += f"Question: {question['question_text']}\n"
            if question['answer_text']:
                prompt += f"Answer: {question['answer_text']}\n"
            else:
                prompt += "Answer: [No answer provided]\n"
            
            prompt += f"Asked by: {question['question_asked_by']}\n\n"

        prompt += "Please provide only the list of questions semicolon separated that need to be asked to the client to get the complete project requirements. Do not include any other text."

        return prompt
    
    def get_generating_requirement_prompt(self, all_questions: list, project_info) -> str:
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

        prompt = f"""
        You are an AI assistant for generating project with project info {str(project_info)} requirements in HTML format should be visually stunning include:
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
    
    def get_model_response(self, prompt: str, image_url: str = None) -> str:
        """
        Calls the Anthropic model with the constructed prompt and returns the response.

        Args:
            prompt (str): The input prompt to send to the model.
            image_url (str, optional): Base64 encoded image.

        Returns:
            str: The response from the model.
        """
        response = call_openai_model(
            api_key=self.api_key,
            prompt=prompt,
            model=self.model,
            image_url=image_url
        )
        return response
    
    def ask_questions(self, all_questions: list, project_info, file_context=None) -> str:
        print("All questions: ", all_questions)
        prompt = self.get_question_prompt(all_questions, project_info)
        
        image_url = None
        if file_context:
            if file_context['type'] == 'text':
                prompt += f"\n\nAdditionally, the user has uploaded a file with the following content:\n{file_context['content']}\n\nPlease use this information to ask more specific questions."
            elif file_context['type'] == 'image':
                prompt += "\n\nAdditionally, the user has uploaded an image. Please analyze the image content to ask more specific questions."
                image_url = file_context['content']

        print("AI question prompt: ", prompt)
        response = self.get_model_response(prompt, image_url=image_url)
        print("Claude Response: ", response)
        questions = response.strip().split(';')
        print("Questions: ", questions)
        return questions
    
    def generate_requirements(self, all_questions: list, project_info, file_context=None) -> str:
        prompt = self.get_generating_requirement_prompt(all_questions, project_info)
        
        image_url = None
        if file_context:
            if file_context['type'] == 'text':
                prompt += f"\n\nAdditionally, the user has uploaded a file with the following content:\n{file_context['content']}\n\nPlease incorporate this information into the requirements."
            elif file_context['type'] == 'image':
                prompt += "\n\nAdditionally, the user has uploaded an image. Please analyze the image content and incorporate it into the requirements."
                image_url = file_context['content']

        response = self.get_model_response(prompt, image_url=image_url)

        print("response: ", response)
        return response

anthropic_prompt = AnthropicPrompt(api_key=OPENAI_API_ENV)