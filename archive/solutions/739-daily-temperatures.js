/**
 * 739. 每日温度（中等）
 * 题目：problems/stack/739-daily-temperatures.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 思路：单调栈（下一个更大元素），栈存**下标**，栈内温度单调递减。
 *  遍历到第 i 天时，把所有「温度比它低」的栈顶弹出去——被弹的那天，
 *  它等的下一个更高温就是第 i 天，天数差 = i - 栈顶下标。
 *
 * 暴力对照：对每天向右线性扫 O(n²)（n = 1e5 → 1e10 级，必超时），
 * 单调栈把「每个元素最多进栈一次、出栈一次」压成 O(n)。
 *
 * 易错点：
 *  - 栈里存的是下标，不是温度值（要算天数差）
 *  - 没等到更高温的下标留在栈里，答案保持默认 0，不需要特判
 *
 * 复杂度：时间 O(n)，空间 O(n)
 */

function dailyTemperatures(temperatures) {
  const n = temperatures.length
  const answer = new Array(n).fill(0)
  const stack = [] // 存下标，对应温度单调递减

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const prev = stack.pop()
      answer[prev] = i - prev // 弹出的这一刻答案确定
    }
    stack.push(i)
  }

  return answer
}

// 面试可提的暴力解，用来口述「为什么需要单调栈」
function dailyTemperaturesBruteForce(temperatures) {
  const n = temperatures.length
  const answer = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i
        break
      }
    }
  }
  return answer
}

module.exports = { dailyTemperatures, dailyTemperaturesBruteForce }

if (require.main === module) {
  console.log('res>>>', dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])) // [1,1,4,2,1,1,0,0]
  console.log('res>>>', dailyTemperatures([30, 40, 50, 60])) // [1,1,1,0]
  console.log('res>>>', dailyTemperatures([30, 60, 90])) // [1,1,0]
}
