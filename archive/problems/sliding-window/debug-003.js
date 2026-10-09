const { log } = require("console")

/**
 *
 * @param
 *
 * ## 题目描述

给定一个字符串 `s`，请你找出其中不含有重复字符的 **最长子串** 的长度。

## 示例

**示例 1：**
- 输入：`s = "abcabcbb"`
- 输出：`3`
- 解释：因为无重复字符的最长子串是 `"abc"`，所以其长度为 3。注意 `"bca"` 和 `"cab"` 也是正确答案。

**示例 2：**
- 输入：`s = "bbbbb"`
- 输出：`1`
- 解释：因为无重复字符的最长子串是 `"b"`，所以其长度为 1。

**示例 3：**
- 输入：`s = "pwwkew"`
- 输出：`3`
- 解释：因为无重复字符的最长子串是 `"wke"`，所以其长度为 3。请注意，你的答案必须是 **子串** 的长度，`"pwke"` 是一个子序列，不是子串。

## 提示

- `0 <= s.length <= 10^5`
- `s` 由英文字母、数字、符号和空格组成
 */
function lengthOfLongestSubstring(s) {
  const last = new Map()
  let left = 0
  let ans = 0
  for(let right = 0; right < s.length; right++) {
    const c = s[right]
    if(last.has(c) && last.get(c) >= left) {
      // 如果当前字符在窗口内，则左指针跳到上一次出现的位置 + 1
      // 如果当前字符不在窗口内，则左指针不变
      left = last.get(c) + 1
    }
    last.set(c, right)
    // log('left>>>', left)
    // log('right>>>', right)
    // log('ans>>>', right - left + 1)
    log('last>>>', last)
    ans = Math.max(ans, right - left + 1)
  }
  return ans
}

const s = 'pwwkew'
const res = lengthOfLongestSubstring(s)
console.log('res>>>', res)
