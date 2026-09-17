const { sortArray } = require('../solutions/912-sort-an-array')

describe('912. 排序数组', () => {
  test('示例 1：[5,2,3,1] → [1,2,3,5]', () => {
    expect(sortArray([5, 2, 3, 1])).toEqual([1, 2, 3, 5])
  })

  test('示例 2：[5,1,1,2,0,0] → [0,0,1,1,2,5]（值可重复）', () => {
    expect(sortArray([5, 1, 1, 2, 0, 0])).toEqual([0, 0, 1, 1, 2, 5])
  })

  test('边界：空数组、单元素、已排序、逆序', () => {
    expect(sortArray([])).toEqual([])
    expect(sortArray([1])).toEqual([1])
    expect(sortArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(sortArray([3, 2, 1])).toEqual([1, 2, 3])
  })

  test('含负数', () => {
    expect(sortArray([-1, 5, -3, 0])).toEqual([-3, -1, 0, 5])
  })
})
