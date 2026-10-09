/**
 * 模板 06：Dijkstra（非负权单源最短路）+ 手写二叉堆
 *
 * 什么时候用：
 *  - 带权图（边权 >= 0）求最短路：743 网络延迟时间、1631 最小体力消耗路径、787 最便宜的航班
 *  - 「代价是连续的、可累加」且要最小值 → 优先队列 BFS（Dijkstra 的本质）
 *
 * 与 BFS 的分界：边权全为 1 → BFS；边权不全相同且非负 → Dijkstra。
 * 有负权 → Bellman-Ford（787 用得上）；求全源最短路 → Floyd。
 *
 * 核心思想（一定要能口述）：
 *   把点分成「已确定」与「未确定」。每次从未确定里取 dist 最小的点，
 *   它的 dist 此刻就是最终答案（因为任何其它路径都要经过一个 dist 更大的点，非负权不可能更短），
 *   然后用它去松弛邻居。这其实就是「DP 的 DAG 值传播 + 优先队列代替拓扑序」。
 *
 * 易错点：
 *  ① JS 没有内置堆 → 必须手写（面试也常顺手考），否则复杂度退化成 O(V²)
 *  ② 堆里会有「过期条目」：弹出时 if (d > dist[u]) continue 是必写的
 *  ③ 邻接表存 [邻居, 权重]；无向图要双向加边
 *
 * 复杂度：时间 O((V + E) log V)，空间 O(V + E)
 */

class MinHeap {
  // compare(a, b) < 0 表示 a 应排在前面；默认最小堆
  constructor(compare = (a, b) => a - b) {
    this.heap = []
    this.compare = compare
  }

  get size() {
    return this.heap.length
  }

  peek() {
    return this.heap[0]
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

// 返回 dist 数组（下标 0..n-1，不可达为 Infinity）
function dijkstra(n, edges, start) {
  const graph = Array.from({ length: n }, () => [])
  for (const [u, v, w] of edges) {
    graph[u].push([v, w])
    graph[v].push([u, w]) // 有向图删掉这一行
  }

  const dist = new Array(n).fill(Infinity)
  dist[start] = 0
  const heap = new MinHeap((a, b) => a[0] - b[0]) // 存 [距离, 节点]
  heap.push([0, start])

  while (heap.size > 0) {
    const [d, u] = heap.pop()
    if (d > dist[u]) continue // 过期条目：已经有更短的路径确定了
    for (const [v, w] of graph[u]) {
      const nd = d + w
      if (nd < dist[v]) {
        dist[v] = nd
        heap.push([nd, v])
      }
    }
  }
  return dist
}

module.exports = { MinHeap, dijkstra }

// 验证题：problems/graph/743-network-delay-time.md
// 变体题：1631 最小体力消耗路径（可二分答案）、787 K 站中转内最便宜的航班（Bellman-Ford）
