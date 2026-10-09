/**
 * Jest 配置（刻意保持轻量，避免跑测试时把 CPU 打满）
 *
 * 1. transform: {}      —— 源码都是原生 CommonJS，Node 20 直接能跑，
 *                          跳过 babel-jest 转换，省掉最大的一块 CPU 开销。
 * 2. maxWorkers: 1      —— 单进程串行执行，不开多 worker（题量小，没必要并发）。
 * 3. testMatch 指向 plan/week-XX/dN/ —— 一天一个目录，算法题与手撕题混放；
 *    每个作答文件都是自包含的（实现 + 测试素材 + 自测运行器），文件末尾的
 *    `typeof describe === 'function'` 分支就是给这里用的。
 * 4. testPathIgnorePatterns —— 排除 *.reference.js（学习用的参考实现，
 *    同一个目录下陪跑，不是测试文件）。
 *
 *   直接跑单题自测（不经 jest）：node plan/week-02/d2/015-3sum.js
 *   归档用例：npm run test:archive
 */
module.exports = {
  testEnvironment: 'node',
  transform: {},
  maxWorkers: 1,
  testMatch: ['<rootDir>/plan/week-*/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/', '\\.reference\\.js$'],
}
