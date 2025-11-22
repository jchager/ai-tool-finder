# Automated Course Content Engine

A complete automation system that generates high-value online courses with presentations, videos, PDFs, and social media content.

## Features

✅ **Complete Course Generation**
- Generates 4-10 detailed modules based on price point
- Each module includes:
  - 800-1000 words of lesson content
  - Learning objectives
  - Practical activities
  - Quizzes with answers
  - Key takeaways

✅ **Multi-Format Output**
- **Gamma Presentations**: Professional slides automatically created
- **HeyGen Videos**: Avatar video introductions
- **PDF Workbooks**: Comprehensive downloadable materials
- **Social Media Content**: Ready-to-post promotional copy

✅ **Notion Integration**
- Automatically updates your Notion database
- Tracks course status (Generate → Generating → Review → Approved → Published)
- Stores all generated content links

## Setup

### 1. Install Python Dependencies

```bash
pip install anthropic requests reportlab
```

### 2. Configure API Keys

Copy the example config file:
```bash
cp config.json.example config.json
```

Edit `config.json` and add your actual API keys:
```json
{
  "NOTION_API_KEY": "ntn_your_key_here",
  "NOTION_DATABASE_ID": "your_database_id_here",
  "ANTHROPIC_API_KEY": "sk-ant-your_key_here",
  "GAMMA_API_KEY": "gma_your_key_here",
  "HEYGEN_API_KEY": "your_heygen_key_here",
  "BLAZE_API_KEY": "your_blaze_key_here"
}
```

**Where to get API keys:**
- **Notion**: https://www.notion.so/my-integrations
- **Claude (Anthropic)**: https://console.anthropic.com/settings/keys
- **Gamma**: https://gamma.app/settings
- **HeyGen**: https://app.heygen.com/settings/api
- **Blaze AI**: https://www.blaze.ai/settings

### 3. Set Up Notion Database

1. Import `notion_database_import.csv` to create your database (or use an existing one)
2. Go to https://www.notion.so/my-integrations
3. Create integration called "Content Engine"
4. Copy the integration token to your `config.json`
5. In your Notion database, click "..." → "Add connections" → Select "Content Engine"

## Usage

### Generate a Course

1. **Add content to Notion:**
   - Go to your Notion database
   - Click "+ New"
   - Fill in:
     - **Name**: Your course topic (e.g., "AI for Busy Professionals")
     - **Status**: Select "Generate"
     - **Content Type**: Select "Course"
     - **Price**: Enter price (e.g., 99)
     - **Duration**: Enter duration (e.g., "8 hours")

2. **Run the generator:**
   ```bash
   python COMPLETE_COURSE_GENERATOR.py
   ```

3. **Wait 2-3 minutes** - The system will:
   - Generate all course modules (with 10-second delays to avoid rate limits)
   - Create presentation slides in Gamma
   - Generate avatar video in HeyGen
   - Create PDF workbook
   - Update Notion with all links
   - Change status to "Review"

4. **Review in Notion:**
   - Refresh your Notion database
   - Check the generated content
   - Click the links to view presentation, video, PDF
   - Set status to "Approved" when ready to publish

## Pricing Tiers

The system automatically adjusts content depth based on price:

- **$0-49**: 4 modules
- **$50-99**: 6 modules
- **$100-199**: 8 modules
- **$200+**: 10 modules

## Cost Per Course

With your existing subscriptions:

| Service | Cost | Notes |
|---------|------|-------|
| Claude API | ~$0.06-0.20 | Per course (already have Claude Max) |
| Gamma Pro | $20/mo | Already subscribed |
| HeyGen Creator | $29/mo | Already subscribed (15 videos/month) |
| Blaze AI | Included | Already subscribed |
| **Total additional cost** | **~$0.06-0.20** | **Per course generated** |

## Automation Schedule

You can run this manually or set up automation:

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Task → Run daily
3. Action: Run `python COMPLETE_COURSE_GENERATOR.py`

### Manual Batch Processing
Add multiple items to Notion with Status="Generate", then run once to process all.

## Troubleshooting

### "Rate limit error"
- The script already includes 10-second delays between modules
- If you still hit limits, increase the delay in line 252: `time.sleep(15)` instead of 10

### "config.json not found"
- Make sure you copied `config.json.example` to `config.json`
- Make sure it's in the same folder as the Python script

### "Cannot connect to Notion"
- Verify you added the integration to your database (click "..." → "Add connections")
- Check your Notion API key is correct

### "Gamma/HeyGen error 404"
- Check your API keys are correct
- Verify you have active subscriptions

## Files

- `COMPLETE_COURSE_GENERATOR.py` - Main script
- `config.json` - Your API keys (NOT committed to git)
- `config.json.example` - Template for API keys
- `.gitignore` - Prevents committing sensitive data
- `README.md` - This file

## Security Note

⚠️ **NEVER commit `config.json` to git!** It contains your API keys.

The `.gitignore` file prevents this, but always double-check before pushing.

## Support

For issues or questions about:
- **Notion API**: https://developers.notion.com/
- **Claude API**: https://docs.anthropic.com/
- **Gamma**: https://help.gamma.app/
- **HeyGen**: https://help.heygen.com/

## Revenue Potential

**Example:**
- Generate 15 courses/month (using your 15 HeyGen credits)
- Price at $99 each
- Sell 2 copies per course/month = $2,970/month revenue
- Additional cost: ~$3 in Claude API fees
- **Net: $2,967/month**

Scale up with HeyGen Business plan (90 credits) for more courses!
