/**
 * 933. 最近的请求次数（简单）
 * 题目：problems/queue/933-number-of-recent-calls.md
 * 思路：队列 + 下标指针（不做真删除，避免 shift 的 O(n)）。
 *      因为 t 严格递增，队首过期就右移 head，队列长度 - head 即答案。
 * 复杂度：均摊时间 O(1)，空间 O(n)
 */
class RecentCounter {
  constructor() {
    this.queue = []
    this.head = 0
  }

  ping(t) {
    this.queue.push(t)
    while (this.queue[this.head] < t - 3000) this.head++
    return this.queue.length - this.head
  }
}

module.exports = { RecentCounter }
