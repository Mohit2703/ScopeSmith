import base64
import os
from io import BytesIO
from PyPDF2 import PdfReader
from PIL import Image

def extract_text_from_pdf(file_path):
    """
    Extracts text from a PDF file.
    """
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def prepare_image_for_ai(file_path):
    """
    Encodes an image to base64 for OpenAI's vision model.
    """
    try:
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Determine the mime type based on extension
        ext = os.path.splitext(file_path)[1].lower()
        mime_type = "image/jpeg"
        if ext == ".png":
            mime_type = "image/png"
        elif ext == ".gif":
            mime_type = "image/gif"
        elif ext == ".webp":
            mime_type = "image/webp"

        return f"data:{mime_type};base64,{encoded_string}"
    except Exception as e:
        print(f"Error preparing image for AI: {e}")
        return None

def get_file_content_as_context(file_field):
    """
    Directly takes a FileField and returns context (text or base64 image).
    """
    if not file_field:
        return None
    
    file_path = file_field.path
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        text = extract_text_from_pdf(file_path)
        return {"type": "text", "content": text}
    elif ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        base64_image = prepare_image_for_ai(file_path)
        return {"type": "image", "content": base64_image}
    else:
        # For other files, maybe try to read as plain text if small
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return {"type": "text", "content": f.read(5000)} # Limit to 5k chars
        except:
            return None
