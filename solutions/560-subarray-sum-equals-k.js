/**
 * 560. 和为 K 的子数组（中等）
 * 题目：problems/prefix-sum/560-subarray-sum-equals-k.md
 * 思路：前缀和 + 哈希表计数。
 *      遍历到 i 时前缀和为 sum，若之前出现过 sum - k 共 c 次，就有 c 个子数组和为 k。
 *      初始化 { 0: 1 } 才能统计「从第 0 个元素开始」的子数组。
 * 复杂度：时间 O(n)，空间 O(n)
 */
function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]])
  let sum = 0
  let ans = 0
  for (const n of nums) {
    sum += n
    ans += prefixCount.get(sum - k) || 0
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1)
  }
  return ans
}

module.exports = { subarraySum }
