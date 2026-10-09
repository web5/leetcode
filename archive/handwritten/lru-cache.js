/**
 * 手撕 10：LRU 缓存（哈希表 + 双向链表，两个操作都 O(1)）
 *
 * 为什么不能只用 Map：Map 的 get/put 是 O(1)，但要「淘汰最久未使用」必须知道顺序，
 * 而且被访问的 key 要挪到最新——数组挪动是 O(n)。所以用双向链表维护顺序：
 *   head 侧 = 最近使用，tail 侧 = 最久未使用（淘汰 tail.prev）
 *
 * 两个哨兵节点（head/tail）省掉所有「链路为空 / 只有一个节点」的特判——这是写干净的诀窍。
 *
 * 面试递进问法：
 *  ① 手写 LRU（本题）
 *  ② get 与 put 都必须 O(1)（所以哈希表存「key → 链表节点」而不是 key → value）
 *  ③ 如何改成 LFU（460）——再加一层「按频次分桶」的双向链表
 *  ④ 线程安全 / 分布式场景 → 追问 Redis 的近似 LRU 采样
 *
 * 复杂度：时间 get/put O(1)，空间 O(capacity)
 */

class DLinkedNode {
  constructor(key = 0, value = 0) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map() // key -> 链表节点
    this.head = new DLinkedNode() // 哨兵：head.next 是最新的
    this.tail = new DLinkedNode() // 哨兵：tail.prev 是最旧的
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  get size() {
    return this.map.size
  }

  get(key) {
    const node = this.map.get(key)
    if (!node) return -1
    this.#moveToHead(node)
    return node.value
  }

  put(key, value) {
    if (this.capacity <= 0) return // 容量为 0 时什么都不缓存（防哨兵被误删）
    const node = this.map.get(key)
    if (node) {
      node.value = value
      this.#moveToHead(node)
      return
    }

    if (this.map.size >= this.capacity) {
      const lru = this.tail.prev // 最久未使用
      this.#remove(lru)
      this.map.delete(lru.key) // 链表节点里存了 key，才能同步删哈希表
    }

    const fresh = new DLinkedNode(key, value)
    this.map.set(key, fresh)
    this.#addToHead(fresh)
  }

  #addToHead(node) {
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
  }

  #remove(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
    node.prev = null
    node.next = null
  }

  #moveToHead(node) {
    this.#remove(node)
    this.#addToHead(node)
  }
}

module.exports = { LRUCache, DLinkedNode }
