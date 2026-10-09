/**
 * 994. 腐烂的橘子（中等）
 * 题目：problems/graph/994-rotting-oranges.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：多源 BFS（所有腐烂橘子同时开始扩散），层数 = 分钟数。
 *  ① 初始化：把所有 2 入队，同时统计新鲜橘子数 fresh
 *  ② 按层扩散：每轮先记 size = 当前层节点数，处理完这一层才 minutes++
 *     只有「队列里还有下一层」时才计时，所以示例 3（无新鲜橘子）返回 0
 *  ③ 原地把新鲜橘子改成 2（既表示腐烂，也当 visited 用），fresh 减到 0 才返回 minutes
 *
 * 易错点：
 *  - 入队时就标记 visited（写成网格原地修改），不要等出队，否则同层重复入队
 *  - 队列用数组 + head 指针，不要 shift（O(n) 搬移会退化成 O((mn)²)）
 *
 * 复杂度：时间 O(m·n)（每个格子最多入队一次），空间 O(m·n)
 */

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

function orangesRotting(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const queue = []
  let fresh = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 2) queue.push([i, j])
      else if (grid[i][j] === 1) fresh++
    }
  }

  if (fresh === 0) return 0 // 本来就全是坏的或空的

  let head = 0
  let minutes = 0

  while (head < queue.length) {
    const size = queue.length - head // 本层节点数：一次只处理一层
    for (let k = 0; k < size; k++) {
      const [i, j] = queue[head++]
      for (const [di, dj] of DIRS) {
        const ni = i + di
        const nj = j + dj
        if (ni < 0 || ni >= rows || nj < 0 || nj >= cols) continue
        if (grid[ni][nj] !== 1) continue // 空 / 已腐烂
        grid[ni][nj] = 2 // 入队即标记
        fresh--
        queue.push([ni, nj])
      }
    }
    if (head < queue.length) minutes++ // 产生了新的一层，才多花一分钟
  }

  return fresh === 0 ? minutes : -1 // 还有新鲜橘子 → 被隔离，永远烂不了
}

module.exports = { orangesRotting }

if (require.main === module) {
  console.log('res>>>', orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])) // 4
  console.log('res>>>', orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])) // -1
  console.log('res>>>', orangesRotting([[0, 2]])) // 0
}
