/**
 * 217. 存在重复元素（简单）
 * 题目：problems/array/217-contains-duplicate.md
 *
 * 两种实现，按「够不够解本题」排列：
 *
 * | 实现                    | 时间       | 额外空间 | 改动入参 | 说明 |
 * | ----------------------- | ---------- | -------- | -------- | ---- |
 * | containsDuplicate       | O(n)       | O(n)     | 否       | 默认答案：Set 去重后比长度，代码最短 |
 * | containsDuplicateBySort | O(n log n) | O(1)     | 是       | 进阶：排序后比较相邻，用时间换空间 |
 *
 * 进阶解的取舍：真正的 O(1) 额外空间必须「原地」排序，代价是打乱入参顺序；
 * 若不允许改动入参，就得先复制一份，空间回到 O(n)，那还不如直接用 Set。
 * 另注：本题 |nums[i]| <= 10^9，值域过大，计数排序 / 位图这类 O(n) 的招数用不上。
 */

/** 1. Set 去重——默认答案：时间 O(n)，额外空间 O(n)
 *  利用「去重后长度变小 ⇒ 有重复」这一等价关系，交给原生实现最省事。
 */
function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length
}

/** 2. 进阶：排序 + 相邻比较——时间 O(n log n)，额外空间 O(1)
 *  重复的两个元素排序后必然相邻，所以扫一遍比相邻即可。
 *  代价：原地排序会改动入参（这正是省下 O(n) 空间的来源）。
 *
 *  若你的场景不允许改动入参，把第一行换成：
 *    const arr = nums.slice().sort((a, b) => a - b)
 *  再对 arr 比较相邻即可——但复制这一步让额外空间回到 O(n)，
 *  那就失去了本实现唯一的优势，不如直接用上面的 Set。
 *  保留原地版本，是为了让「用时间换空间」这个进阶点真正成立。
 */
function containsDuplicateBySort(nums) {
  nums.sort((a, b) => a - b)
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) return true
  }
  return false
}

module.exports = { containsDuplicate, containsDuplicateBySort }
