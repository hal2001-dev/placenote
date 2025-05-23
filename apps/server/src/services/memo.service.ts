import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { Memo, MemoCreateInput, MemoUpdateInput, NearbyMemoQuery } from '../models/memo';

export class MemoService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey
    );
  }

  async createMemo(userId: string, input: MemoCreateInput): Promise<Memo> {
    const { data, error } = await this.supabase
      .from('memo')
      .insert({
        user_id: userId,
        title: input.title,
        content: input.content,
        location: {
          type: 'Point',
          coordinates: [input.location.longitude, input.location.latitude],
        },
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMemoById(id: string): Promise<Memo> {
    const { data, error } = await this.supabase
      .from('memo')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateMemo(id: string, userId: string, input: MemoUpdateInput): Promise<Memo> {
    const updateData: any = {};
    if (input.title) updateData.title = input.title;
    if (input.content) updateData.content = input.content;
    if (input.location) {
      updateData.location = {
        type: 'Point',
        coordinates: [input.location.longitude, input.location.latitude],
      };
    }

    const { data, error } = await this.supabase
      .from('memo')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMemo(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('memo')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getNearbyMemos(query: NearbyMemoQuery): Promise<(Memo & { distance: number })[]> {
    const { data, error } = await this.supabase
      .rpc('get_nearby_memos', {
        p_longitude: query.longitude,
        p_latitude: query.latitude,
        p_radius: query.radius || 50,
        p_limit: query.limit || 20,
      });

    if (error) throw error;
    return data;
  }
} 