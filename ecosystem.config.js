module.exports = {
  apps: [
    {
      name: "ailab",
      script: "./apps/server/dist/main.js",
      env: { PORT: 443, NODE_ENV: "production" },
    },
  ],
};
