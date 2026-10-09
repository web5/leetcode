/**
 * 148. 排序链表（中等） · https://leetcode.cn/problems/sort-list/
 * 题干：plan/problems/linked-list/148-sort-list.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（节点值倒进数组 sort 再写回，O(n log n) 但 O(n) 空间）
 * 观察到的性质：____（链表上「合并两个有序链表」是 O(1) 空间 O(n) 时间）
 * 否掉：____（为什么不用快排：链表不能随机访问）
 * 最优：____（自顶向下归并：快慢指针找中点 + 断开 + 递归合并）
 * 进阶：____（自底向上迭代归并 → 常数空间）
 * 易错：____（找中点后必须 mid.next = null，否则死循环）
 * ─────────────────────────────────────────────────
 */

/** 本地节点定义（LeetCode 会注入，这里自带一份，文件自包含） */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

function arrayToList(arr) {
  const dummy = new ListNode(0)
  let cur = dummy
  for (const v of arr) {
    cur.next = new ListNode(v)
    cur = cur.next
  }
  return dummy.next
}

function listToArray(head) {
  const out = []
  while (head) {
    out.push(head.val)
    head = head.next
  }
  return out
}

/** 作答区：返回排序后的头节点 */
function sortList(head) {
  throw new Error('148 未作答')
}

/** 测试素材：输入输出都写成数组，run 内部做链表转换 */
const CASES = [
  { name: '示例 1', run: (fn) => listToArray(fn(arrayToList([4, 2, 1, 3]))), expected: [1, 2, 3, 4] },
  { name: '示例 2', run: (fn) => listToArray(fn(arrayToList([-1, 5, 3, 4, 0]))), expected: [-1, 0, 3, 4, 5] },
  { name: '示例 3 空链表', run: (fn) => listToArray(fn(arrayToList([]))), expected: [] },
  { name: '单节点', run: (fn) => listToArray(fn(arrayToList([1]))), expected: [1] },
  { name: '重复值', run: (fn) => listToArray(fn(arrayToList([2, 2, 2]))), expected: [2, 2, 2] },
  { name: '完全逆序', run: (fn) => listToArray(fn(arrayToList([5, 4, 3, 2, 1]))), expected: [1, 2, 3, 4, 5] },
  { name: '已有序', run: (fn) => listToArray(fn(arrayToList([1, 2, 3, 4]))), expected: [1, 2, 3, 4] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(sortList) : sortList(...one.args))
}
function expectedOf(one) {
  return (one.norm || ((v) => v))(one.expected)
}

if (require.main === module) {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (JSON.stringify(actual) === JSON.stringify(expectedOf(one))) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}\n   期望 ${JSON.stringify(one.expected)}\n   实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

if (typeof describe === 'function') {
  describe('148. 排序链表', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { sortList, CASES, ListNode, arrayToList, listToArray }
