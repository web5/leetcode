const { maxArea } = require('../solutions/011-container-with-most-water')

describe('11. 盛最多水的容器', () => {
  test('示例 1：最大水量 49', () => {
    expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49)
  })

  test('示例 2：只有两条线，水量 1', () => {
    expect(maxArea([1, 1])).toBe(1)
  })
})
