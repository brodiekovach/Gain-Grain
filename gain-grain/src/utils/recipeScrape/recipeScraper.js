// utils/recipeScraper.js
import { load } from 'cheerio';
import { recipeSelectors } from './domainConfig';

export function extractDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    } catch (error) {
        throw new Error('Invalid URL format');
    }
}

function getTitleFromSelector($, titleSelector) {
    // Try the specific selector first
    let title = $(titleSelector).first().text().trim();
    
    // If no title found, try common fallback selectors
    if (!title) {
        const fallbackSelectors = [
            'h1',
            'h1.recipe-title',
            'h1.entry-title',
            'h2.recipe-title',
            '.recipe-title',
            '.recipe-name',
            'meta[property="og:title"]',
            'title'
        ];

        for (const selector of fallbackSelectors) {
            if (selector === 'meta[property="og:title"]') {
                title = $(selector).attr('content');
            } else {
                title = $(selector).first().text().trim();
            }
            
            if (title) break;
        }
    }

    // Clean up the title
    if (title) {
        // Remove common suffixes like "| AllRecipes" or "- Food.com"
        title = title.split('|')[0].split('-')[0].trim();
        // Remove "Recipe" suffix if it exists
        title = title.replace(/\s+recipe$/i, '').trim();
    }

    return title;
}

export function parseIngredient(ingredientText, amountText = '') {
    // Clean up the input text first
    let cleanText = ingredientText
        .replace(/\n+/g, ' ')  // Replace newlines with spaces
        .replace(/\s+/g, ' ')  // Normalize multiple spaces
        .trim();

    // If the text contains a full ingredient list, skip it
    if (cleanText.includes('Ingredients') || 
        cleanText.includes('yields') || 
        cleanText.includes('servings') ||
        cleanText.match(/\d+x\b/)) {
        return null;
    }

    let amount = amountText.trim();
    let name = cleanText;

    // Define measurement units pattern
    const measurementUnits = [
        'cup', 'cups',
        'tablespoon', 'tablespoons', 'tbsp',
        'teaspoon', 'teaspoons', 'tsp',
        'ounce', 'ounces', 'oz',
        'pound', 'pounds', 'lb', 'lbs',
        'gram', 'grams', 'g',
        'kilogram', 'kilograms', 'kg',
        'milliliter', 'milliliters', 'ml',
        'liter', 'liters', 'l',
        'pinch', 'pinches',
        'dash', 'dashes',
        'handful', 'handfuls',
        'piece', 'pieces',
        'slice', 'slices',
        'package', 'packages',
        'can', 'cans',
        'bottle', 'bottles',
        'bunch', 'bunches',
        'clove', 'cloves',
        'stick', 'sticks',
        'sprig', 'sprigs',
        'head', 'heads',
        'leaf', 'leaves',
        'stalk', 'stalks',
        'whole',
        'jar', 'jars',
        'container', 'containers',
        'box', 'boxes'
    ].join('|');

    // If no separate amount provided, try to extract from the name
    if (!amount) {
        // Match measurement patterns including fractions and decimals
        const measurementPattern = new RegExp(
            `^((?:\\d+(?:\\s+\\d+)?(?:\\/\\d+)?|\\d*\\.?\\d+)\\s*(?:${measurementUnits}))\\b\\s*`,
            'i'
        );
        
        // Match just numbers at the start (for cases like "1 onion")
        const numberPattern = /^(\d+(?:\s+\d+)?(?:\/\d+)?|\d*\.?\d+)\s+/;

        const measureMatch = name.match(measurementPattern);
        const numberMatch = !measureMatch && name.match(numberPattern);

        if (measureMatch) {
            amount = measureMatch[1].trim();
            name = name.slice(measureMatch[0].length).trim();
        } else if (numberMatch) {
            amount = numberMatch[1].trim();
            name = name.slice(numberMatch[0].length).trim();
        }
    }

    // Clean up the name
    // Remove any packaging info in parentheses at the start
    name = name.replace(/^\([\d\-\s]+(ounce|oz|pound|lb|gram|g)\)\s*/i, '');
    
    // Handle case where the entire ingredient list got captured
    if (name.includes('cup') && name.includes('teaspoon') && name.includes('tablespoon')) {
        return null;
    }

    // If we have multiple ingredients in the name (indicating a parsing error), return null
    if (name.match(/\d+\s+(?:cup|tablespoon|teaspoon|tbsp|tsp)\b.*\d+\s+(?:cup|tablespoon|teaspoon|tbsp|tsp)\b/i)) {
        return null;
    }

    // Return null if we don't have a valid ingredient
    if (!name || name.length < 2) {
        return null;
    }

    return {
        amount: amount || 'as needed',
        name: name
    };
}

export async function scrapeRecipe($, domain) {
    const selectors = recipeSelectors[domain];
    if (!selectors) {
        throw new Error('Unsupported domain');
    }

    // Extract title with better error handling
    const name = getTitleFromSelector($, selectors.titleSelector);
    if (!name) {
        console.warn('Could not find recipe name using primary or fallback selectors');
        // Instead of throwing error, use a fallback name
        throw new Error('Could not find recipe name. Please check if the URL is correct and the recipe page is accessible.');
    }

    // Extract ingredients
    const ingredients = [];
    const ingredientElements = $(selectors.ingredientsSelector);
    const amountElements = selectors.ingredientsAmountSelector 
        ? $(selectors.ingredientsAmountSelector) 
        : [];

    if (ingredientElements.length === 0) {
        // Try fallback selectors for ingredients
        const fallbackSelectors = [
            '.recipe-ingredients li',
            '.ingredients li',
            '[itemprop="recipeIngredient"]',
            '.ingredient-list li',
            '.ingredient',
            '[class*="ingredient"]'
        ];

        for (const selector of fallbackSelectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                elements.each((i, el) => {
                    const ingredientText = $(el).text().trim();
                    if (ingredientText) {
                        const parsed = parseIngredient(ingredientText);
                        if (parsed) {
                            ingredients.push(parsed);
                        }
                    }
                });
                break;
            }
        }
    } else {
        ingredientElements.each((i, el) => {
            const ingredientText = $(el).text().trim();
            const amountText = amountElements[i] 
                ? $(amountElements[i]).text().trim() 
                : '';
            
            if (ingredientText) {
                const parsed = parseIngredient(ingredientText, amountText);
                if (parsed) {
                    ingredients.push(parsed);
                }
            }
        });
    }

    // Extract calories with fallbacks
    const caloriePatterns = [
        /(\d+)\s*(?:kcal|calories|cal\b)/i,
        /Calories:\s*(\d+)/i,
        /Nutrition.*?(\d+)\s*(?:kcal|calories|cal\b)/i
    ];

    let calories = null;
    const pageText = $('body').text();
    
    for (const pattern of caloriePatterns) {
        const match = pageText.match(pattern);
        if (match) {
            calories = parseInt(match[1], 10);
            break;
        }
    }

    if (!calories) {
        const calorieSelectors = [
            '[itemprop="calories"]',
            '.nutrition-info calories',
            '.calorie-count',
            'meta[itemprop="calories"]',
            'meta[property="og:calories"]',
            'meta[name="calories"]',
            '.nutrition-per-serving'
        ];

        for (const selector of calorieSelectors) {
            const element = $(selector);
            if (element.length) {
                const value = element.text().trim() || element.attr('content');
                const numberMatch = value?.match(/\d+/);
                if (numberMatch) {
                    calories = parseInt(numberMatch[0], 10);
                    break;
                }
            }
        }
    }

    // Validate the scraped data
    if (ingredients.length === 0) {
        console.warn('No ingredients found for recipe');
    }

    return {
        name,
        ingredients,
        calories,
        success: true,
        caloriesFound: calories !== null
    };
}