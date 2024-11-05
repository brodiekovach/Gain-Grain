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