module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  collectCoverage: false,
  verbose: false,
  moduleNameMapper: {
    './src/index-minimal': '<rootDir>/node_modules/@apollo/protobufjs/src/index-minimal',
    './src/index': '<rootDir>/node_modules/js-beautify/js/index',
    'src/(.*)': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/before-test-run.ts'],
  displayName: {
    name: 'ABJAD',
    color: 'blue'
  }
};
