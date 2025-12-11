import { PropertyEstimate } from '@/store/propertyStore';

// Bangalore localities with realistic data and coordinates for map tiles
export const localities = [
  { name: 'Indiranagar', avgPrice: 15000, growth: 8.5, lat: 12.9774, lng: 77.6410 },
  { name: 'Koramangala', avgPrice: 14500, growth: 9.2, lat: 12.9279, lng: 77.6284 },
  { name: 'HSR Layout', avgPrice: 12000, growth: 11.3, lat: 12.9128, lng: 77.6377 },
  { name: 'Whitefield', avgPrice: 8500, growth: 12.8, lat: 12.9698, lng: 77.7634 },
  { name: 'Electronic City', avgPrice: 6500, growth: 10.5, lat: 12.8456, lng: 77.6603 },
  { name: 'Marathahalli', avgPrice: 9000, growth: 8.9, lat: 12.9445, lng: 77.7033 },
  { name: 'Jayanagar', avgPrice: 16000, growth: 6.2, lat: 12.9308, lng: 77.5838 },
  { name: 'JP Nagar', avgPrice: 11000, growth: 7.8, lat: 12.9063, lng: 77.5857 },
  { name: 'Hebbal', avgPrice: 10500, growth: 9.5, lat: 13.0358, lng: 77.5970 },
  { name: 'Yelahanka', avgPrice: 7500, growth: 13.2, lat: 13.1007, lng: 77.5963 },
  { name: 'Sarjapur Road', avgPrice: 8000, growth: 14.5, lat: 12.9107, lng: 77.6871 },
  { name: 'Bellandur', avgPrice: 9500, growth: 11.8, lat: 12.9261, lng: 77.6781 },
  { name: 'Banashankari', avgPrice: 10000, growth: 6.8, lat: 12.9255, lng: 77.5468 },
  { name: 'BTM Layout', avgPrice: 11500, growth: 8.4, lat: 12.9166, lng: 77.6101 },
  { name: 'Malleshwaram', avgPrice: 17000, growth: 5.5, lat: 13.0035, lng: 77.5710 },
];

export const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Penthouse'];

// Generate real map tile URLs (same logic as Python backend)
const getMapImages = (locality: string) => {
  const localityData = localities.find((l) => l.name === locality);
  const lat = localityData?.lat || 12.9716;
  const lng = localityData?.lng || 77.5946;

  // Web Mercator tile math at zoom level 16
  const z = 16;
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, z);
  const xTile = Math.floor(((lng + 180.0) / 360.0) * n);
  const yTile = Math.floor(
    ((1.0 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2.0) * n
  );

  // Esri World Imagery for satellite view
  const satelliteUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${yTile}/${xTile}`;

  // OpenStreetMap for street view
  const streetUrl = `https://tile.openstreetmap.org/${z}/${xTile}/${yTile}.png`;

  return {
    satellite_url: satelliteUrl,
    street_url: streetUrl,
  };
};

// Generate infra scores matching backend response structure
// Backend returns: greenery_percent, building_density, road_quality, noise_level, 
// water_availability, internet_quality, schools_nearby, hospitals_nearby, parks_nearby, similarity_score
const generateInfraScores = (locality: string) => {
  const localityData = localities.find((l) => l.name === locality);
  const baseScore = localityData ? (localityData.avgPrice / 2000) : 5;
  
  // Simulate backend-like scores (scaled 0-100 for some, 0-10 for others)
  const greeneryPercent = Math.min(100, Math.max(20, baseScore * 8 + (Math.random() - 0.5) * 30));
  const buildingDensity = Math.min(100, Math.max(30, 100 - baseScore * 5 + (Math.random() - 0.5) * 20));
  const roadQuality = Math.min(10, Math.max(5, baseScore + (Math.random() - 0.5) * 2));
  const noiseLevel = Math.min(10, Math.max(3, 10 - baseScore + (Math.random() - 0.5) * 3));
  const waterAvailability = Math.min(10, Math.max(5, baseScore + (Math.random() - 0.5) * 3));
  const internetQuality = Math.min(10, Math.max(6, baseScore + (Math.random() - 0.5) * 2));
  const schoolsNearby = Math.floor(Math.max(3, Math.min(12, baseScore + Math.random() * 5)));
  const hospitalsNearby = Math.floor(Math.max(2, Math.min(8, baseScore * 0.8 + Math.random() * 3)));
  const parksNearby = Math.floor(Math.max(1, Math.min(6, baseScore * 0.5 + Math.random() * 3)));
  const similarityScore = Math.min(1, Math.max(0.5, 0.7 + Math.random() * 0.25));

  return {
    // Mapped to UI expectations (normalized to 0-10 scale for display)
    power: Math.min(10, Math.max(6, baseScore + (Math.random() - 0.5) * 2)), // fallback
    internet: internetQuality,
    water: waterAvailability,
    greenery: greeneryPercent / 10, // Convert percent to 0-10 scale
    road: roadQuality,
    pollution: Math.min(10, Math.max(3, 10 - buildingDensity / 10)), // Inverse of density
    noise: 10 - noiseLevel, // Inverse for "Low Noise" display
    schools: Math.min(10, schoolsNearby),
    hospitals: Math.min(10, hospitalsNearby),
    parks: Math.min(10, parksNearby * 1.5),
    metro_distance_km: Math.max(0.5, Math.min(8, 10 - baseScore + Math.random() * 3)),
    // New backend fields
    building_density: buildingDensity,
    similarity_score: similarityScore,
  };
};

// Property estimation API
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

  // Get real map tile images
  const images = getMapImages(params.locality);

  return {
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    predicted_price_lakhs: Math.round(totalPrice * 100) / 100,
    price_per_sqft: pricePerSqft,
    infra_scores: {
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
      building_density: Math.round(infraScores.building_density * 10) / 10,
      similarity_score: Math.round(infraScores.similarity_score * 100) / 100,
    },
    future_prices: {
      after_1_year_lakhs: Math.round(after1Year * 100) / 100,
      after_5_years_lakhs: Math.round(after5Years * 100) / 100,
      growth_rate: growthRate,
    },
    images,
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
  images: getMapImages(locality.name),
  timestamp: Date.now() - index * 86400000,
}));
