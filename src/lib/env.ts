import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_PROJECT_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
