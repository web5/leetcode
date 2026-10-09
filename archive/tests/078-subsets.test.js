const { subsets } = require('../solutions/078-subsets')

// 子集顺序无关，统一成「组内升序 + 组间排序」的字符串再比较
function normalize(list) {
  return list.map((s) => [...s].sort((a, b) => a - b).join(',')).sort()
}

describe('78. 子集', () => {
  test('示例 1：[1,2,3] → 8 个子集', () => {
    const res = subsets([1, 2, 3])
    expect(res).toHaveLength(8)
    expect(normalize(res)).toEqual(
      normalize([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]])
    )
  })

  test('示例 2：[0] → [[], [0]]', () => {
    expect(normalize(subsets([0]))).toEqual(normalize([[], [0]]))
  })
})
