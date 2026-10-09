const { permute, permuteUnique } = require('../solutions/046-permutations')

// 全排列的答案顺序不作要求，比较前统一排序
const normalize = (list) => list.map((p) => p.join(',')).sort()

describe('46. 全排列', () => {
  test('示例 1：[1,2,3] → 6 个排列', () => {
    expect(normalize(permute([1, 2, 3]))).toEqual(
      normalize([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]])
    )
  })

  test('示例 2：[0,1] → 2 个排列', () => {
    expect(normalize(permute([0, 1]))).toEqual(normalize([[0, 1], [1, 0]]))
  })

  test('示例 3：单元素 → 只有它自己', () => {
    expect(permute([1])).toEqual([[1]])
  })

  test('边界：含负数、长度为 4 时共 4! = 24 个结果，且互不重复', () => {
    const res = permute([-1, 1, 2, 3])
    expect(res).toHaveLength(24)
    expect(new Set(normalize(res)).size).toBe(24) // 无重复排列
  })

  test('每个结果都是入参的一个排列（元素多重集一致）', () => {
    const nums = [4, 5, 6]
    const sortedKey = nums.slice().sort().join(',')
    for (const p of permute(nums)) {
      expect(p.slice().sort().join(',')).toBe(sortedKey)
    }
  })

  test('关键 bug 回归：结果里的数组不是同一个引用', () => {
    const res = permute([1, 2])
    res[0].push('污染')
    expect(res[1]).toEqual([2, 1]) // 若忘记 path.slice()，这里会被牵连
  })

  describe('47. 全排列 II（含重复数字）', () => {
    test('示例：[1,1,2] → 3 个不重复的排列', () => {
      expect(normalize(permuteUnique([1, 1, 2]))).toEqual(normalize([[1, 1, 2], [1, 2, 1], [2, 1, 1]]))
    })

    test('全部相同 → 只有 1 个结果', () => {
      expect(permuteUnique([2, 2, 2])).toEqual([[2, 2, 2]])
    })

    test('三个重复的 [1,1,2,2] → 4!/(2!·2!) = 6 个', () => {
      const res = permuteUnique([1, 1, 2, 2])
      expect(res).toHaveLength(6)
      expect(new Set(normalize(res)).size).toBe(6)
    })
  })
})
