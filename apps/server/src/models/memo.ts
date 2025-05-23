export interface Memo {
  id: string;
  user_id: string;
  title: string;
  content: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  created_at: string;
  updated_at: string;
}

export interface MemoCreateInput {
  title: string;
  content: string;
  location: {
    longitude: number;
    latitude: number;
  };
}

export interface MemoUpdateInput {
  title?: string;
  content?: string;
  location?: {
    longitude: number;
    latitude: number;
  };
}

export interface NearbyMemoQuery {
  longitude: number;
  latitude: number;
  radius?: number; // meters
  limit?: number;
} 