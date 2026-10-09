const { networkDelayTime, MinHeap } = require('../solutions/743-network-delay-time')

describe('743. 网络延迟时间', () => {
  test('示例 1：4 个节点，从 2 出发 → 2', () => {
    expect(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)).toBe(2)
  })

  test('示例 2：两个节点直连 → 1', () => {
    expect(networkDelayTime([[1, 2, 1]], 2, 1)).toBe(1)
  })

  test('示例 3：从 2 出发但没有出边 → -1', () => {
    expect(networkDelayTime([[1, 2, 1]], 2, 2)).toBe(-1)
  })

  test('边界：只有一个节点 → 0（不需要传播时间）', () => {
    expect(networkDelayTime([], 1, 1)).toBe(0)
  })

  test('有向图：反向不可达 → -1', () => {
    expect(networkDelayTime([[1, 2, 1]], 2, 2)).toBe(-1)
    expect(networkDelayTime([[1, 2, 1]], 2, 1)).toBe(1)
  })

  test('贪心正确性：直达慢、绕路快时必须选绕路', () => {
    // 1→3 直达 10，但 1→2→3 只要 2；最短路上必须用 Dijkstra 而不是「先看邻边」
    expect(
      networkDelayTime(
        [
          [1, 3, 10],
          [1, 2, 1],
          [2, 3, 1],
        ],
        3,
        1
      )
    ).toBe(2)
  })

  test('边权含有 0 也要正确（Dijkstra 要求非负，0 是最小合法值）', () => {
    expect(networkDelayTime([[1, 2, 0], [2, 3, 0]], 3, 1)).toBe(0)
  })

  test('答案为最远节点的距离，而非路径上所有边之和', () => {
    // 1→2 (5)、1→3 (1)：max(dist) = 5
    expect(networkDelayTime([[1, 2, 5], [1, 3, 1]], 3, 1)).toBe(5)
  })

  describe('手写小根堆（面试常顺带考）', () => {
    test('随机数据下能按升序弹出', () => {
      const heap = new MinHeap()
      const data = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0]
      for (const v of data) heap.push(v)
      const out = []
      while (heap.size > 0) out.push(heap.pop())
      expect(out).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    test('支持自定义比较器（按二元组的第一项）', () => {
      const heap = new MinHeap((a, b) => a[0] - b[0])
      heap.push([3, 'c'])
      heap.push([1, 'a'])
      heap.push([2, 'b'])
      expect(heap.pop()).toEqual([1, 'a'])
      expect(heap.pop()).toEqual([2, 'b'])
      expect(heap.pop()).toEqual([3, 'c'])
    })

    test('重复值不丢也不多', () => {
      const heap = new MinHeap()
      for (const v of [2, 2, 1, 1, 3, 3]) heap.push(v)
      const out = []
      while (heap.size > 0) out.push(heap.pop())
      expect(out).toEqual([1, 1, 2, 2, 3, 3])
    })
  })
})
