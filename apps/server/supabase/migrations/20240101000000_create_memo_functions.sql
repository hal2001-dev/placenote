-- Enable PostGIS extension if not already enabled
create extension if not exists postgis;

-- Function to get nearby memos
create or replace function get_nearby_memos(
  p_longitude double precision,
  p_latitude double precision,
  p_radius double precision,
  p_limit integer
)
returns table (
  id uuid,
  user_id uuid,
  title text,
  content text,
  location geography,
  created_at timestamptz,
  updated_at timestamptz,
  distance double precision
)
language plpgsql
as $$
begin
  return query
  select
    m.id,
    m.user_id,
    m.title,
    m.content,
    m.location,
    m.created_at,
    m.updated_at,
    ST_Distance(
      m.location,
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
    ) as distance
  from memo m
  where ST_DWithin(
    m.location,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    p_radius
  )
  order by distance
  limit p_limit;
end;
$$; 