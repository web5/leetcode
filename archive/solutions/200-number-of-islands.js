/**
 * 200. 岛屿数量（中等）
 * 题目：problems/graph/200-number-of-islands.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 一题三解（面试时把三者的取舍说出来就是加分项）：
 *  ① numIslands          递归 DFS 淹没法：代码最短，但递归深度 = 岛屿大小，最坏 m·n 层（9 万）有爆栈风险
 *  ② numIslandsIterative 显式栈 DFS：不受调用栈限制，写法仍简单
 *  ③ numIslandsByUnionFind 并查集：不修改入参，适合「岛屿会动态增加」的变体
 *
 * 注意：①② 会**原地修改入参 grid**（把 '1' 淹成 '0' 当 visited 用）。
 * 面试中务必主动说明这一点，并给出替代方案（另开一个 visited 布尔矩阵，空间换不可变性）。
 *
 * 复杂度：时间 O(m·n)，空间 O(m·n)（递归栈 / 并查集数组）
 */

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

// ① 递归 DFS 淹没法（会修改 grid）
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length
  const cols = grid[0].length

  const flood = (i, j) => {
    if (i < 0 || i >= rows || j < 0 || j >= cols) return
    if (grid[i][j] !== '1') return
    grid[i][j] = '0' // 进入即淹没
    for (const [di, dj] of DIRS) flood(i + di, j + dj)
  }

  let count = 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1') {
        count++
        flood(i, j)
      }
    }
  }
  return count
}

// ② 显式栈 DFS（会修改 grid，但不吃调用栈）
function numIslandsIterative(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length
  const cols = grid[0].length
  let count = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] !== '1') continue
      count++
      grid[i][j] = '0'
      const st = [[i, j]]
      while (st.length > 0) {
        const [x, y] = st.pop()
        for (const [dx, dy] of DIRS) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) continue
          if (grid[nx][ny] !== '1') continue
          grid[nx][ny] = '0'
          st.push([nx, ny])
        }
      }
    }
  }
  return count
}

// ③ 并查集版（不改入参）：只往「左、上」两个方向合并，每合并成功一次岛屿数减一
function numIslandsByUnionFind(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length
  const cols = grid[0].length
  const parent = Array.from({ length: rows * cols }, (_, i) => i)
  const size = new Array(rows * cols).fill(1)
  const id = (i, j) => i * cols + j

  const find = (x) => {
    let root = x
    while (parent[root] !== root) root = parent[root]
    while (parent[x] !== root) {
      const next = parent[x]
      parent[x] = root
      x = next
    }
    return root
  }

  const union = (a, b) => {
    const ra = find(a)
    const rb = find(b)
    if (ra === rb) return false
    if (size[ra] < size[rb]) {
      parent[ra] = rb
      size[rb] += size[ra]
    } else {
      parent[rb] = ra
      size[ra] += size[rb]
    }
    return true
  }

  let islands = 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] !== '1') continue
      islands++
      if (j > 0 && grid[i][j - 1] === '1' && union(id(i, j), id(i, j - 1))) islands--
      if (i > 0 && grid[i - 1][j] === '1' && union(id(i, j), id(i - 1, j))) islands--
    }
  }
  return islands
}

module.exports = { numIslands, numIslandsIterative, numIslandsByUnionFind }

if (require.main === module) {
  const make = () => [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ]
  console.log('res>>>', numIslands(make())) // 3
  console.log('res>>>', numIslandsIterative(make())) // 3
  console.log('res>>>', numIslandsByUnionFind(make())) // 3
}
