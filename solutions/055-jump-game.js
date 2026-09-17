/**
 * 55. 跳跃游戏（中等）
 * 题目：problems/greedy/055-jump-game.md
 * 思路：贪心维护「能到达的最远下标」maxReach。
 *      从左往右扫，一旦当前下标 i > maxReach 说明卡住、到不了这里，直接 false；
 *      否则用 i + nums[i] 更新 maxReach。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function canJump(nums) {
  let maxReach = 0
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false
    maxReach = Math.max(maxReach, i + nums[i])
    if (maxReach >= nums.length - 1) return true
  }
  return true
}

module.exports = { canJump }
