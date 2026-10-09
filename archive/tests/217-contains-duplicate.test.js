const {
  containsDuplicate,
  containsDuplicateBySort,
} = require('../solutions/217-contains-duplicate')

// 每个实现跑同一批场景，保证行为一致
const impls = [
  ['Set containsDuplicate', containsDuplicate],
  ['排序 containsDuplicateBySort', containsDuplicateBySort],
]

describe('217. 存在重复元素', () => {
  impls.forEach(([name, fn]) => {
    describe(name, () => {
      test('示例 1：元素 1 在下标 0 和 3 出现', () => {
        expect(fn([1, 2, 3, 1])).toBe(true)
      })

      test('示例 2：所有元素都不同', () => {
        expect(fn([1, 2, 3, 4])).toBe(false)
      })

      test('示例 3：多个重复值', () => {
        expect(fn([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true)
      })

      test('边界：空数组 / 单元素', () => {
        expect(fn([])).toBe(false)
        expect(fn([1])).toBe(false)
      })

      test('负数与多位数不能被当成「子串」误判', () => {
        // 把元素拼成字符串再用 includes 查，会在这三组上误报
        expect(fn([12, 2])).toBe(false)
        expect(fn([-1, 1])).toBe(false)
        expect(fn([10, 0])).toBe(false)
      })

      test('负数重复：[-1, 5, -1] → true', () => {
        expect(fn([-1, 5, -1])).toBe(true)
      })
    })
  })

  test('两个实现对同一组数据结果一致', () => {
    const cases = [
      [2, 7, 11, 3],
      [1, 2, 3, 1],
      [0, 0],
      [-1000000000, 1000000000, -1000000000],
    ]
    for (const data of cases) {
      expect(containsDuplicate(data)).toBe(containsDuplicateBySort([...data]))
    }
  })

  test('containsDuplicate（Set）不改动入参', () => {
    const data = [3, 1, 2]
    containsDuplicate(data)
    expect(data).toEqual([3, 1, 2])
  })

  test('containsDuplicateBySort 会原地排序——这是换取 O(1) 额外空间的已知代价', () => {
    const data = [3, 1, 2]
    containsDuplicateBySort(data)
    expect(data).toEqual([1, 2, 3])
  })
})
