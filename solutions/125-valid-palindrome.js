/**
 * 125. 验证回文串（简单）
 * 题目：problems/two-pointers/125-valid-palindrome.md
 * 思路：左右双指针，跳过非字母数字字符，比较时统一转小写。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function isAlnum(c) {
  return /[a-zA-Z0-9]/.test(c)
}

function isPalindrome(s) {
  let left = 0
  let right = s.length - 1
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++
    while (left < right && !isAlnum(s[right])) right--
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false
    left++
    right--
  }
  return true
}

module.exports = { isPalindrome }
