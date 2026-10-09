/**
 * 547. 省份数量（中等）
 * 题目：problems/graph/547-number-of-provinces.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 一题三解：
 *  ① findCircleNum     并查集：代码最短，count 初值 n，每成功合并一次减一
 *  ② findCircleNumDfs  邻接矩阵上直接 DFS：不需要转邻接表，靠 isConnected[i][j] 判断
 *  ③ findCircleNumBfs  BFS：同 ②，队列替代递归栈
 *
 * 三者复杂度都是 O(n²)（邻接矩阵本身就有 n² 个格子，读入即 O(n²) 下限）。
 *
 * 关键点：union 返回「本次是否真的合并了两个不同集合」，有了它，连通分量计数
 * 只需一行 count--；否则每一步都要先 find 比较再合并，容易写重。
 *
 * 复杂度：时间 O(n²)，空间 O(n)
 */

function findCircleNum(isConnected) {
  const n = isConnected.length
  const parent = Array.from({ length: n }, (_, i) => i)
  const size = new Array(n).fill(1)
  let count = n // 初始每人一个省份

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

  for (let i = 0; i < n; i++) {
    // j 从 i + 1 开始：矩阵对称，且 i === j 必然为 1（不算自环）
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1 && union(i, j)) count--
    }
  }
  return count
}

// ② 邻接矩阵上直接 DFS（图可能不连通，每个未访问点都要起一次）
function findCircleNumDfs(isConnected) {
  const n = isConnected.length
  const visited = new Array(n).fill(false)

  const dfs = (i) => {
    visited[i] = true
    for (let j = 0; j < n; j++) {
      if (isConnected[i][j] === 1 && !visited[j]) dfs(j)
    }
  }

  let count = 0
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      count++
      dfs(i)
    }
  }
  return count
}

// ③ BFS 版
function findCircleNumBfs(isConnected) {
  const n = isConnected.length
  const visited = new Array(n).fill(false)
  let count = 0

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue
    count++
    visited[i] = true
    const queue = [i]
    let head = 0
    while (head < queue.length) {
      const cur = queue[head++]
      for (let j = 0; j < n; j++) {
        if (isConnected[cur][j] === 1 && !visited[j]) {
          visited[j] = true
          queue.push(j)
        }
      }
    }
  }
  return count
}

module.exports = { findCircleNum, findCircleNumDfs, findCircleNumBfs }

if (require.main === module) {
  const g1 = [[1, 1, 0], [1, 1, 0], [0, 0, 1]]
  console.log('res>>>', findCircleNum(g1), findCircleNumDfs(g1), findCircleNumBfs(g1)) // 2 2 2
  const g2 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  console.log('res>>>', findCircleNum(g2), findCircleNumDfs(g2), findCircleNumBfs(g2)) // 3 3 3
}
