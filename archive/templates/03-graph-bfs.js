/**
 * 模板 03：BFS（无权图最短路 / 多源 BFS / 网格层序）
 *
 * 什么时候用：
 *  - 无权图求「最少步数 / 最短路径」→ BFS（DFS 求不了最短路）
 *  - 「同时从多个起点扩散」→ 多源 BFS（初始把**所有源点**一起入队）
 *  - 需要「按层处理」（第几层 = 距离几）→ 层序 BFS（记录 size）
 *
 * 与 DFS 的分界：BFS 保证第一次到达某点就是最短；DFS 只保证走遍。
 *
 * 三种写法：
 *  A. 邻接表单源最短路
 *  B. 网格多源 BFS（994 腐烂的橘子：初始把全部烂橘子入队，层数 = 分钟数）
 *  C. 按层分组（102 层序遍历的通用形态）
 *
 * 易错点：
 *  ① 出队时机 = 入队即标记 visited（不要等出队才标记，否则同一层会重复入队爆内存）
 *  ② 多源 BFS 的层数从 0 开始计，返回时注意是否要减 1 / 是否要处理「永远到不了」
 *  ③ 队列用「数组 + head 指针」，不要 shift（O(n) 搬移）
 *
 * 复杂度：时间 O(V + E)（网格 O(m·n)），空间 O(V)
 */

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

// A. 邻接表单源最短路（返回 dist 数组，不可达为 -1）
function bfsShortestPath(n, edges, start) {
  const graph = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) {
    graph[u].push(v)
    graph[v].push(u) // 有向图删掉这一行
  }

  const dist = new Array(n).fill(-1)
  const q = [start]
  let head = 0
  dist[start] = 0

  while (head < q.length) {
    const u = q[head++]
    for (const v of graph[u]) {
      if (dist[v] !== -1) continue // 入队前判重
      dist[v] = dist[u] + 1
      q.push(v)
    }
  }
  return dist
}

// B. 网格多源 BFS：返回「所有点被扩散到的最少轮数」，到不了的点存在时返回 -1
function multiSourceBfs(grid, sources) {
  const rows = grid.length
  const cols = grid[0].length
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const q = []

  for (const [i, j] of sources) {
    visited[i][j] = true
    q.push([i, j])
  }

  let head = 0
  let minutes = 0
  while (head < q.length) {
    const size = q.length - head // 本层节点数：一次处理完一层，层数才等于距离
    for (let k = 0; k < size; k++) {
      const [i, j] = q[head++]
      for (const [di, dj] of DIRS) {
        const ni = i + di
        const nj = j + dj
        if (ni < 0 || ni >= rows || nj < 0 || nj >= cols) continue
        if (visited[ni][nj] || grid[ni][nj] === 0) continue // 障碍 / 已访问
        visited[ni][nj] = true
        q.push([ni, nj])
      }
    }
    if (head < q.length) minutes++ // 还有下一层才计时
  }
  return minutes
}

// C. 按层分组：入参是「取邻接点的函数」，避免模板绑定具体结构
function bfsByLevel(start, neighbors) {
  const levels = []
  const visited = new Set([key(start)])
  let frontier = [start]

  while (frontier.length) {
    levels.push(frontier.map((x) => x))
    const next = []
    for (const node of frontier) {
      for (const nb of neighbors(node)) {
        const k = key(nb)
        if (visited.has(k)) continue
        visited.add(k)
        next.push(nb)
      }
    }
    frontier = next
  }
  return levels

  function key(x) {
    return Array.isArray(x) ? x.join(',') : String(x)
  }
}

module.exports = { DIRS, bfsShortestPath, multiSourceBfs, bfsByLevel }
