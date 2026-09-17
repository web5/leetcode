/**
 * 912. 排序数组（中等）
 * 题目：problems/sorting/912-sort-an-array.md
 * 思路：归并排序（分治），不调用内置 sort。
 *      递归切成两半分别排好，再用双指针合并两个有序段。
 * 复杂度：时间 O(n log n)，空间 O(n)
 */
function sortArray(nums) {
  const n = nums.length
  if (n < 2) return nums
  const mid = Math.floor(n / 2)
  const left = sortArray(nums.slice(0, mid))
  const right = sortArray(nums.slice(mid))
  return merge(left, right)
}

function merge(left, right) {
  const merged = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++])
    else merged.push(right[j++])
  }
  while (i < left.length) merged.push(left[i++])
  while (j < right.length) merged.push(right[j++])
  return merged
}

module.exports = { sortArray }
