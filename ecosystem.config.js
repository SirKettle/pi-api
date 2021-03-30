module.exports = {
  apps: [
    {
      name: 'pi-kettle',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};