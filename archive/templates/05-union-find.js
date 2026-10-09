/**
 * 模板 05：并查集 Union-Find（连通性 / 环检测 / 等价类合并）
 *
 * 什么时候用：
 *  - 「无向图」「合并两个集合」「判断两点是否连通」「有多少个连通分量」
 *  - 动态加边（BFS/DFS 只能处理静态图，加边后要重跑）
 *  - 184 冗余连接（加边成环）、721 账户合并、947 移除最多的同行或同列石头
 *
 * 两个优化（缺一个就会退化到 O(n)）：
 *  ① 路径压缩 path compression：find 时把沿途节点直接挂到根上
 *  ② 按大小/秩合并 union by size：小树挂到大树下面
 *  两者齐上 → 均摊 O(α(n)) ≈ O(1)
 *
 * 易错点：
 *  ① find 用 while 迭代而非递归（防爆栈）
 *  ② union 返回 boolean（是否真的合并了）——判环全靠这个返回值
 *  ③ count 只在真正合并时减一
 *
 * 复杂度：构建 O(n)，每次 find/union 均摊 O(α(n))，空间 O(n)
 */

class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i) // 每个元素自成一类
    this.size = new Array(n).fill(1)
    this.count = n // 连通分量个数
  }

  find(x) {
    let root = x
    while (this.parent[root] !== root) root = this.parent[root]
    // 路径压缩：把沿途节点直接挂到根上
    while (this.parent[x] !== root) {
      const next = this.parent[x]
      this.parent[x] = root
      x = next
    }
    return root
  }

  // 返回 true 表示两个原本不同的集合被合并；false 表示本来就同源（= 这条边构成环）
  union(a, b) {
    const ra = this.find(a)
    const rb = this.find(b)
    if (ra === rb) return false
    // 按大小合并：小的挂到大的下面，保证树高 O(log n)
    if (this.size[ra] < this.size[rb]) {
      this.parent[ra] = rb
      this.size[rb] += this.size[ra]
    } else {
      this.parent[rb] = ra
      this.size[ra] += this.size[rb]
    }
    this.count--
    return true
  }

  connected(a, b) {
    return this.find(a) === this.find(b)
  }
}

// 网格版并查集：把二维下标映射成一维 id（i * cols + j）
function islandsByUnionFind(grid) {
  const rows = grid.length
  if (!rows) return 0
  const cols = grid[0].length
  const uf = new UnionFind(rows * cols)
  let islands = 0

  const id = (i, j) => i * cols + j

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] !== '1') continue
      islands++
      // 只看「左、上」两个方向，避免重复合并
      if (j > 0 && grid[i][j - 1] === '1' && uf.union(id(i, j), id(i, j - 1))) islands--
      if (i > 0 && grid[i - 1][j] === '1' && uf.union(id(i, j), id(i - 1, j))) islands--
    }
  }
  return islands
}

module.exports = { UnionFind, islandsByUnionFind }

// 验证题：problems/graph/547-number-of-provinces.md
// 变体题：684 冗余连接、721 账户合并、947 移除最多的同行或同列石头
