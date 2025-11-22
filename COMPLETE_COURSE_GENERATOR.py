#!/usr/bin/env python3
"""
COMPLETE COURSE GENERATOR
Generates FULL $99+ courses with detailed modules, activities, quizzes
"""

import requests
import json
import time
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# ==================== LOAD CREDENTIALS ====================
# Credentials are loaded from config.json (not committed to git for security)
import os

def load_config():
    """Load API keys from config.json"""
    config_path = os.path.join(os.path.dirname(__file__), 'config.json')

    if not os.path.exists(config_path):
        print("❌ config.json not found!")
        print("\nCreate config.json with your API keys:")
        print("""{
  "NOTION_API_KEY": "your-notion-key",
  "NOTION_DATABASE_ID": "your-database-id",
  "ANTHROPIC_API_KEY": "your-claude-key",
  "GAMMA_API_KEY": "your-gamma-key",
  "HEYGEN_API_KEY": "your-heygen-key",
  "BLAZE_API_KEY": "your-blaze-key"
}""")
        return None

    with open(config_path, 'r') as f:
        return json.load(f)

# Load credentials
config = load_config()
if not config:
    exit(1)

NOTION_API_KEY = config.get("NOTION_API_KEY")
NOTION_DATABASE_ID = config.get("NOTION_DATABASE_ID")
ANTHROPIC_API_KEY = config.get("ANTHROPIC_API_KEY")
GAMMA_API_KEY = config.get("GAMMA_API_KEY")
HEYGEN_API_KEY = config.get("HEYGEN_API_KEY")
BLAZE_API_KEY = config.get("BLAZE_API_KEY")

# ==================== CONFIGURATION ====================
NOTION_VERSION = "2022-06-28"
NOTION_BASE_URL = "https://api.notion.com/v1"

def print_header():
    print("\n" + "╔" + "="*60 + "╗")
    print("║" + " "*60 + "║")
    print("║" + "           COMPLETE COURSE GENERATOR".center(60) + "║")
    print("║" + " "*60 + "║")
    print("║" + "  Generates FULL $99+ courses with:".ljust(60) + "║")
    print("║" + "  - Detailed lessons for each module".ljust(60) + "║")
    print("║" + "  - Activities and exercises".ljust(60) + "║")
    print("║" + "  - Quizzes with answers".ljust(60) + "║")
    print("║" + "  - Speaker notes".ljust(60) + "║")
    print("║" + "  - Professional slides".ljust(60) + "║")
    print("║" + "  - Avatar video intro".ljust(60) + "║")
    print("║" + " "*60 + "║")
    print("╚" + "="*60 + "╝\n")

def check_api_keys():
    """Verify all API keys are filled in"""
    keys = {
        "NOTION_API_KEY": NOTION_API_KEY,
        "ANTHROPIC_API_KEY": ANTHROPIC_API_KEY,
        "GAMMA_API_KEY": GAMMA_API_KEY,
        "HEYGEN_API_KEY": HEYGEN_API_KEY,
        "BLAZE_API_KEY": BLAZE_API_KEY
    }

    missing = [k for k, v in keys.items() if not v or v.startswith("YOUR_")]

    if missing:
        print("❌ Missing API keys:")
        for key in missing:
            print(f"   - {key}")
        return False

    print("✓ All API keys found\n")
    return True

def setup_notion_database():
    """Set up Notion database with required properties"""
    print("STEP 1: Setting up your Notion database...")

    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json"
    }

    # Get database info
    try:
        response = requests.get(
            f"{NOTION_BASE_URL}/databases/{NOTION_DATABASE_ID}",
            headers=headers
        )

        if response.status_code != 200:
            print(f"❌ Can't connect to Notion database")
            print(f"Error: {response.text}")
            return False

        db = response.json()
        print(f"✓ Connected to: {db.get('title', [{}])[0].get('plain_text', 'Database')}")

        # Check if required properties exist
        properties = db.get("properties", {})
        required = ["Status", "Content Type", "Price", "Duration",
                   "Presentation Link", "Video Link", "PDF Link", "Social Assets"]

        existing = list(properties.keys())
        missing = [p for p in required if p not in existing]

        if not missing:
            print("✓ Database already configured\n")
            return True

        # Add missing properties
        print(f"Adding {len(missing)} missing columns...")

        new_props = {}

        if "Status" in missing:
            new_props["Status"] = {
                "select": {
                    "options": [
                        {"name": "Generate", "color": "blue"},
                        {"name": "Generating", "color": "yellow"},
                        {"name": "Review", "color": "orange"},
                        {"name": "Approved", "color": "green"},
                        {"name": "Published", "color": "purple"}
                    ]
                }
            }

        if "Content Type" in missing:
            new_props["Content Type"] = {
                "select": {
                    "options": [
                        {"name": "Course", "color": "blue"},
                        {"name": "Workshop", "color": "green"},
                        {"name": "Masterclass", "color": "purple"}
                    ]
                }
            }

        if "Price" in missing:
            new_props["Price"] = {"number": {"format": "canadian_dollar"}}

        if "Duration" in missing:
            new_props["Duration"] = {"rich_text": {}}

        if "Presentation Link" in missing:
            new_props["Presentation Link"] = {"url": {}}

        if "Video Link" in missing:
            new_props["Video Link"] = {"url": {}}

        if "PDF Link" in missing:
            new_props["PDF Link"] = {"url": {}}

        if "Social Assets" in missing:
            new_props["Social Assets"] = {"checkbox": {}}

        # Update database
        update_response = requests.patch(
            f"{NOTION_BASE_URL}/databases/{NOTION_DATABASE_ID}",
            headers=headers,
            json={"properties": new_props}
        )

        if update_response.status_code == 200:
            print("✓ Database updated\n")
            return True
        else:
            print(f"⚠ Couldn't update database: {update_response.text}\n")
            return True  # Continue anyway

    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False

def get_items_to_generate():
    """Get all items with Status='Generate'"""
    print("STEP 2: Checking for content to generate...")

    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json"
    }

    query = {
        "filter": {
            "property": "Status",
            "select": {
                "equals": "Generate"
            }
        }
    }

    try:
        response = requests.post(
            f"{NOTION_BASE_URL}/databases/{NOTION_DATABASE_ID}/query",
            headers=headers,
            json=query
        )

        if response.status_code != 200:
            print(f"❌ Error querying database: {response.text}")
            return []

        results = response.json().get("results", [])

        if not results:
            print("\nNo items with Status='Generate' found.")
            print("\nTO GENERATE CONTENT:")
            print("1. Go to your Notion database")
            print("2. Click '+ New'")
            print("3. Fill in:")
            print("   Name: Your viral content idea")
            print("   Status: Generate")
            print("   Content Type: Course")
            print("   Price: 99")
            print("   Duration: 8 hours")
            print("4. Run this script again\n")
            return []

        print(f"✓ Found {len(results)} item(s) to generate\n")
        return results

    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def generate_course_module(topic, module_num, total_modules, price):
    """Generate ONE complete module to stay under rate limits"""

    prompt = f"""Create Module {module_num} of {total_modules} for a ${price} course on: {topic}

Generate a COMPLETE module with:

1. MODULE TITLE (compelling, specific)
2. OVERVIEW (2-3 sentences explaining what this module covers)
3. LEARNING OBJECTIVES (3-4 specific, measurable outcomes)
4. LESSON CONTENT (800-1000 words of detailed teaching content)
   - Break into clear sections with headings
   - Include specific examples and case studies
   - Provide actionable steps
   - Use simple language but be comprehensive
5. PRACTICAL ACTIVITY (hands-on exercise students complete)
6. QUIZ (5 multiple-choice questions with correct answers marked)
7. KEY TAKEAWAYS (3-5 bullet points)

Return ONLY valid JSON in this exact format:
{{
  "module_number": {module_num},
  "title": "Module title here",
  "overview": "Overview text",
  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "lesson_content": "Full lesson text with multiple paragraphs...",
  "activity": {{
    "title": "Activity name",
    "description": "What students will do",
    "steps": ["Step 1", "Step 2", "Step 3"]
  }},
  "quiz": [
    {{
      "question": "Question text?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct": "A"
    }}
  ],
  "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}}"""

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 3000,  # Smaller to stay under rate limit
        "messages": [{
            "role": "user",
            "content": prompt
        }]
    }

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=data,
            timeout=60
        )

        if response.status_code != 200:
            return None

        result = response.json()
        content = result["content"][0]["text"]

        # Extract JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        return json.loads(content.strip())

    except Exception as e:
        print(f"    ⚠ Error generating module: {e}")
        return None

def generate_complete_course(item):
    """Generate COMPLETE course with full modules"""

    # Extract item details
    props = item["properties"]

    title = props.get("Name", {}).get("title", [{}])[0].get("plain_text", "Untitled")
    price = props.get("Price", {}).get("number", 99)
    duration = props.get("Duration", {}).get("rich_text", [{}])[0].get("plain_text", "8 hours")

    print(f"Generating COMPLETE course: {title}...")
    print(f"  Price point: ${price} - generating appropriate value\n")

    # Determine number of modules based on price
    if price >= 299:
        num_modules = 10
    elif price >= 199:
        num_modules = 8
    elif price >= 99:
        num_modules = 6
    else:
        num_modules = 4

    course_data = {
        "title": title,
        "price": price,
        "duration": duration,
        "modules": []
    }

    # Generate modules ONE AT A TIME with delays
    for i in range(1, num_modules + 1):
        print(f"  → Generating Module {i}/{num_modules}...")

        module = generate_course_module(title, i, num_modules, price)

        if module:
            course_data["modules"].append(module)
            print(f"    ✓ Module {i} complete ({len(module.get('lesson_content', ''))} chars)")
        else:
            print(f"    ⚠ Module {i} failed, skipping")

        # IMPORTANT: Wait 10 seconds between modules to avoid rate limit
        if i < num_modules:
            print(f"    ⏳ Waiting 10 seconds to avoid rate limit...")
            time.sleep(10)

    print(f"\n  ✓ Generated {len(course_data['modules'])} complete modules\n")

    return course_data

def create_gamma_presentation(course_data):
    """Create presentation slides in Gamma"""
    print("  → Creating presentation slides...")

    # Build slide content from course modules
    slides_text = f"""# {course_data['title']}

## Course Overview
Price: ${course_data['price']}
Duration: {course_data['duration']}
Modules: {len(course_data['modules'])}

"""

    for module in course_data['modules']:
        slides_text += f"""
## Module {module['module_number']}: {module['title']}

### Overview
{module['overview']}

### Learning Objectives
"""
        for obj in module.get('learning_objectives', []):
            slides_text += f"- {obj}\n"

        slides_text += f"""
### Key Content
{module['lesson_content'][:500]}...

"""

    headers = {
        "Authorization": f"Bearer {GAMMA_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "text": slides_text,
        "theme": "professional"
    }

    try:
        response = requests.post(
            "https://public-api.gamma.app/v1.0/generations",
            headers=headers,
            json=data,
            timeout=30
        )

        if response.status_code == 200 or response.status_code == 201:
            result = response.json()
            presentation_url = result.get("webUrl", result.get("url", "https://gamma.app"))
            print(f"    ✓ Slides created: {presentation_url}")
            return presentation_url
        else:
            print(f"    ⚠ Gamma error: {response.status_code} - {response.text[:100]}")
            return None

    except Exception as e:
        print(f"    ⚠ Gamma error: {e}")
        return None

def create_heygen_video(course_data):
    """Create avatar video intro"""
    print("  → Generating avatar video...")

    script = f"""Welcome to {course_data['title']}!

This comprehensive course includes {len(course_data['modules'])} detailed modules covering everything you need to know.

By the end of this course, you'll have practical skills you can apply immediately.

Let's get started!"""

    headers = {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "video_inputs": [{
            "character": {
                "type": "avatar",
                "avatar_id": "default"
            },
            "voice": {
                "type": "text",
                "input_text": script
            }
        }]
    }

    try:
        response = requests.post(
            "https://api.heygen.com/v2/video/generate",
            headers=headers,
            json=data,
            timeout=30
        )

        if response.status_code in [200, 201]:
            result = response.json()
            video_id = result.get("data", {}).get("video_id", result.get("video_id", "unknown"))
            video_url = f"https://app.heygen.com/share/{video_id}"
            print(f"    ✓ Video generation started (ID: {video_id})")
            return video_url
        else:
            print(f"    ⚠ HeyGen error: {response.status_code} - {response.text[:100]}")
            return None

    except Exception as e:
        print(f"    ⚠ HeyGen error: {e}")
        return None

def create_pdf_workbook(course_data, item_id):
    """Create comprehensive PDF workbook"""
    print("  → Creating PDF workbook...")

    filename = f"course_{item_id[:12]}.pdf"

    try:
        doc = SimpleDocTemplate(filename, pagesize=letter,
                               topMargin=0.75*inch, bottomMargin=0.75*inch,
                               leftMargin=0.75*inch, rightMargin=0.75*inch)

        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#2E3440',
            spaceAfter=30,
            alignment=TA_CENTER
        )

        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor='#5E81AC',
            spaceAfter=12,
            spaceBefore=12
        )

        story = []

        # Title page
        story.append(Paragraph(course_data['title'], title_style))
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph(f"<b>Price:</b> ${course_data['price']}", styles['Normal']))
        story.append(Paragraph(f"<b>Duration:</b> {course_data['duration']}", styles['Normal']))
        story.append(Paragraph(f"<b>Modules:</b> {len(course_data['modules'])}", styles['Normal']))
        story.append(PageBreak())

        # Modules
        for module in course_data['modules']:
            # Module title
            story.append(Paragraph(f"Module {module['module_number']}: {module['title']}", title_style))
            story.append(Spacer(1, 0.2*inch))

            # Overview
            story.append(Paragraph("<b>Overview</b>", heading_style))
            story.append(Paragraph(module['overview'], styles['Normal']))
            story.append(Spacer(1, 0.2*inch))

            # Learning objectives
            story.append(Paragraph("<b>Learning Objectives</b>", heading_style))
            for obj in module.get('learning_objectives', []):
                story.append(Paragraph(f"• {obj}", styles['Normal']))
            story.append(Spacer(1, 0.2*inch))

            # Lesson content
            story.append(Paragraph("<b>Lesson</b>", heading_style))

            # Split content into paragraphs
            content = module.get('lesson_content', '')
            paragraphs = content.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    story.append(Paragraph(para.strip(), styles['Normal']))
                    story.append(Spacer(1, 0.1*inch))

            story.append(Spacer(1, 0.2*inch))

            # Activity
            if 'activity' in module:
                activity = module['activity']
                story.append(Paragraph("<b>Practical Activity</b>", heading_style))
                story.append(Paragraph(f"<b>{activity.get('title', 'Activity')}</b>", styles['Normal']))
                story.append(Paragraph(activity.get('description', ''), styles['Normal']))

                if 'steps' in activity:
                    for i, step in enumerate(activity['steps'], 1):
                        story.append(Paragraph(f"{i}. {step}", styles['Normal']))

                story.append(Spacer(1, 0.2*inch))

            # Quiz
            if 'quiz' in module:
                story.append(Paragraph("<b>Knowledge Check</b>", heading_style))
                for i, q in enumerate(module['quiz'], 1):
                    story.append(Paragraph(f"<b>Question {i}:</b> {q.get('question', '')}", styles['Normal']))
                    for opt in q.get('options', []):
                        story.append(Paragraph(f"  {opt}", styles['Normal']))
                    story.append(Paragraph(f"  <i>Correct answer: {q.get('correct', 'A')}</i>", styles['Normal']))
                    story.append(Spacer(1, 0.1*inch))

                story.append(Spacer(1, 0.2*inch))

            # Key takeaways
            if 'key_takeaways' in module:
                story.append(Paragraph("<b>Key Takeaways</b>", heading_style))
                for takeaway in module['key_takeaways']:
                    story.append(Paragraph(f"✓ {takeaway}", styles['Normal']))

            story.append(PageBreak())

        doc.build(story)
        print(f"    ✓ PDF created: {filename}")
        return filename

    except Exception as e:
        print(f"    ⚠ PDF error: {e}")
        return None

def generate_social_content(course_data):
    """Generate social media posts"""

    # Simple template-based social content
    social = f"🚀 Just launched '{course_data['title']}' - {len(course_data['modules'])} comprehensive modules covering everything you need to know!\n\n"

    if course_data['modules']:
        social += "What you'll learn:\n"
        for i, module in enumerate(course_data['modules'][:3], 1):
            social += f"✓ {module['title']}\n"

        if len(course_data['modules']) > 3:
            social += f"...and {len(course_data['modules']) - 3} more modules!\n"

    social += f"\n💰 ${course_data['price']} | ⏱️ {course_data['duration']}\n\nEnroll now! 🔗"

    return social[:280]  # Twitter/X length

def update_notion_item(item_id, presentation_url, video_url, pdf_filename, social_preview):
    """Update Notion item with generated content"""
    print("  → Updating Notion...")

    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json"
    }

    properties = {
        "Status": {"select": {"name": "Review"}},
        "Social Assets": {"checkbox": True}
    }

    if presentation_url:
        properties["Presentation Link"] = {"url": presentation_url}

    if video_url:
        properties["Video Link"] = {"url": video_url}

    if pdf_filename:
        properties["PDF Link"] = {"url": f"file:///{pdf_filename}"}

    try:
        response = requests.patch(
            f"{NOTION_BASE_URL}/pages/{item_id}",
            headers=headers,
            json={"properties": properties}
        )

        if response.status_code == 200:
            print("  ✓ COMPLETE")
            print(f"  Social preview: {social_preview[:100]}...")
            return True
        else:
            print(f"  ⚠ Update error: {response.text[:100]}")
            return False

    except Exception as e:
        print(f"  ⚠ Update error: {e}")
        return False

def main():
    print_header()

    if not check_api_keys():
        return

    if not setup_notion_database():
        return

    items = get_items_to_generate()
    if not items:
        return

    for item in items:
        try:
            # Generate complete course
            course_data = generate_complete_course(item)

            # Create presentation
            presentation_url = create_gamma_presentation(course_data)

            # Create video
            video_url = create_heygen_video(course_data)

            # Create PDF
            pdf_filename = create_pdf_workbook(course_data, item["id"])

            # Generate social content
            social_preview = generate_social_content(course_data)

            # Update Notion
            update_notion_item(
                item["id"],
                presentation_url,
                video_url,
                pdf_filename,
                social_preview
            )

        except Exception as e:
            print(f"  ✗ Error: {e}")

    print("\n" + "="*60)
    print("\n✅ ALL DONE!\n")
    print("Go to Notion - you now have COMPLETE courses ready!")
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
