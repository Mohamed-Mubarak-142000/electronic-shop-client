import axios from 'axios';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface SearchResult {
    id: string;
    place_name: string;
    center: [number, number];
}

export const mapService = {
    async searchPlaces(query: string): Promise<SearchResult[]> {
        if (!query.trim()) return [];
        
        try {
            const response = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                {
                    params: {
                        access_token: MAPBOX_TOKEN,
                        types: 'place,address,poi',
                        limit: 5
                    }
                }
            );
            return response.data.features || [];
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }
};
