from .call_model import call_anthropic_model
from core.settings import CLAUDE_API_ENV
class AnthropicPrompt:
    def __init__(self, api_key: str, model: str = "claude-opus-4-20250514"):
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

        prompt += "Please provide only the list of questions that need to be asked to the client to get the complete project requirements. Do not include any other text."

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
    
    def ask_questions(self, all_questions: list, project_info) -> str:
        print("All questions: ", all_questions)
        prompt = self.get_question_prompt(all_questions, project_info)
        print("AI question prompt: ", prompt)
        response = self.get_model_response(prompt)
        print("Claude Response: ", response)
        questions = response.strip().split('\n\n')
        print("Questions: ", questions)
        return questions
    
    def generate_requirements(self, all_questions: list, project_info) -> str:
        prompt = self.get_generating_requirement_prompt(all_questions, project_info)
        response = self.get_model_response(prompt)

        print("response: ", response)
        return response

anthropic_prompt = AnthropicPrompt(api_key=CLAUDE_API_ENV)

if __name__ == "__main__":
    questions = [{'id': 1, 'question_text': 'What products or services will you sell, and do they have variations?', 'answer_text': 'We sell lifestyle products including T-shirts, hoodies, accessories, and home décor items. Most products have variations such as size (S–XL), color options, and different designs. All products are physical goods.', 'question_asked_by': 'predefined'}, {'id': 2, 'question_text': 'What core features do you expect in the website?', 'answer_text': 'We want a standard e-commerce setup with product listing, product detail pages, shopping cart, checkout, and user accounts. \nAdditional features we want:\n* Search with filters\n* Wishlist\n* Coupons/discounts\n* Reviews & ratings\n* Order tracking\n* Inventory auto-update\n* Basic analytics for sales', 'question_asked_by': 'predefined'}, {'id': 3, 'question_text': 'What payment and shipping methods do you want to integrate?', 'answer_text': 'For payments, we want UPI, credit/debit card, net banking, and wallet options, preferably using Razorpay. For shipping, we want integration with logistics providers like Shiprocket or Delhivery. We also want different shipping rates based on location and weight.', 'question_asked_by': 'predefined'}, {'id': 4, 'question_text': 'Do you have design preferences or reference websites?', 'answer_text': 'We prefer a clean, modern design with minimal colors, similar to websites like Nike or H&M. The layout should be mobile-friendly, fast to load, and visually appealing. We will provide our brand colors and logo.', 'question_asked_by': 'predefined'}, {'id': 5, 'question_text': 'How do you want to manage inventory, orders, and notifications?', 'answer_text': 'We need an admin dashboard to manage products, stock, and orders. Stock should update automatically when orders are placed.\nNotifications needed:\n* Order confirmation email/SMS\n* Shipping update\n* Delivery confirmation\n* Low-inventory alerts for admin', 'question_asked_by': 'predefined'}]
    ai_question = anthropic_prompt.ask_questions(questions)  
    print(ai_question)
