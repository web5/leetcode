/**
 * 手撕 10：LRU 缓存（哈希表 + 双向链表）
 * 参考实现（写完再对照）：archive/handwritten/lru-cache.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 为什么必须双向链表：____（单链表删节点要 O(n) 找前驱，双向才能 O(1)）
 * 为什么用双哨兵（虚拟头尾）：____（省掉一堆 null 边界判断）
 * 两个操作都 O(1) 的代价：____（空间翻倍，哈希 + 链表双份引用）
 * 追问：怎么改成 LFU（再加一层「频次 → 链表」的哈希）、Redis 的近似 LRU
 * ─────────────────────────────────────────────────
 */

/**
 * 作答区：LRUCache
 * get(key)：命中则返回值并把该节点标为「最近使用」；未命中返回 -1
 * put(key, value)：写入/更新；容量超出时淘汰「最久未使用」的那个
 */
class LRUCache {
  constructor(capacity) {
    throw new Error('10 LRUCache 未作答')
  }

  get(key) {
    throw new Error('10 get 未作答')
  }

  put(key, value) {
    throw new Error('10 put 未作答')
  }
}

/** 自测素材（取自 146 题的官方示例） */
const CHECKS = [
  {
    name: '基本读写：命中返回值，未命中返回 -1',
    run: async () => {
      const c = new LRUCache(2)
      c.put(1, 1)
      c.put(2, 2)
      assertEqual([c.get(1), c.get(3)], [1, -1], 'get 行为不对')
    },
  },
  {
    name: '超容量淘汰最久未使用（get 会刷新使用顺序）',
    run: async () => {
      const c = new LRUCache(2)
      c.put(1, 1)
      c.put(2, 2)
      c.get(1)      // 1 变成最近使用，2 变成最久未使用
      c.put(3, 3)   // 淘汰 2
      assertEqual([c.get(2), c.get(3), c.get(1)], [-1, 3, 1], '淘汰策略不对')
    },
  },
  {
    name: '更新已有 key：值被覆盖，且刷新为最近使用',
    run: async () => {
      const c = new LRUCache(2)
      c.put(1, 1)
      c.put(2, 2)
      c.put(1, 10)  // 1 变为最近使用，2 变成最久未使用
      c.put(3, 3)   // 淘汰 2
      assertEqual([c.get(2), c.get(1)], [-1, 10], '更新 key 后应刷新使用顺序')
    },
  },
  {
    name: '容量为 1：写新的就淘汰旧的',
    run: async () => {
      const c = new LRUCache(1)
      c.put(1, 1)
      c.put(2, 2)
      assertEqual([c.get(1), c.get(2)], [-1, 2], '容量 1 的淘汰不对')
    },
  },
]

// ── 以下不用改 ──────────────────────────────────────────
function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${label}：期望 ${e}，实际 ${a}`)
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runAll() {
  let pass = 0
  for (const one of CHECKS) {
    try {
      await one.run()
      pass += 1
      console.log(`✅ ${one.name}`)
    } catch (err) {
      console.log(`❌ ${one.name}\n   ${err.message}`)
    }
  }
  console.log(`\n${pass}/${CHECKS.length} 通过`)
  if (pass < CHECKS.length) process.exitCode = 1
}

// 直接跑：node plan/week-10/d2/10-lru-cache.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 10 LRU 缓存', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { LRUCache }
