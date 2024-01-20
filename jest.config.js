/** @type {import('jest').Config} */
module.exports = {
  // roots: ['<rootDir>'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['js', 'mjs', 'json']
  // collectCoverage: true, // 是否显示覆盖率报告
}
