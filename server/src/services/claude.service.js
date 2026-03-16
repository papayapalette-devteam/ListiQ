const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const LISTING_SYS = `You are an expert e-commerce catalog optimizer. Your task is to analyze product images and details to generate optimized listings for Amazon, Flipkart, and Meesho. 
Return a JSON object with strictly these keys:
{
  "amazon": { "title": "...", "bullets": ["...", "..."], "description": "...", "searchTerms": "..." },
  "flipkart": { "title": "...", "description": "...", "keyFeatures": ["...", "..."] },
  "meesho": { "title": "...", "description": "..." }
}`;

const TRENDING_SYS = `You are a market research analyst specializing in e-commerce trends. 
Analyze the query and provide a JSON response with:
{
  "trendScore": 0-100,
  "marketOverview": "...",
  "topTrendingNiches": [{ "name": "...", "searchVolume": "...", "competition": "...", "growth": "..." }],
  "gaps": ["...", "..."]
}`;

const ADVISOR_SYS = `You are "SellerGuru", an AI catalog assistant for ListiQ. Help users with listing errors, keyword research, and A+ content. Be professional, helpful, and concise.`;

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = "claude-3-5-sonnet-20240620"; // As per request: "claude-sonnet-4-20250514" or sonnet 3.5
  }

  async _callWithRetry(params, attempts = 3) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await this.client.messages.create(params);
      } catch (err) {
        lastError = err;
        // Retry on 529 (Overloaded) or 500
        if (err.status === 529 || err.status === 500) {
          const delay = Math.pow(2, i) * 1000;
          console.warn(`Claude API overloaded. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }

  async generateListing(imageBase64, mediaType, formData) {
    try {
      const response = await this._callWithRetry({
        model: this.model,
        max_tokens: 4096,
        system: LISTING_SYS,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `Product Details: ${JSON.stringify(formData)}`,
              },
            ],
          },
        ],
      });

      return JSON.parse(response.content[0].text);
    } catch (err) {
      console.error('Claude generateListing error:', err);
      throw new Error(`AI generation failed: ${err.message}`);
    }
  }

  async researchTrending(query, platform) {
    try {
      const response = await this._callWithRetry({
        model: this.model,
        max_tokens: 2000,
        system: TRENDING_SYS,
        messages: [
          {
            role: "user",
            content: `Research trending products for: "${query}" on platform: ${platform}`,
          },
        ],
      });

      return JSON.parse(response.content[0].text);
    } catch (err) {
      console.error('Claude researchTrending error:', err);
      throw new Error(`Market research failed: ${err.message}`);
    }
  }

  async askAdvisor(messages) {
    try {
      const response = await this._callWithRetry({
        model: this.model,
        max_tokens: 1000,
        system: ADVISOR_SYS,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      });

      return response.content[0].text;
    } catch (err) {
      console.error('Claude askAdvisor error:', err);
      throw new Error(`AI Advisor failed: ${err.message}`);
    }
  }
}

module.exports = new ClaudeService();
