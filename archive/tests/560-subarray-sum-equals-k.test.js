const { subarraySum } = require('../solutions/560-subarray-sum-equals-k')

describe('560. 和为 K 的子数组', () => {
  test('示例 1：[1,1,1], k = 2 → 2 个', () => {
    expect(subarraySum([1, 1, 1], 2)).toBe(2)
  })

  test('示例 2：[1,2,3], k = 3 → 2 个（[1,2] 和 [3]）', () => {
    expect(subarraySum([1, 2, 3], 3)).toBe(2)
  })

  test('含负数：[1,-1,1], k = 0 → 2 个', () => {
    expect(subarraySum([1, -1, 1], 0)).toBe(2)
  })
})
