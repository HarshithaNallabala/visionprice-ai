import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PropertyEstimate {
  id: string;
  locality: string;
  area_sqft: number;
  bhk: number;
  bath: number;
  age_years: number;
  property_type: string;
  predicted_price_lakhs: number;
  price_per_sqft: number;
  infra_scores: {
    power: number;
    internet: number;
    water: number;
    greenery: number;
    road: number;
    pollution: number;
    noise: number;
    schools: number;
    hospitals: number;
    parks: number;
    metro_distance_km: number;
    building_density: number;
    similarity_score: number;
  };
  future_prices: {
    after_1_year_lakhs: number;
    after_5_years_lakhs: number;
    growth_rate: number;
  };
  images: {
    satellite_url: string;
    street_url: string;
  };
  timestamp: number;
}

interface PropertyStore {
  savedProperties: PropertyEstimate[];
  comparisonList: PropertyEstimate[];
  addProperty: (property: PropertyEstimate) => void;
  removeProperty: (id: string) => void;
  addToComparison: (property: PropertyEstimate) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      savedProperties: [],
      comparisonList: [],
      addProperty: (property) =>
        set((state) => ({
          savedProperties: [property, ...state.savedProperties.filter((p) => p.id !== property.id)],
        })),
      removeProperty: (id) =>
        set((state) => ({
          savedProperties: state.savedProperties.filter((p) => p.id !== id),
        })),
      addToComparison: (property) =>
        set((state) => {
          if (state.comparisonList.length >= 4) return state;
          if (state.comparisonList.find((p) => p.id === property.id)) return state;
          return { comparisonList: [...state.comparisonList, property] };
        }),
      removeFromComparison: (id) =>
        set((state) => ({
          comparisonList: state.comparisonList.filter((p) => p.id !== id),
        })),
      clearComparison: () => set({ comparisonList: [] }),
      isInComparison: (id) => get().comparisonList.some((p) => p.id === id),
    }),
    {
      name: 'visionprice-storage',
    }
  )
);
