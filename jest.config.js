/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "setupFiles": [
    "<rootDir>/tests/config.ts"
  ],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        "compiler": "ttypescript"
      }
    ]
  }
};