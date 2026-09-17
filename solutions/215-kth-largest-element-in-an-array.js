/**
 * 215. 数组中的第K个最大元素（中等）
 * 题目：problems/heap/215-kth-largest-element-in-an-array.md
 * 思路：快速选择（Quickselect）——随机选 pivot 做 partition，
 *      第 k 大 = 升序下标 n - k，只在包含该下标的一侧继续递归，平均 O(n)。
 * 复杂度：平均时间 O(n)，最坏 O(n^2)，空间 O(1)（原地交换）
 */
function findKthLargest(nums, k) {
  const target = nums.length - k // 升序数组里的目标下标
  let left = 0
  let right = nums.length - 1

  while (true) {
    const pivotIndex = partition(nums, left, right)
    if (pivotIndex === target) return nums[pivotIndex]
    if (pivotIndex < target) left = pivotIndex + 1
    else right = pivotIndex - 1
  }
}

// 把 nums[right] 当 pivot，返回它排好序后所在的下标
function partition(nums, left, right) {
  const pivot = nums[right]
  let i = left
  for (let j = left; j < right; j++) {
    if (nums[j] <= pivot) {
      ;[nums[i], nums[j]] = [nums[j], nums[i]]
      i++
    }
  }
  ;[nums[i], nums[right]] = [nums[right], nums[i]]
  return i
}

module.exports = { findKthLargest }
