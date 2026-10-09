const { singleNumber } = require('../solutions/136-single-number')

describe('136. 只出现一次的数字', () => {
  test('示例 1：[2,2,1] → 1', () => {
    expect(singleNumber([2, 2, 1])).toBe(1)
  })

  test('示例 2：[4,1,2,1,2] → 4', () => {
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4)
  })

  test('示例 3：[1] → 1', () => {
    expect(singleNumber([1])).toBe(1)
  })

  test('含负数：[-1,-1,5] → 5', () => {
    expect(singleNumber([-1, -1, 5])).toBe(5)
  })
})
