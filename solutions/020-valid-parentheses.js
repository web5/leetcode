/**
 * 20. 有效的括号（简单）
 * 题目：problems/stack/020-valid-parentheses.md
 * 思路：遇左括号入栈，遇右括号看栈顶是否是对应左括号；最后栈必须为空。
 * 复杂度：时间 O(n)，空间 O(n)
 */
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const c of s) {
    if (c in pairs) {
      if (stack.pop() !== pairs[c]) return false
    } else {
      stack.push(c)
    }
  }
  return stack.length === 0
}

module.exports = { isValid }
