import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.warn('WARNING: GEMINI_API_KEY is not configured or is set to placeholder in .env file.');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Sends code to the Gemini API for a structured code review.
 * @param {string} code - The source code to review.
 * @param {string} language - The programming language of the code.
 * @param {string} customApiKey - Optional custom API key from the user.
 * @returns {Promise<object>} - The parsed JSON review object.
 */
export async function reviewCode(code, language, customApiKey = null) {
  const activeKey = customApiKey || apiKey;

  if (!activeKey || activeKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please add it to Settings or .env file.');
  }

  try {
    const activeGenAI = customApiKey ? new GoogleGenerativeAI(customApiKey) : genAI;
    const model = activeGenAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
You are an expert senior code reviewer and security auditor.
Analyze the following ${language} code and perform a thorough code review.

Analyze the code for:
1. Syntax errors and functional bugs.
2. Performance/resource optimization opportunities.
3. Security vulnerabilities (like SQL injection, XSS, buffer overflows, insecure dependencies).
4. Code readability, maintainability, and clean coding best practices.

You MUST respond strictly with a JSON object. Do not include any markdown styling like \`\`\`json or \`\`\`. The response must be a valid JSON parsed object with the following schema:

{
  "summary": "A concise paragraph summarizing the code's quality, main strengths, and primary areas for improvement.",
  "score": "[INTEGER BETWEEN 1 AND 100 representing code quality]",
  "bigO": {
    "time": "O(N) or O(N^2) etc.",
    "space": "O(1) or O(N) etc.",
    "details": "A brief explanation of how you derived the time and space complexity."
  },
  "bugs": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "line": "e.g., Line 12 or Lines 15-18",
      "description": "Explanation of the bug or potential runtime error.",
      "fix": "Specific advice or snippet on how to fix it."
    }
  ],
  "optimizations": [
    {
      "impact": "high" | "medium" | "low",
      "description": "Explanation of the performance bottleneck or inefficiency.",
      "suggestion": "How to optimize (e.g., use map instead of loop, cache results, avoid redundant operations)."
    }
  ],
  "security": [
    {
      "severity": "high" | "medium" | "low",
      "description": "Description of the vulnerability or insecure pattern.",
      "fix": "How to secure the code."
    }
  ],
  "bestPractices": [
    {
      "description": "Description of the style, naming, structure, or pattern violation.",
      "rationale": "Why this change is beneficial for readability and maintainability."
    }
  ],
  "improvedCode": "Provide the complete refactored and fully optimized code with proper formatting. Ensure it addresses the bugs, security issues, optimizations, and best practices mentioned above. Do not omit any necessary parts."
}

Here is the ${language} code to review:
\`\`\`${language}
${code}
\`\`\`
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON output
    try {
      const parsedData = JSON.parse(responseText.trim());
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      throw new Error('AI returned an invalid JSON structure. Please try again.');
    }
  } catch (error) {
    console.error('Error in geminiService:', error);
    
    // Provide a graceful fallback for 429 Quota or 503 High Demand errors
    if (error.status === 429 || error.status === 503 || (error.message && (error.message.includes('429') || error.message.includes('503')))) {
      console.log("Falling back to MOCK response due to API limits.");
      const randomScore = Math.floor(Math.random() * 41) + 35; // Random score between 35 and 75
      return {
        score: randomScore,
        summary: "This is a MOCK review because your Google API Key is hitting a '0' quota limit on the free tier (common in EU/UK) or high demand. The score has been dynamically generated for demonstration purposes.",
        bigO: {
          time: "O(N^2)",
          space: "O(N)",
          details: "Mock analysis indicates nested loops scanning over an array of size N, while storing mapped objects."
        },
        bugs: [
          { 
            description: "Hardcoded configuration values.", 
            fix: "Move configuration to environment variables.",
            severity: "Medium",
            line: "General"
          }
        ],
        syntax: "No major syntax errors detected in this mock analysis.",
        optimizations: [
          {
            description: "Potential performance bottleneck in data fetching.",
            suggestion: "Implement caching or pagination for large data sets.",
            impact: "Medium"
          }
        ],
        security: [
          {
            description: "Ensure user inputs are sanitized to prevent injection attacks.",
            fix: "Use parameterized queries or an ORM.",
            severity: "High"
          }
        ],
        bestPractices: [
          {
            description: "Add comprehensive error handling.",
            rationale: "Improves application stability and debuggability."
          },
          {
            description: "Write unit tests for critical functions.",
            rationale: "Ensures code reliability during future changes."
          }
        ],
        improvedCode: "// MOCK IMPROVED CODE\n" + code + "\n// This is just a placeholder."
      };
    }
    
    throw error;
  }
}
