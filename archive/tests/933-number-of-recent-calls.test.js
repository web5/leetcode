const { RecentCounter } = require('../solutions/933-number-of-recent-calls')

describe('933. 最近的请求次数', () => {
  test('示例 1：ping(1)/(100)/(3001)/(3002) → 1,2,3,3', () => {
    const counter = new RecentCounter()
    expect(counter.ping(1)).toBe(1)
    expect(counter.ping(100)).toBe(2)
    expect(counter.ping(3001)).toBe(3)
    expect(counter.ping(3002)).toBe(3)
  })
})
