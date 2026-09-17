/**
 * 9. 回文数（简单）
 * 题目：problems/math/009-palindrome-number.md
 * 思路（进阶要求：不转字符串）：只反转后一半数字，避免整体反转溢出。
 *      负数、以及「末位为 0 且不为 0 本身」的数直接 false。
 *      偶位数：x === reverted；奇位数：x === Math.floor(reverted / 10)（去掉中间那位）。
 * 复杂度：时间 O(log n)，空间 O(1)
 */
function isPalindromeNumber(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false

  let reverted = 0
  while (x > reverted) {
    reverted = reverted * 10 + (x % 10)
    x = Math.floor(x / 10)
  }
  return x === reverted || x === Math.floor(reverted / 10)
}

module.exports = { isPalindromeNumber }
