/**
 * 模板 04：DFS（网格连通块 / 图遍历 / 二分图染色）
 *
 * 什么时候用：
 *  - 求「连通块个数 / 最大面积」→ 网格 DFS 淹没法
 *  - 判断环、走遍所有路径、拓扑排序（后序反转）
 *  - 二分图判定（相邻染异色，冲突即非二分图）
 *
 * 与 BFS 的分界：只问「连不连通、有没有环」用 DFS（写法短）；问「最少几步」用 BFS。
 *
 * 网格 DFS 的三件套（缺一就会死循环或爆栈）：
 *  ① 越界 / 障碍判断在**递归入口**做
 *  ② 访问标记用「原地修改」（如 '1' → '0' / 染色），省一个 visited 数组
 *  ③ 递归深度 = 连通块大小，m·n 很大时改写成显式栈的迭代版（或并查集）
 *
 * 复杂度：时间 O(V + E)（网格 O(m·n)），空间 O(V)（递归栈）
 */

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

// A. 网格连通块计数（淹没法：访问过的 '1' 改成 '0'）
function countIslands(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length
  const cols = grid[0].length
  let count = 0

  const flood = (i, j) => {
    if (i < 0 || i >= rows || j < 0 || j >= cols) return
    if (grid[i][j] !== '1') return // 水 / 已访问
    grid[i][j] = '0' // 标记：进入即淹没
    for (const [di, dj] of DIRS) flood(i + di, j + dj)
  }

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

// B. 图 DFS 迭代版（邻接表；显式栈避免爆栈；标记在入栈时做）
function dfsIterative(n, edges, start) {
  const graph = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) {
    graph[u].push(v)
    graph[v].push(u) // 有向图删掉这一行
  }

  const order = []
  const visited = new Array(n).fill(false)
  const st = [start]
  visited[start] = true

  while (st.length) {
    const u = st.pop()
    order.push(u)
    for (const v of graph[u]) {
      if (visited[v]) continue
      visited[v] = true
      st.push(v)
    }
  }
  return order
}

// C. 二分图判定（染色：0 未染，1 / -1 两色；冲突返回 false）
function isBipartite(n, edges) {
  const graph = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) {
    graph[u].push(v)
    graph[v].push(u)
  }

  const color = new Array(n).fill(0)

  const paint = (u, c) => {
    color[u] = c
    for (const v of graph[u]) {
      if (color[v] === c) return false // 同色相邻 → 冲突
      if (color[v] === 0 && !paint(v, -c)) return false
    }
    return true
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === 0 && !paint(i, 1)) return false // 图可能不连通，每个分量都要染
  }
  return true
}

module.exports = { DIRS, countIslands, dfsIterative, isBipartite }
