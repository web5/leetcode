/**
 * 704. 二分查找（简单）
 * 题目：problems/binary-search/704-binary-search.md
 * 思路：闭区间 [left, right] 写法，循环条件 left <= right，
 *      mid 偏小时 left = mid + 1，偏大时 right = mid - 1（±1 不能省，否则死循环）。
 * 复杂度：时间 O(log n)，空间 O(1)
 */
function search(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2) // 防溢出写法
    if (nums[mid] === target) return mid
    if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}

module.exports = { search }
