const {
  findKthLargest,
} = require('../solutions/215-kth-largest-element-in-an-array')

describe('215. 数组中的第K个最大元素', () => {
  test('示例 1：[3,2,1,5,6,4], k = 2 → 5', () => {
    expect(findKthLargest([3, 2, 1, 5, 6, 4], 2)).toBe(5)
  })

  test('示例 2：[3,2,3,1,2,4,5,5,6], k = 4 → 4（不去重）', () => {
    expect(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toBe(4)
  })

  test('边界：k = 1 取最大，k = n 取最小', () => {
    expect(findKthLargest([2, 1], 1)).toBe(2)
    expect(findKthLargest([2, 1], 2)).toBe(1)
  })
})
