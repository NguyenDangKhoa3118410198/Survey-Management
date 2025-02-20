/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    "^.+\\.jsx?$": "babel-jest",
  },

  testMatch: ["**/__tests__/**/*.(ts|tsx)", "**/?(*.)+(test).(ts|tsx)"], 
  testPathIgnorePatterns: ["/cypress/", ".*\\.cy\\.tsx$"],
  modulePathIgnorePatterns: ["<rootDir>/cypress/"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
