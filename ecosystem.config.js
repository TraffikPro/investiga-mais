module.exports = {
  apps: [
    // BACKEND
    {
      name: 'investiga-mais-backend',
      cwd: './backend',
      script: 'node',
      args: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      error_file: '/var/www/investiga-mais/backend/logs/err.log',
      out_file: '/var/www/investiga-mais/backend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'development',
        WHATSAPP_MODO_DEV: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
        WHATSAPP_TOKEN: 'SEU_TOKEN_AQUI',
        WHATSAPP_PHONE_NUMBER_ID: 'SEU_PHONE_NUMBER_ID_AQUI',
        JWT_SECRET: 'VlZISW5FOHlEWHF6c0pISk10Y1FkdG9vYVd6UDRkYkU=',
        DATABASE_URL: 'file:./dev.db',
        RESEND_API_KEY: 're_aFYsvx5b_L9haDi3SPocAC3BSEqMJC4Ng',
        RESEND_FROM: 'Investiga+ <onboarding@resend.dev>',
        IPQS_API_KEY: 'VCRBu8GCkXwgvAKjPJDt30XBkt305SVq',
        ABSTRACT_API_KEY: '9f15c8404c65494eaeaf90cd0242be51',
        SAFE_BROWSING_API_KEY: 'AIzaSyDe8vIQGvygVCZNX4USnwv-AbL6l7K2Qes',
      },
    },

    // FRONTEND
    {
      name: 'investiga-mais-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/www/investiga-mais/frontend/logs/err.log',
      out_file: '/var/www/investiga-mais/frontend/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}
