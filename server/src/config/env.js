const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  FRONTEND_URL: Joi.string().uri().required(),
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  ANTHROPIC_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  process.exit(1);
}

module.exports = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  frontendUrl: envVars.FRONTEND_URL,
  supabase: {
    url: envVars.SUPABASE_URL,
    serviceKey: envVars.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: envVars.SUPABASE_ANON_KEY,
  },
  anthropicKey: envVars.ANTHROPIC_API_KEY,
  jwtSecret: envVars.JWT_SECRET,
};
