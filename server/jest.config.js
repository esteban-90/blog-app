export default {
  moduleNameMapper: {
    '#(.*)': '<rootDir>/source/$1/index.js',
  },
  testEnvironment: 'jest-environment-node',
  transform: {},
}
