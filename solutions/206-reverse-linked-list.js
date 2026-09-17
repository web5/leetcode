/**
 * 206. 反转链表（简单）
 * 题目：problems/linked-list/206-reverse-linked-list.md
 * 思路（迭代）：三指针 prev / cur / next，逐个把 cur.next 指回 prev。
 * 复杂度：时间 O(n)，空间 O(1)
 */

// LeetCode 平台会注入该结构，本地为了能跑用例自带一份
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

// 迭代写法
function reverseList(head) {
  let prev = null
  let cur = head
  while (cur) {
    const next = cur.next // 先存住下一个，否则改指针后就丢了
    cur.next = prev
    prev = cur
    cur = next
  }
  return prev
}

// 进阶：递归写法
function reverseListRecursive(head) {
  if (!head || !head.next) return head
  const newHead = reverseListRecursive(head.next)
  head.next.next = head
  head.next = null
  return newHead
}

module.exports = { ListNode, reverseList, reverseListRecursive }
