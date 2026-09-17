/**
 * Jest 配置（刻意保持轻量，避免跑测试时把 CPU 打满）
 *
 * 1. transform: {}      —— 源码都是原生 CommonJS，Node 20 直接能跑，
 *                          跳过 babel-jest 转换，省掉最大的一块 CPU 开销。
 * 2. maxWorkers: 1      —— 单进程串行执行，不开多 worker（题量小，没必要并发）。
 * 3. 只匹配 tests/ 下的 *.test.js，避免扫描无关目录。
 */
module.exports = {
  testEnvironment: 'node',
  transform: {},
  maxWorkers: 1,
  testMatch: ['<rootDir>/tests/**/*.test.js'],
}
