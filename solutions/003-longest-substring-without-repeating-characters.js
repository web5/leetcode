/**
 * 3. 无重复字符的最长子串（中等）
 * 题目：problems/sliding-window/003-longest-substring-without-repeating-characters.md
 * 思路：滑动窗口 + 记录每个字符最后出现的位置。
 *      右指针不断扩张，遇到窗口内已出现的字符就把左指针跳到它上一次位置 + 1。
 * 复杂度：时间 O(n)，空间 O(n)
 */
function lengthOfLongestSubstring(s) {
  const last = new Map() // 字符 -> 最后一次出现的下标
  let left = 0
  let ans = 0
  for (let right = 0; right < s.length; right++) {
    const c = s[right]
    // 只有重复字符落在当前窗口内才需要收缩
    if (last.has(c) && last.get(c) >= left) {
      left = last.get(c) + 1
    }
    last.set(c, right)
    ans = Math.max(ans, right - left + 1)
  }
  return ans
}

module.exports = { lengthOfLongestSubstring }
