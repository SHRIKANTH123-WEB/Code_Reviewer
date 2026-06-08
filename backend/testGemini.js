import { reviewCode } from './services/geminiService.js';
import dotenv from 'dotenv';

dotenv.config();

const testCode = `
function calculateTotal(price, taxRate) {
    var total = price + (price * taxRate)
    var query = "SELECT * FROM products WHERE price = " + price;
    console.log(query);
    return total;
}
`;

async function test() {
  console.log('Testing Gemini API Connection and Code Review Service...');
  console.log('Using Model:', process.env.GEMINI_MODEL || 'gemini-2.5-flash');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('ERROR: GEMINI_API_KEY is not configured in backend/.env');
    process.exit(1);
  }

  try {
    const start = Date.now();
    const result = await reviewCode(testCode, 'JavaScript');
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    
    console.log(`\nReview completed successfully in ${duration}s!`);
    console.log('==================================================');
    console.log('Score:', result.score);
    console.log('Summary:', result.summary);
    console.log('Bugs Found:', result.bugs?.length || 0);
    console.log('Optimizations Suggestion:', result.optimizations?.length || 0);
    console.log('Security Issues:', result.security?.length || 0);
    console.log('Best Practices:', result.bestPractices?.length || 0);
    console.log('Improved Code Snippet (first 3 lines):');
    console.log(result.improvedCode?.split('\n').slice(0, 3).join('\n'));
    console.log('==================================================');
    console.log('Test Passed!');
  } catch (error) {
    console.error('Test Failed!');
    console.error(error);
  }
}

test();
