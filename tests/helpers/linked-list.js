const { ListNode } = require('../../solutions/206-reverse-linked-list')

// 数组 -> 链表，方便用 LeetCode 的 [1,2,3] 形式构造输入
function arrayToList(arr) {
  const dummy = new ListNode(0)
  let cur = dummy
  for (const v of arr) {
    cur.next = new ListNode(v)
    cur = cur.next
  }
  return dummy.next
}

// 链表 -> 数组，方便断言
function listToArray(head) {
  const out = []
  while (head) {
    out.push(head.val)
    head = head.next
  }
  return out
}

// 构造带环链表：tail 的 next 指向下标 pos 的节点（pos = -1 表示无环）
function arrayToListWithCycle(arr, pos) {
  const head = arrayToList(arr)
  if (pos < 0 || !head) return head
  let tail = head
  while (tail.next) tail = tail.next
  let target = head
  for (let i = 0; i < pos; i++) target = target.next
  tail.next = target
  return head
}

module.exports = { arrayToList, listToArray, arrayToListWithCycle }
