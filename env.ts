import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'production', 'staging']),
  NEXT_PUBLIC_ANALYZE: z.enum(['true', 'false']),

  NEXT_PUBLIC_APP_DOMAIN: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
