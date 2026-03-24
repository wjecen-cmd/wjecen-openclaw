module.exports = {
  apps: [
    {
      name: 'jt-admin',
      script: 'npm',
      args: 'start',
      cwd: 'C:/www/jiuteng-platform/web',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};