const { numIslands, numIslandsIterative, numIslandsByUnionFind } = require('../solutions/200-number-of-islands')

// 三个实现都会读入参 grid（前两个会原地修改），所以每次调用都新建一份
const g1 = () => [
  ['1', '1', '1', '1', '0'],
  ['1', '1', '0', '1', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '0', '0', '0'],
]

const g2 = () => [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
]

const impls = [
  ['递归 DFS 淹没法', numIslands],
  ['显式栈 DFS', numIslandsIterative],
  ['并查集', numIslandsByUnionFind],
]

describe('200. 岛屿数量', () => {
  test('示例 1：整块连在一起 → 1', () => {
    expect(numIslands(g1())).toBe(1)
  })

  test('示例 2：三座岛 → 3', () => {
    expect(numIslands(g2())).toBe(3)
  })

  test('边界：全是水 → 0', () => {
    expect(numIslands([['0', '0'], ['0', '0']])).toBe(0)
  })

  test('边界：单格陆地 → 1', () => {
    expect(numIslands([['1']])).toBe(1)
  })

  test('边界：棋盘状（对角不算相连，每块陆地自成岛）', () => {
    expect(
      numIslands([
        ['1', '0', '1'],
        ['0', '1', '0'],
        ['1', '0', '1'],
      ])
    ).toBe(5)
  })

  test('一题三解结果一致', () => {
    const cases = [g1(), g2(), [['0']], [['1']], [['1', '0'], ['0', '1']], [['1', '1'], ['1', '1']]]
    for (const [name, fn] of impls) {
      for (const grid of cases) {
        const expectd = numIslandsByUnionFind(grid.map((r) => r.slice())) // 并查集不改入参，作为基准
        expect([name, fn(grid.map((r) => r.slice()))]).toEqual([name, expectd])
      }
    }
  })

  test('并查集版不改动入参', () => {
    const grid = g2()
    const snapshot = JSON.stringify(grid)
    numIslandsByUnionFind(grid)
    expect(JSON.stringify(grid)).toBe(snapshot)
  })
})
