const { searchRange, lowerBound, upperBound } = require('../solutions/034-find-first-and-last-position-of-element-in-sorted-array')

describe('34. 在排序数组中查找元素的第一个和最后一个位置', () => {
  test('示例 1：target 重复出现 → [3,4]', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4])
  })

  test('示例 2：target 不存在 → [-1,-1]', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toEqual([-1, -1])
  })

  test('示例 3：空数组 → [-1,-1]', () => {
    expect(searchRange([], 0)).toEqual([-1, -1])
  })

  test('边界：单元素命中 / 未命中', () => {
    expect(searchRange([1], 1)).toEqual([0, 0])
    expect(searchRange([1], 2)).toEqual([-1, -1])
  })

  test('边界：全部等于 target（左右边界分别落在两端）', () => {
    expect(searchRange([2, 2, 2, 2], 2)).toEqual([0, 3])
  })

  test('边界：target 比所有元素都小 / 都大', () => {
    expect(searchRange([5, 7, 9], 1)).toEqual([-1, -1])
    expect(searchRange([5, 7, 9], 100)).toEqual([-1, -1])
  })

  describe('两个子函数（模板 01 变体 B1/B2）', () => {
    test('lowerBound：第一个 >= target 的位置，找不到返回 length', () => {
      const nums = [1, 3, 3, 5]
      expect(lowerBound(nums, 3)).toBe(1)
      expect(lowerBound(nums, 4)).toBe(3) // 3 是 5 的下标
      expect(lowerBound(nums, 0)).toBe(0)
      expect(lowerBound(nums, 9)).toBe(4)
    })

    test('upperBound：第一个 > target 的位置', () => {
      const nums = [1, 3, 3, 5]
      expect(upperBound(nums, 3)).toBe(3)
      expect(upperBound(nums, 0)).toBe(0)
      expect(upperBound(nums, 9)).toBe(4)
    })

    test('区间长度 = upperBound - lowerBound', () => {
      const nums = [5, 7, 7, 8, 8, 10]
      expect(upperBound(nums, 8) - lowerBound(nums, 8)).toBe(2)
      expect(upperBound(nums, 6) - lowerBound(nums, 6)).toBe(0)
    })
  })
})
