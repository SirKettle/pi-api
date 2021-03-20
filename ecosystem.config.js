module.exports = {
  apps: [
    {
      name: 'pi-api',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};