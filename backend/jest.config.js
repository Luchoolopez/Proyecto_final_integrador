// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: [
    "**/__tests__/**/*.test.(ts|js)",   // sigue valiendo para tests en __tests__
    "**/src/test/**/*.test.(ts|js)"    // agrega tus tests en backend/src/test
  ]
};
