import asyncio
import logging
from celery import shared_task
from .models import UpworkScrapJob, UpworkScrapResult, UpworkScrapLogs

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def run_scraping_job(self, job_id: int, json_input: dict):
    """
    Celery task to run the Upwork scraping job.
    
    :param job_id: The ID of the UpworkScrapJob record.
    :param json_input: The JSON input for the scraper.
    """
    try:
        # Update job status to in_progress
        job = UpworkScrapJob.objects.get(id=job_id)
        job.status = 'in_progress'
        job.save()

        # Log the start
        UpworkScrapLogs.objects.create(
            job=job,
            log_message=f"Starting scraping job {job_id}",
            log_type="info"
        )

        # Import the main function from the scrap module
        from .scrap.main import main as scrape_main

        # Run the async main function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            results = loop.run_until_complete(scrape_main(json_input))
        finally:
            loop.close()

        # Save results
        UpworkScrapResult.objects.create(
            job=job,
            result_data=results
        )

        # Update job status to completed
        job.status = 'completed'
        job.save()

        # Log completion
        UpworkScrapLogs.objects.create(
            job=job,
            log_message=f"Scraping job {job_id} completed with {len(results)} results",
            log_type="info"
        )

        return {"status": "completed", "results_count": len(results)}

    except Exception as e:
        logger.exception(f"Scraping job {job_id} failed: {e}")
        
        # Update job status to failed
        try:
            job = UpworkScrapJob.objects.get(id=job_id)
            job.status = 'failed'
            job.save()

            UpworkScrapLogs.objects.create(
                job=job,
                log_message=f"Scraping job {job_id} failed: {str(e)}",
                log_type="error"
            )
        except Exception:
            pass

        raise
