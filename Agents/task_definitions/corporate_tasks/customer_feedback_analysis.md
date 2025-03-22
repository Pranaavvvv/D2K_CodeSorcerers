# Customer Feedback Analysis Task

## Description
Analyze customer feedback from the following source:

{#if reviews_url}
Customer reviews website URL: `{reviews_url}`

Use the ScrapeWebsiteTool to extract reviews and feedback data from this URL. Make sure to focus on extracting ratings, review text, dates, and any other relevant information.
{/if}

{#if feedback_data}
```
{feedback_data}
```
{/if}

{#if pdf_path}
I am providing a PDF file located at: `{pdf_path}` containing customer feedback. You should use the PDFSearchTool to extract and analyze this content.
{/if}

1. Identify key patterns, trends, and common themes in the customer feedback.
2. Categorize feedback into positive points, negative points, and suggestions for improvement.
3. Prioritize issues based on frequency of mention and severity of impact.
4. Generate actionable insights and specific recommendations based on the feedback.
5. Identify any urgent issues that require immediate attention.
6. Compare current feedback with previous data if available to identify changing customer sentiments.
7. Recommend metrics to track for measuring improvement in problem areas.

Your analysis MUST be comprehensive, data-driven, and focused on actionable insights. Prioritize recommendations that would have the most significant positive impact on customer satisfaction.

## Expected Output
A detailed customer feedback analysis report with clear categorization of feedback themes, identification of critical issues, prioritized recommendations, and specific action items for different departments. 