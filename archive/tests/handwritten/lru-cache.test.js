const { LRUCache } = require('../../handwritten/lru-cache')

describe('手撕 10 · LRU 缓存', () => {
  test('经典用例：capacity = 2', () => {
    const cache = new LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    expect(cache.get(1)).toBe(1) // 1 变成最新
    cache.put(3, 3) // 淘汰最久未使用的 2
    expect(cache.get(2)).toBe(-1)
    cache.put(4, 4) // 淘汰 1
    expect(cache.get(1)).toBe(-1)
    expect(cache.get(3)).toBe(3)
    expect(cache.get(4)).toBe(4)
  })

  test('get 会刷新最近使用顺序', () => {
    const cache = new LRUCache(2)
    cache.put(1, 'a')
    cache.put(2, 'b')
    cache.get(1) // 刷新 1
    cache.put(3, 'c') // 淘汰 2
    expect(cache.get(2)).toBe(-1)
    expect(cache.get(1)).toBe('a')
  })

  test('更新已存在的 key：改值且不增加容量', () => {
    const cache = new LRUCache(2)
    cache.put(1, 'a')
    cache.put(2, 'b')
    cache.put(1, 'a2')
    expect(cache.size).toBe(2)
    expect(cache.get(1)).toBe('a2')
  })

  test('更新已存在的 key 也会刷新为最新', () => {
    const cache = new LRUCache(2)
    cache.put(1, 'a')
    cache.put(2, 'b')
    cache.put(1, 'a2') // 1 变成最新
    cache.put(3, 'c') // 淘汰 2
    expect(cache.get(2)).toBe(-1)
    expect(cache.get(1)).toBe('a2')
  })

  test('get 不存在的 key 返回 -1，且不影响顺序', () => {
    const cache = new LRUCache(2)
    cache.put(1, 'a')
    cache.put(2, 'b')
    expect(cache.get(99)).toBe(-1)
    cache.put(3, 'c') // 仍然淘汰 1（未被访问过）
    expect(cache.get(1)).toBe(-1)
    expect(cache.get(2)).toBe('b')
  })

  test('容量为 1', () => {
    const cache = new LRUCache(1)
    cache.put(1, 'a')
    cache.put(2, 'b')
    expect(cache.get(1)).toBe(-1)
    expect(cache.get(2)).toBe('b')
    expect(cache.size).toBe(1)
  })

  test('大量 put 后容量不超标，且只剩最近 3 个', () => {
    const cache = new LRUCache(3)
    for (let i = 0; i < 100; i++) cache.put(i, i)
    expect(cache.size).toBe(3)
    expect(cache.get(99)).toBe(99)
    expect(cache.get(98)).toBe(98)
    expect(cache.get(97)).toBe(97)
    expect(cache.get(96)).toBe(-1)
  })

  test('值可以是任意类型（含对象、null、0、空字符串）', () => {
    const cache = new LRUCache(4)
    const obj = { a: 1 }
    cache.put('o', obj)
    cache.put('n', null)
    cache.put('z', 0)
    cache.put('e', '')
    expect(cache.get('o')).toBe(obj)
    expect(cache.get('n')).toBeNull()
    expect(cache.get('z')).toBe(0)
    expect(cache.get('e')).toBe('')
  })

  test('put 覆盖后淘汰顺序按「最近使用」而不是「最近写入」', () => {
    const cache = new LRUCache(3)
    cache.put(1, 1)
    cache.put(2, 2)
    cache.put(3, 3)
    cache.get(1) // 顺序：3, 2, 1 → 1 最新
    cache.put(4, 4) // 淘汰 2
    expect(cache.get(2)).toBe(-1)
    expect(cache.get(1)).toBe(1)
    expect(cache.get(3)).toBe(3)
    expect(cache.get(4)).toBe(4)
  })
})
