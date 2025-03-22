# Meeting Summarization Task

## Description
Summarize the key points, decisions, action items, and important discussions from the following meeting content:

{#if pdf_path}
I am providing a PDF file located at: `{pdf_path}` containing the meeting transcript or notes. You should use the PDFSearchTool to extract and analyze this content.
{/if}

{#if meeting_text}
```
{meeting_text}
```
{/if}

1. Extract all decisions made during the meeting.
2. Identify and list all action items, including responsible parties and deadlines if available.
3. Summarize the main discussion points concisely.
4. Structure the output in a clear, organized format with bullet points and sections.
5. Highlight any critical issues or concerns raised during the meeting.

Your output MUST be a well-structured summary that captures the essence of the meeting while making key points easy to find and understand. The summary should be brief but comprehensive, not exceeding one page.

## Expected Output
A concise, well-structured meeting summary with clearly identified decisions, action items (with owners and deadlines), and key discussion points organized in a scannable format. 