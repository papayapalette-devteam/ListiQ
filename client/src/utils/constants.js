export const CATEGORIES = [
  {
    name: 'Clothing & Accessories',
    subcategories: [
      { name: 'Women', sub: ['Ethnic Wear', 'Western Wear', 'Lingerie'] },
      { name: 'Men', sub: ['Topwear', 'Bottomwear', 'Footwear'] }
    ]
  },
  {
    name: 'Home & Kitchen',
    subcategories: [
      { name: 'Home Decor', sub: ['Wall Decor', 'Lighting', 'Curtains'] },
      { name: 'Kitchen', sub: ['Cookware', 'Storage', 'Small Appliances'] }
    ]
  },
  {
    name: 'Beauty & Wellness',
    subcategories: [
      { name: 'Skin Care', sub: ['Face', 'Body', 'Sun Care'] },
      { name: 'Personal Care', sub: ['Hair Care', 'Bath & Body'] }
    ]
  }
];

export const PLATFORM_TIPS = {
  amazon: {
    color: 'orange',
    tips: [
      'Use high-volume backend search terms (max 250 bytes).',
      'Bullet points should highlight benefits, not just features.',
      'Ensure the main image has a pure white background.'
    ]
  },
  flipkart: {
    color: 'blue',
    tips: [
      'Focus on "Key Features" as they drive technical search results.',
      'Add variations for sizes and colors in a single listing.',
      'Keep titles concise but keyword-rich.'
    ]
  },
  meesho: {
    color: 'purple',
    tips: [
      'Simpler descriptions perform better for the Meesho audience.',
      'Ensure price points are competitive for high-volume categories.',
      'High-quality lifestyle images are highly recommended.'
    ]
  }
};
