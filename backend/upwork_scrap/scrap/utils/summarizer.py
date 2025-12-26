import logging
from typing import List, Dict, Any
import anthropic


class Summarizer:
    def __init__(self, api_key: str, model: str = "claude-sonnet-4-20250514"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.logger = logging.getLogger("Summarizer")

    def summarize_job(self, job: Dict[str, Any]) -> str:
        """
        Summarize a single job based on its title, description, and skills.
        """
        title = job.get('title', 'No Title')
        description = job.get('description', 'No Description')
        skills = ", ".join(job.get('skills', []))

        prompt = f"""Please provide a concise summary (2-3 sentences) of the following job posting.
Focus on the core requirements and deliverables.

Job Title: {title}
Skills: {skills}
Description:
{description[:3000]}"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=200,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                system="You are a helpful assistant that summarizes job postings concisely."
            )
            summary = response.content[0].text.strip()
            return summary
        except Exception as e:
            self.logger.error(f"Error summarizing job '{title}': {e}")
            return "Error generating summary."

    def generate_lead_message(self, job: Dict[str, Any]) -> str:
        """
        Generate a personalized first contact/lead message for a job posting.
        """
        title = job.get('title', 'No Title')
        description = job.get('description', 'No Description')
        skills = ", ".join(job.get('skills', []))
        client_country = job.get('client_country', '')
        budget = job.get('budget', job.get('hourly_rate', ''))

        prompt = f"""Write a short, professional first contact message for the following Upwork job posting.
The message should:
- Be friendly but professional
- Show understanding of their specific needs
- Briefly mention relevant experience (keep it generic but believable)
- End with a call to action or question
- Be 3-5 sentences max

Job Title: {title}
Skills Required: {skills}
Client Location: {client_country}
Budget: {budget}
Description:
{description[:2000]}"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                system="You are an expert freelancer writing personalized, engaging proposal messages. Keep messages concise and genuine."
            )
            lead_message = response.content[0].text.strip()
            return lead_message
        except Exception as e:
            self.logger.error(f"Error generating lead message for '{title}': {e}")
            return "Error generating lead message."

    def summarize_jobs(self, jobs: List[Dict[str, Any]], generate_leads: bool = True) -> List[Dict[str, Any]]:
        """
        Summarize a list of jobs in place, adding 'summary' and optionally 'lead_message' keys.
        """
        self.logger.info(f"Processing {len(jobs)} jobs with Claude...")
        for i, job in enumerate(jobs):
            job_title = job.get('title', 'Unknown')
            self.logger.info(f"Processing job {i+1}/{len(jobs)}: {job_title}")
            
            # Generate summary
            job['summary'] = self.summarize_job(job)
            
            # Generate lead message if enabled
            if generate_leads:
                job['lead_message'] = self.generate_lead_message(job)
                
        self.logger.info(f"Completed processing {len(jobs)} jobs.")
        return jobs
