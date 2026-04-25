import logging
import asyncio
from typing import Dict, Optional
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

# Thread pool for running Playwright in a separate thread (avoids asyncio subprocess issues on Windows)
_executor = ThreadPoolExecutor(max_workers=2)


def _run_browser_sync(apply_url: str, user_data: Dict[str, str]) -> Dict:
    """
    Synchronous browser automation using Playwright.
    Runs in a thread pool to avoid asyncio subprocess issues on Windows.
    """
    logs = []
    filled = 0

    try:
        from playwright.sync_api import sync_playwright

        logs.append(f"Launching browser for {apply_url}...")
        logger.info(f"Auto-apply navigating to: {apply_url}")

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                )
            )
            page = context.new_page()

            try:
                page.goto(apply_url, wait_until="domcontentloaded", timeout=30000)
            except Exception as e:
                logs.append(f"Page load warning: {str(e)}")
                logger.warning(f"Page load issue: {e}")

            page.wait_for_timeout(2000)

            # Intelligent form filling
            filled = _fill_form_fields(page, user_data, logs)

            # Take screenshot
            try:
                page.screenshot(path="auto_apply_screenshot.png", full_page=True)
                logs.append("Screenshot captured: auto_apply_screenshot.png")
            except Exception as e:
                logs.append(f"Screenshot failed: {e}")

            browser.close()

        return {
            "status": "success",
            "message": f"Opened application page and filled {filled} fields",
            "fields_filled": filled,
            "logs": logs,
            "apply_url": apply_url
        }

    except ImportError as e:
        logger.error(f"Playwright not installed: {e}")
        return {
            "status": "error",
            "message": "Playwright not installed. Run: playwright install chromium",
            "fields_filled": 0,
            "logs": logs + [f"Import error: {e}"],
            "apply_url": apply_url
        }
    except Exception as e:
        logger.error(f"Auto-apply failed: {e}")
        return {
            "status": "partial",
            "message": f"Could not fully automate: {str(e)}",
            "fields_filled": filled,
            "logs": logs,
            "apply_url": apply_url
        }


def _fill_form_fields(page, user_data: Dict, logs) -> int:
    """Fills common job application form fields using sync Playwright."""
    filled = 0

    field_patterns = {
        "name": ["name", "full_name", "fullname", "applicant_name", "your_name"],
        "first_name": ["first", "firstname", "first_name", "fname"],
        "last_name": ["last", "lastname", "last_name", "lname", "surname"],
        "email": ["email", "e-mail", "email_address", "mail"],
        "phone": ["phone", "telephone", "mobile", "cell", "phone_number"],
        "linkedin": ["linkedin", "linkedin_url", "linked_in"],
        "portfolio": ["portfolio", "website", "personal_website", "github", "url"],
        "location": ["location", "city", "address", "country", "region"],
    }

    for data_key, patterns in field_patterns.items():
        value = user_data.get(data_key)
        if not value:
            continue

        for pattern in patterns:
            try:
                # Strategy 1: Find by label text
                labels = page.locator(f"label:has-text('{pattern}'):visible, label:has-text('{pattern.replace('_', ' ')}'):visible").all()
                if labels:
                    for_attr = labels[0].get_attribute("for")
                    if for_attr:
                        input_el = page.locator(f"#{for_attr}")
                        if input_el.count() > 0:
                            input_el.first.fill(str(value))
                            filled += 1
                            logs.append(f"Filled '{data_key}' via label '{pattern}'")
                            break
                    continue

                # Strategy 2: Find input by placeholder
                inputs = page.locator(f"input[placeholder*='{pattern}' i]:visible, textarea[placeholder*='{pattern}' i]:visible").all()
                if inputs:
                    inputs[0].fill(str(value))
                    filled += 1
                    logs.append(f"Filled '{data_key}' via placeholder '{pattern}'")
                    break

                # Strategy 3: Find input by name attribute
                inputs = page.locator(f"input[name*='{pattern}' i]:visible, textarea[name*='{pattern}' i]:visible").all()
                if inputs:
                    inputs[0].fill(str(value))
                    filled += 1
                    logs.append(f"Filled '{data_key}' via name attribute '{pattern}'")
                    break

                # Strategy 4: Find by id
                inputs = page.locator(f"input[id*='{pattern}' i]:visible, textarea[id*='{pattern}' i]:visible").all()
                if inputs:
                    inputs[0].fill(str(value))
                    filled += 1
                    logs.append(f"Filled '{data_key}' via id '{pattern}'")
                    break

            except Exception:
                continue

    # Try to upload resume if file input exists
    resume_file = user_data.get("resume_file_path")
    if resume_file:
        try:
            file_inputs = page.locator("input[type='file']:visible").all()
            if file_inputs:
                file_inputs[0].set_input_files(resume_file)
                filled += 1
                logs.append("Uploaded resume file")
        except Exception:
            pass

    # Try to fill cover letter textarea
    cover_letter = user_data.get("cover_letter")
    if cover_letter:
        try:
            textareas = page.locator("textarea:visible").all()
            for ta in textareas[:3]:
                try:
                    rows = ta.get_attribute("rows")
                    if rows and int(rows) >= 5:
                        ta.fill(cover_letter[:2000])
                        filled += 1
                        logs.append("Filled cover letter textarea")
                        break
                except Exception:
                    continue
        except Exception:
            pass

    return filled


async def auto_apply_to_job(
    apply_url: str,
    resume_text: str,
    job_description: str,
    user_data: Dict[str, str],
    headless: bool = False
) -> Dict:
    """
    Async wrapper that runs browser automation in a thread pool.
    This avoids asyncio subprocess issues on Windows.
    """
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        _executor,
        _run_browser_sync,
        apply_url,
        user_data
    )
    return result
