module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/*.test.ts"],  
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"  // Para imports absolutos 
  },
  collectCoverage: true,  // Para generar reportes de cobertura
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  verbose: true
};