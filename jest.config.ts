/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  rootDir: ".",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testEnvironment: 'jsdom',
  testMatch: [
    "<rootDir>/src/**/*.(spec|test).ts"
  ],
  preset: 'jest-preset-angular',
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
  ],
};

export default config;