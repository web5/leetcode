/**
 * 1. 两数之和（简单）
 * 题目：problems/array/001-two-sum.md
 * 思路：哈希表一次遍历——先查表中有没有 target - nums[i]，没有再把当前值存进去。
 *      边查边存保证不会把自己用两次。
 * 复杂度：时间 O(n)，空间 O(n)
 */
function twoSum(nums, target) {
  const seen = new Map() // 值 -> 下标
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i)
  }
  return []
}

module.exports = { twoSum }
