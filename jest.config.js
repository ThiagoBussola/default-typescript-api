module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  clearMocks: true,
  coverageProvider: 'v8',
  testPathIgnorePatterns: ['./dist/*']
}
