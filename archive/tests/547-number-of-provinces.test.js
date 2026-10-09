const { findCircleNum, findCircleNumDfs, findCircleNumBfs } = require('../solutions/547-number-of-provinces')

const impls = [
  ['并查集', findCircleNum],
  ['DFS', findCircleNumDfs],
  ['BFS', findCircleNumBfs],
]

describe('547. 省份数量', () => {
  test('示例 1：[[1,1,0],[1,1,0],[0,0,1]] → 2', () => {
    expect(findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]])).toBe(2)
  })

  test('示例 2：互不相连 → 3', () => {
    expect(findCircleNum([[1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(3)
  })

  test('边界：单城市 → 1', () => {
    expect(findCircleNum([[1]])).toBe(1)
  })

  test('边界：全连通 → 1', () => {
    expect(findCircleNum([[1, 1, 1], [1, 1, 1], [1, 1, 1]])).toBe(1)
  })

  test('链式间接相连：0-1-2 → 1', () => {
    expect(
      findCircleNum([
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
      ])
    ).toBe(1)
  })

  test('一题三解结果一致', () => {
    const cases = [
      [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      [[1]],
      [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
      [[1, 1, 0], [1, 1, 1], [0, 1, 1]],
      [[1, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 1]],
    ]
    for (const [name, fn] of impls) {
      for (const grid of cases) {
        expect([name, fn(grid)]).toEqual([name, findCircleNum(grid)])
      }
    }
  })
})
