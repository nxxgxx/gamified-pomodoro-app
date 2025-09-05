// this disables jest's default so that it can work well with our "type": "module" in that is in our package.json

export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  maxWorkers: 1,
  testTimeout: 10000
};