const { climbStairs } = require('../solutions/070-climbing-stairs')

describe('70. 爬楼梯', () => {
  test('示例 1：n = 2 → 2 种', () => {
    expect(climbStairs(2)).toBe(2)
  })

  test('示例 2：n = 3 → 3 种', () => {
    expect(climbStairs(3)).toBe(3)
  })

  test('边界：n = 1 → 1 种', () => {
    expect(climbStairs(1)).toBe(1)
  })

  test('上限：n = 45 → 1836311903（即 Fib(46)，仍在安全整数内）', () => {
    expect(climbStairs(45)).toBe(1836311903)
  })
})
