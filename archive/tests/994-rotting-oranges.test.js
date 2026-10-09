const { orangesRotting } = require('../solutions/994-rotting-oranges')

// 解法会原地修改 grid，每个用例都传新构造的数组
const g = (rows) => rows.map((row) => row.slice())

describe('994. 腐烂的橘子', () => {
  test('示例 1：4 分钟', () => {
    expect(orangesRotting(g([[2, 1, 1], [1, 1, 0], [0, 1, 1]]))).toBe(4)
  })

  test('示例 2：存在被隔离的新鲜橘子 → -1', () => {
    expect(orangesRotting(g([[2, 1, 1], [0, 1, 1], [1, 0, 1]]))).toBe(-1)
  })

  test('示例 3：没有新鲜橘子 → 0', () => {
    expect(orangesRotting(g([[0, 2]]))).toBe(0)
  })

  test('边界：全空网格 → 0', () => {
    expect(orangesRotting(g([[0, 0], [0, 0]]))).toBe(0)
  })

  test('边界：全是新鲜橘子（没有传染源）→ -1', () => {
    expect(orangesRotting(g([[1, 1], [1, 1]]))).toBe(-1)
  })

  test('边界：单格就是坏橘子 → 0', () => {
    expect(orangesRotting([[2]])).toBe(0)
  })

  test('多源同时扩散：两个源头各走一半，答案取较大者', () => {
    // 第 0 列与第 3 列是坏橘子，中间两列同时被两边扩散
    expect(orangesRotting(g([[2, 1, 1, 2]]))).toBe(1)
  })

  test('一条直线上的连锁腐烂：n 个新鲜橘子需要 n 分钟', () => {
    expect(orangesRotting(g([[2, 1, 1, 1, 1]]))).toBe(4)
  })
})
