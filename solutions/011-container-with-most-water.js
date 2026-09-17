/**
 * 11. 盛最多水的容器（中等）
 * 题目：problems/two-pointers/011-container-with-most-water.md
 * 思路：左右双指针夹逼，每次移动「较短的那一侧」——
 *      移动长边宽度只会变小、高度也不会更高，面积必然不增，所以移动短边才可能变大。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function maxArea(height) {
  let left = 0
  let right = height.length - 1
  let ans = 0
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left)
    ans = Math.max(ans, area)
    if (height[left] < height[right]) left++
    else right++
  }
  return ans
}

module.exports = { maxArea }
