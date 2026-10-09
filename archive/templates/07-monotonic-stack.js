/**
 * 模板 07：单调栈（下一个更大 / 更小元素，含环形与贡献法）
 *
 * 什么时候用：题目问「每个元素左边/右边第一个比它大（小）的元素」，
 * 或能用这个思路消掉 O(n²)（柱状图最大矩形、接雨水、每日温度、去除重复字母）。
 *
 * 核心思想：
 *   栈里只保留「还没找到答案、且对后续仍有价值」的下标，让栈内对应的值单调。
 *   新元素入栈前，先把所有「被它压制」的元素弹出去 —— 弹出去的那一刻，答案就确定了。
 *
 * 记忆要点：
 *  ① 栈存**下标**不存值（要写答案位置、算宽度）
 *  ② 求「下一个更大」→ 栈内递减，遇大则弹；求「下一个更小」→ 栈内递增，遇小则弹
 *  ③ 弹栈时机的比较符用 < 还是 <= 决定「严格/非严格」，重复值题目要留意
 *  ④ 环形数组：遍历 2n 次，用 i % n 取值，只在 i < n 时入栈
 *
 * 复杂度：时间 O(n)（每个下标进出栈各一次），空间 O(n)
 */

// A. 下一个更大元素（严格大于；不存在则 -1）
function nextGreater(nums) {
  const n = nums.length
  const res = new Array(n).fill(-1)
  const st = [] // 存下标，对应 nums 的值单调递减

  for (let i = 0; i < n; i++) {
    while (st.length > 0 && nums[st[st.length - 1]] < nums[i]) {
      res[st.pop()] = nums[i] // 弹出的这一刻答案确定
    }
    st.push(i)
  }
  return res
}

// B. 下一个更小元素（严格小于）
function nextSmaller(nums) {
  const n = nums.length
  const res = new Array(n).fill(-1)
  const st = []

  for (let i = 0; i < n; i++) {
    while (st.length > 0 && nums[st[st.length - 1]] > nums[i]) {
      res[st.pop()] = nums[i]
    }
    st.push(i)
  }
  return res
}

// C. 环形数组的下一个更大元素（503）
function nextGreaterCircular(nums) {
  const n = nums.length
  const res = new Array(n).fill(-1)
  const st = []

  for (let i = 0; i < 2 * n; i++) {
    const cur = nums[i % n]
    while (st.length > 0 && nums[st[st.length - 1]] < cur) {
      res[st.pop()] = cur
    }
    if (i < n) st.push(i) // 只把第一圈的「真实下标」入栈，避免重复
  }
  return res
}

// D. 贡献法骨架：柱状图最大矩形（84）——对每根柱子求「左右第一个比它矮」的边界
// 这里返回最大面积，用来体会「单调栈求边界 → 算宽度 → 取最值」这条链
function largestRectangleArea(heights) {
  const h = [0, ...heights, 0] // 两端补 0，省掉栈空的特判
  const st = []
  let best = 0

  for (let i = 0; i < h.length; i++) {
    while (st.length > 0 && h[st[st.length - 1]] > h[i]) {
      const height = h[st.pop()]
      const width = i - st[st.length - 1] - 1 // 左右边界之间的宽度
      best = Math.max(best, height * width)
    }
    st.push(i)
  }
  return best
}

module.exports = { nextGreater, nextSmaller, nextGreaterCircular, largestRectangleArea }

// 验证题：problems/stack/739-daily-temperatures.md
// 变体题：496 / 503 下一个更大元素、42 接雨水、84 柱状图最大矩形、316 去除重复字母
