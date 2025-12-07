import { PropertyEstimate } from '@/store/propertyStore';

// Bangalore localities with realistic data
export const localities = [
  { name: 'Indiranagar', avgPrice: 15000, growth: 8.5 },
  { name: 'Koramangala', avgPrice: 14500, growth: 9.2 },
  { name: 'HSR Layout', avgPrice: 12000, growth: 11.3 },
  { name: 'Whitefield', avgPrice: 8500, growth: 12.8 },
  { name: 'Electronic City', avgPrice: 6500, growth: 10.5 },
  { name: 'Marathahalli', avgPrice: 9000, growth: 8.9 },
  { name: 'Jayanagar', avgPrice: 16000, growth: 6.2 },
  { name: 'JP Nagar', avgPrice: 11000, growth: 7.8 },
  { name: 'Hebbal', avgPrice: 10500, growth: 9.5 },
  { name: 'Yelahanka', avgPrice: 7500, growth: 13.2 },
  { name: 'Sarjapur Road', avgPrice: 8000, growth: 14.5 },
  { name: 'Bellandur', avgPrice: 9500, growth: 11.8 },
  { name: 'Banashankari', avgPrice: 10000, growth: 6.8 },
  { name: 'BTM Layout', avgPrice: 11500, growth: 8.4 },
  { name: 'Malleshwaram', avgPrice: 17000, growth: 5.5 },
];

export const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Penthouse'];

// Generate random infra scores
const generateInfraScores = (locality: string) => {
  const localityData = localities.find((l) => l.name === locality);
  const baseScore = localityData ? (localityData.avgPrice / 2000) : 5;
  
  return {
    power: Math.min(10, Math.max(6, baseScore + (Math.random() - 0.5) * 2)),
    internet: Math.min(10, Math.max(6, baseScore + (Math.random() - 0.5) * 2)),
    water: Math.min(10, Math.max(5, baseScore + (Math.random() - 0.5) * 3)),
    greenery: Math.min(10, Math.max(4, baseScore + (Math.random() - 0.5) * 4)),
    road: Math.min(10, Math.max(6, baseScore + (Math.random() - 0.5) * 2)),
    pollution: Math.min(10, Math.max(3, 10 - baseScore + (Math.random() - 0.5) * 2)),
    noise: Math.min(10, Math.max(3, 10 - baseScore + (Math.random() - 0.5) * 3)),
    schools: Math.min(10, Math.max(5, baseScore + (Math.random() - 0.5) * 2)),
    hospitals: Math.min(10, Math.max(5, baseScore + (Math.random() - 0.5) * 2)),
    parks: Math.min(10, Math.max(4, baseScore + (Math.random() - 0.5) * 3)),
    metro_distance_km: Math.max(0.5, Math.min(8, 10 - baseScore + Math.random() * 3)),
  };
};

// Mock property estimation API
export const estimateProperty = async (params: {
  locality: string;
  area_sqft: number;
  bhk: number;
  bath: number;
  age_years: number;
  property_type: string;
}): Promise<PropertyEstimate> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  const localityData = localities.find((l) => l.name === params.locality);
  const basePricePerSqft = localityData?.avgPrice || 10000;
  const growthRate = localityData?.growth || 8;

  // Calculate price adjustments
  let priceMultiplier = 1;
  
  // BHK premium
  if (params.bhk >= 3) priceMultiplier += 0.15;
  if (params.bhk >= 4) priceMultiplier += 0.1;
  
  // Property type adjustment
  if (params.property_type === 'Villa') priceMultiplier += 0.25;
  if (params.property_type === 'Penthouse') priceMultiplier += 0.35;
  if (params.property_type === 'Independent House') priceMultiplier += 0.15;
  
  // Age depreciation
  const ageDepreciation = Math.max(0.7, 1 - params.age_years * 0.015);
  priceMultiplier *= ageDepreciation;

  const pricePerSqft = Math.round(basePricePerSqft * priceMultiplier);
  const totalPrice = (pricePerSqft * params.area_sqft) / 100000; // Convert to lakhs

  const infraScores = generateInfraScores(params.locality);

  // Calculate future prices
  const after1Year = totalPrice * (1 + growthRate / 100);
  const after5Years = totalPrice * Math.pow(1 + growthRate / 100, 5);

  return {
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    predicted_price_lakhs: Math.round(totalPrice * 100) / 100,
    price_per_sqft: pricePerSqft,
    infra_scores: {
      ...infraScores,
      power: Math.round(infraScores.power * 10) / 10,
      internet: Math.round(infraScores.internet * 10) / 10,
      water: Math.round(infraScores.water * 10) / 10,
      greenery: Math.round(infraScores.greenery * 10) / 10,
      road: Math.round(infraScores.road * 10) / 10,
      pollution: Math.round(infraScores.pollution * 10) / 10,
      noise: Math.round(infraScores.noise * 10) / 10,
      schools: Math.round(infraScores.schools * 10) / 10,
      hospitals: Math.round(infraScores.hospitals * 10) / 10,
      parks: Math.round(infraScores.parks * 10) / 10,
      metro_distance_km: Math.round(infraScores.metro_distance_km * 10) / 10,
    },
    future_prices: {
      after_1_year_lakhs: Math.round(after1Year * 100) / 100,
      after_5_years_lakhs: Math.round(after5Years * 100) / 100,
      growth_rate: growthRate,
    },
    images: {
      satellite_url: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop`,
      street_url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop`,
    },
    timestamp: Date.now(),
  };
};

// Mock chatbot responses
export const chatbotResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm VisionAI, your property intelligence assistant. How can I help you today?",
    "Hi there! Ready to help you find your dream property in Bangalore. What would you like to know?",
    "Welcome to VisionPrice! I can help you with property valuations, market insights, and investment advice.",
  ],
  price: [
    "Based on current market trends, property prices in Bangalore vary from ₹6,500/sqft in Electronic City to ₹17,000/sqft in Malleshwaram.",
    "I recommend checking our Estimator for accurate valuations. Shall I guide you there?",
    "Premium localities like Indiranagar and Koramangala command prices above ₹14,000/sqft due to excellent infrastructure.",
  ],
  investment: [
    "For investment, I'd recommend areas like Sarjapur Road (14.5% growth) and Yelahanka (13.2% growth).",
    "Consider emerging areas like Whitefield and Electronic City for long-term appreciation potential.",
    "Our Market Insights page shows detailed growth projections for each locality.",
  ],
  locality: [
    "HSR Layout offers a great balance of price (₹12,000/sqft) and growth potential (11.3%).",
    "For families, Jayanagar and Banashankari offer excellent schools and amenities.",
    "Tech professionals often prefer Whitefield and Electronic City for proximity to IT parks.",
  ],
  default: [
    "That's an interesting question! I'd suggest exploring our Estimator tool for detailed property analysis.",
    "For more specific insights, try our Market Insights page or use the comparison feature.",
    "Would you like me to help you with property valuation or market trends?",
  ],
};

export const getChatbotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return chatbotResponses.greeting[Math.floor(Math.random() * chatbotResponses.greeting.length)];
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
    return chatbotResponses.price[Math.floor(Math.random() * chatbotResponses.price.length)];
  }
  if (lowerMessage.includes('invest') || lowerMessage.includes('growth') || lowerMessage.includes('return')) {
    return chatbotResponses.investment[Math.floor(Math.random() * chatbotResponses.investment.length)];
  }
  if (lowerMessage.includes('area') || lowerMessage.includes('locality') || lowerMessage.includes('location')) {
    return chatbotResponses.locality[Math.floor(Math.random() * chatbotResponses.locality.length)];
  }
  
  return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
};

// Sample portfolio properties
export const portfolioProperties: PropertyEstimate[] = localities.slice(0, 12).map((locality, index) => ({
  id: `portfolio_${index}`,
  locality: locality.name,
  area_sqft: 1200 + Math.floor(Math.random() * 1500),
  bhk: Math.floor(Math.random() * 3) + 2,
  bath: Math.floor(Math.random() * 2) + 2,
  age_years: Math.floor(Math.random() * 10),
  property_type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
  predicted_price_lakhs: Math.round((locality.avgPrice * (1200 + Math.random() * 800) / 100000) * 100) / 100,
  price_per_sqft: locality.avgPrice,
  infra_scores: generateInfraScores(locality.name) as PropertyEstimate['infra_scores'],
  future_prices: {
    after_1_year_lakhs: 0,
    after_5_years_lakhs: 0,
    growth_rate: locality.growth,
  },
  images: {
    satellite_url: `https://images.unsplash.com/photo-154532441${8 + index}-cc1a3fa10c00?w=600&h=400&fit=crop`,
    street_url: `https://images.unsplash.com/photo-156044820${4 + index}-e02f11c3d0e2?w=600&h=400&fit=crop`,
  },
  timestamp: Date.now() - index * 86400000,
}));
