module.exports = {
  apps: [
    {
      name: 'backend', // The name of your application
      script: 'dist/main.js', // The path to your main application file
      instances: 1, // Number of instances to run
      exec_mode: 'cluster', // Enables clustering mode
      watch: false, // Watch for file changes (useful in development)
      env: {
        NODE_ENV: 'development', // Development environment variables
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production', // Production environment variables
        PORT: 3000,
      },
    },
  ],
};
