const { twoSum } = require('../solutions/001-two-sum')

describe('1. 两数之和', () => {
  test('示例 1：nums = [2,7,11,15], target = 9', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])
  })

  test('示例 2：nums = [3,2,4], target = 6', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])
  })

  test('示例 3：两个相同元素 [3,3], target = 6', () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1])
  })
})
