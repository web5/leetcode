/**
 * 136. 只出现一次的数字（简单）
 * 题目：problems/bit-manipulation/136-single-number.md
 * 思路：异或的性质——a ^ a = 0，a ^ 0 = a，且满足交换律/结合律。
 *      全部元素异或一遍，成对的相互抵消，剩下的就是只出现一次的那个。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function singleNumber(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0)
}

module.exports = { singleNumber }
