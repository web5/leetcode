const { dailyTemperatures, dailyTemperaturesBruteForce } = require('../solutions/739-daily-temperatures')

describe('739. 每日温度', () => {
  test('示例 1：[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]', () => {
    expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([1, 1, 4, 2, 1, 1, 0, 0])
  })

  test('示例 2：单调递增 → [1,1,1,0]', () => {
    expect(dailyTemperatures([30, 40, 50, 60])).toEqual([1, 1, 1, 0])
  })

  test('示例 3：[30,60,90] → [1,1,0]', () => {
    expect(dailyTemperatures([30, 60, 90])).toEqual([1, 1, 0])
  })

  test('边界：单元素 → [0]', () => {
    expect(dailyTemperatures([50])).toEqual([0])
  })

  test('边界：单调递减 → 全是 0', () => {
    expect(dailyTemperatures([90, 80, 70])).toEqual([0, 0, 0])
  })

  test('边界：全部相同 → 全是 0（必须严格更高温）', () => {
    expect(dailyTemperatures([70, 70, 70])).toEqual([0, 0, 0])
  })

  test('距离是「天数差」而非「是否有更高温」', () => {
    expect(dailyTemperatures([70, 69, 68, 71])).toEqual([3, 2, 1, 0])
  })

  test('与暴力解对照（随机数组）', () => {
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed / 2147483648
    }
    for (let round = 0; round < 30; round++) {
      const len = 1 + Math.floor(rand() * 40)
      const temps = Array.from({ length: len }, () => 30 + Math.floor(rand() * 70))
      expect(dailyTemperatures(temps)).toEqual(dailyTemperaturesBruteForce(temps))
    }
  })
})
