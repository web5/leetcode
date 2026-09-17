/**
 * 141. 环形链表（简单）
 * 题目：problems/linked-list/141-linked-list-cycle.md
 * 思路：Floyd 快慢指针（进阶要求的 O(1) 内存）——
 *      慢指针走一步、快指针走两步，有环必然相遇；快指针先走到 null 则无环。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function hasCycle(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}

module.exports = { hasCycle }
