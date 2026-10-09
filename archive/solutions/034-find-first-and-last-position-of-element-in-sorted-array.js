/**
 * 34. 在排序数组中查找元素的第一个和最后一个位置（中等）
 * 题目：problems/binary-search/034-find-first-and-last-position-of-element-in-sorted-array.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：一次二分只能定位「某个」目标，定位「边界」要两个变体：
 *  ① lowerBound：第一个 >= target 的下标 → 就是目标区间的左端点
 *  ② upperBound：第一个 >  target 的下标 → 减一就是右端点
 * 两者代码只差一个比较符（< vs <=），都用左闭右开区间 [l, r)，循环条件 l < r。
 *
 * 暴力对照：线性扫描 O(n) 就能拿下，但题目要求 O(log n)，这正是「二分找边界」的考试意义。
 *
 * 复杂度：时间 O(log n)，空间 O(1)
 */

// 第一个 >= target 的下标（全部小于 target 时返回 nums.length）
function lowerBound(nums, target) {
  let l = 0
  let r = nums.length // [l, r)
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (nums[mid] < target) l = mid + 1 // mid 一定不是答案
    else r = mid // mid 可能是答案，保留在区间内
  }
  return l
}

// 第一个 > target 的下标
function upperBound(nums, target) {
  let l = 0
  let r = nums.length
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (nums[mid] <= target) l = mid + 1
    else r = mid
  }
  return l
}

function searchRange(nums, target) {
  const left = lowerBound(nums, target)
  // 左端点越界，或该位置不是 target → 整个目标不存在
  if (left === nums.length || nums[left] !== target) return [-1, -1]
  return [left, upperBound(nums, target) - 1]
}

module.exports = { searchRange, lowerBound, upperBound }

if (require.main === module) {
  console.log('res>>>', searchRange([5, 7, 7, 8, 8, 10], 8)) // [3, 4]
  console.log('res>>>', searchRange([5, 7, 7, 8, 8, 10], 6)) // [-1, -1]
  console.log('res>>>', searchRange([], 0)) // [-1, -1]
}
