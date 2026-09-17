/**
 * 217. 存在重复元素（简单）
 * 题目：problems/array/217-contains-duplicate.md
 * 思路：Set 去重后长度变小，说明有重复。
 * 复杂度：时间 O(n)，空间 O(n)
 */
function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length
}

module.exports = { containsDuplicate }
