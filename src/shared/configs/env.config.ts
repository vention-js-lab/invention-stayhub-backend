import { z } from 'zod';

const envConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test']),
  APP_PORT: z.coerce.number().int().positive(),
  COOKIES_REFRESH_MS: z.coerce.number().int().positive(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRY: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),

  CORS_ENABLED: z.string().transform((val) => val === 'true'),
  CORS_ALLOWED_ORIGINS: z.string(),
  CORS_ALLOWED_METHODS: z.string(),

  CLOUDFLARE_ROOT_USER: z.string(),
  CLOUDFLARE_ROOT_PASSWORD: z.string(),
  CLOUDFLARE_ENDPOINT: z.string(),
  CLOUDFLARE_PORT: z.coerce.number().int().positive(),
  CLOUDFLARE_USE_SSL: z.coerce.boolean(),
  CLOUDFLARE_IMAGE_URL: z.string(),

  STRIPE_PRIVATE_API_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  RESEND_API_KEY: z.string(),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export function validateEnv(config: unknown): EnvConfig {
  const parsedConfig = envConfigSchema.safeParse(config);

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((error) => {
      return {
        field: error.path.join('.'),
        message: error.message,
      };
    });

    throw new Error(`Config validation error: ${JSON.stringify(errors)}`);
  }

  return parsedConfig.data;
}
