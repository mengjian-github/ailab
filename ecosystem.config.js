module.exports = {
  apps: [
    {
      name: "ailab",
      script: "./apps/server/dist/main.js",
      env: { PORT: 80, NODE_ENV: "production" },
    },
  ],
};
