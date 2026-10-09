/**
 * 743. 网络延迟时间（中等）
 * 题目：problems/graph/743-network-delay-time.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：Dijkstra（非负权单源最短路），答案 = max(dist)，有不可达点则 -1。
 *  ① 建图：节点编号 1..n，所以数组开 n + 1；本题是**有向图**，只加单向边
 *  ② 小根堆里存 [距离, 节点]，弹出时若 d > dist[u] 说明是过期条目，跳过
 *  ③ 结果：扫描 dist[1..n]，出现 Infinity 返回 -1，否则返回最大值
 *
 * 为什么不能用于负权（面试高频追问）：
 *  算法依赖「堆顶弹出时该点距离已最终确定」——负权边可能在之后把已确定的点改小，
 *  这个前提被破坏。有负权要用 Bellman-Ford（见 787 K 站中转内最便宜的航班）。
 *
 * 堆的实现：完整带注释版见 templates/06-dijkstra.js，这里内联精简版保持解法自包含。
 *
 * 复杂度：时间 O((V + E) log V)，空间 O(V + E)
 */

class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.heap = []
    this.compare = compare
  }

  get size() {
    return this.heap.length
  }

  push(value) {
    this.heap.push(value)
    this.up(this.heap.length - 1)
  }

  pop() {
    const top = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this.down(0)
    }
    return top
  }

  up(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.compare(this.heap[i], this.heap[parent]) >= 0) break
      ;[this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]]
      i = parent
    }
  }

  down(i) {
    const n = this.heap.length
    for (;;) {
      let smallest = i
      const l = 2 * i + 1
      const r = 2 * i + 2
      if (l < n && this.compare(this.heap[l], this.heap[smallest]) < 0) smallest = l
      if (r < n && this.compare(this.heap[r], this.heap[smallest]) < 0) smallest = r
      if (smallest === i) break
      ;[this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]]
      i = smallest
    }
  }
}

function networkDelayTime(times, n, k) {
  const graph = Array.from({ length: n + 1 }, () => []) // 下标 1..n
  for (const [u, v, w] of times) {
    graph[u].push([v, w]) // 有向图：只加单向边
  }

  const dist = new Array(n + 1).fill(Infinity)
  dist[k] = 0
  const heap = new MinHeap((a, b) => a[0] - b[0])
  heap.push([0, k])

  while (heap.size > 0) {
    const [d, u] = heap.pop()
    if (d > dist[u]) continue // 过期条目
    for (const [v, w] of graph[u]) {
      const nd = d + w
      if (nd < dist[v]) {
        dist[v] = nd
        heap.push([nd, v])
      }
    }
  }

  let answer = 0
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1 // 有节点收不到信号
    answer = Math.max(answer, dist[i])
  }
  return answer
}

module.exports = { networkDelayTime, MinHeap }

if (require.main === module) {
  console.log('res>>>', networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)) // 2
  console.log('res>>>', networkDelayTime([[1, 2, 1]], 2, 1)) // 1
  console.log('res>>>', networkDelayTime([[1, 2, 1]], 2, 2)) // -1
}
