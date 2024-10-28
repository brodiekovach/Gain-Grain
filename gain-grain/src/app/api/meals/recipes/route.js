/*import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, message: 'URL is required' }, { status: 400 });
    }

    const { data } = await axios.get(url);
    const $ = load(data);

    // Extracting the recipe name
    const name = $('h1').text() || $('.recipe-title').text() || $('meta[property="og:title"]').attr('content');

    // Enhanced ingredient extraction
    const ingredients = [];
    /*
    // Try various selectors for ingredients
    const ingredientSelectors = [
      'div[data-testid="IngredientList"] > div',
      '.ingredient',
      '.ingredients-item',
      '.recipe-ingredients li',
      '.ingredient-description',
      '[itemprop="recipeIngredient"]',
      '[class*="ingredient"]' // Catch-all for any class containing "ingredient"
    ];

    ingredientSelectors.forEach((selector) => {
      $(selector).each((i, elem) => {
        // Extract the ingredient text, removing extra spaces
        const ingredientText = $(elem).text().trim();

        // Extract the amount and name separately if possible
        const amount = $(elem).find('.Amount, .ingredient-amount').text().trim();
        const ingredientName = ingredientText.replace(amount, '').trim() || ingredientText;

        // Add only non-empty ingredients to the array
        if (ingredientText) {
          ingredients.push({ amount, name: ingredientName });
        }
      });
    });

    // If no ingredients were found with the specified selectors, try a broader search
    if (ingredients.length === 0) {
      $('li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.toLowerCase().includes('ingredient')) {
          ingredients.push({ name: text });
        }
      });
    }*//*

    // Extract calories from various possible locations
    let calories = null;
    const calorieSelectors = [
      '.calories',
      '.nutrition-calories',
      '.calorie-count',
      'meta[itemprop="calories"]',
      'meta[property="og:calories"]',
      'meta[name="calories"]'
    ];

    calorieSelectors.some((selector) => {
      const element = $(selector);
      if (element.length) {
        calories = element.text().trim() || element.attr('content');
        return true; // Exit loop if we find calories
      }
      return false;
    });

    // Check if calories were found in the text, and if not, try parsing the whole page for any keyword match
    if (!calories) {
      const caloriePattern = /(\d+)\s*(kcal|calories|cal\b)/i;
      const match = caloriePattern.exec(data);
      if (match) {
        calories = match[1];
      }
    }

    // Final return with structured data
    return NextResponse.json({ success: true, name, ingredients, calories });
  } catch (error) {
    console.error('Error parsing the recipe:', error);
    return NextResponse.json({ success: false, message: 'Failed to parse recipe', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}*/


import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';
import { extractDomainFromUrl, scrapeRecipe } from '../../../../utils/recipeScrape/recipeScraper';
import { supportedDomains } from '../../../../utils/recipeScrape/domainConfig';

// Rate limiting configuration
const RATE_LIMIT = 60; // requests per minute
const requestCounts = new Map();
const MINUTE = 60 * 1000;

function isRateLimited(clientIp) {
    const now = Date.now();
    const minuteAgo = now - MINUTE;
    
    const recentRequests = requestCounts.get(clientIp) || [];
    const recentRequestCount = recentRequests.filter(time => time > minuteAgo).length;
    
    if (recentRequestCount >= RATE_LIMIT) {
        return true;
    }
    
    // Update request count
    requestCounts.set(clientIp, [...recentRequests.filter(time => time > minuteAgo), now]);
    return false;
}

export async function POST(req) {
    try {
        // Rate limiting
        const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(clientIp)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' }, 
                { status: 429 }
            );
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { success: false, message: 'URL is required' }, 
                { status: 400 }
            );
        }

        // Extract and validate domain
        const domain = extractDomainFromUrl(url);
        if (!supportedDomains.includes(domain)) {
            return NextResponse.json(
                { success: false, message: 'This recipe website is not currently supported' }, 
                { status: 400 }
            );
        }

        // Fetch and parse webpage
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = load(response.data);
        const result = await scrapeRecipe($, domain);

        if (!result.calories) {
            console.log('No calories found for recipe');
            // Still return success, but with a flag indicating missing calories
            return NextResponse.json({
                ...result,
                caloriesFound: false,
                message: 'Recipe parsed successfully, but calories information could not be found.'
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error parsing the recipe:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || 'Failed to parse recipe',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }, 
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { success: false, message: 'Method GET not allowed' }, 
        { status: 405 }
    );
}