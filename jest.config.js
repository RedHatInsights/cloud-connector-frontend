module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/index.js', '!src/api/instance.js'],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.js'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@patternfly/react-icons)).*$'],
  globalSetup: '<rootDir>/globalSetup.js',
};
