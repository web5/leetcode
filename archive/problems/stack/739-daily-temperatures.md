# 739. 每日温度（中等）

> https://leetcode.cn/problems/daily-temperatures/
> 标签：栈、数组、单调栈
> 答案：[solutions/739-daily-temperatures.js](../../solutions/739-daily-temperatures.js)
> 关联模板：[templates/07-monotonic-stack.js](../../templates/07-monotonic-stack.js)

## 题目描述

给定一个整数数组 `temperatures`，表示每天的温度，返回一个数组 `answer`，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

## 示例

**示例 1：**
- 输入：`temperatures = [73,74,75,71,69,72,76,73]`
- 输出：`[1,1,4,2,1,1,0,0]`

**示例 2：**
- 输入：`temperatures = [30,40,50,60]`
- 输出：`[1,1,1,0]`

**示例 3：**
- 输入：`temperatures = [30,60,90]`
- 输出：`[1,1,0]`

## 提示

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

## 为什么它是模板 07 的验证题

这是「下一个更大元素」的最裸形态，模板只需改两处：

- 模板返回的是**值**，本题要的是**下标差**（`i - 栈顶下标`）；
- 剩下的（栈存下标、栈内递减、遇大则弹）与模板一模一样。

写完对照三个递增关系自查：

1. **栈内值的单调方向**：本题栈内温度递减（栈底最热），因为一旦来了更高的温度，栈里比它低的全部出栈；
2. **弹出即定答案**：每个下标最多进栈、出栈各一次 → O(n)，这是能替代 O(n²) 暴力枚举的根本原因；
3. **没弹出的留在栈里**：默认 0，无需特判。

**递进做**：[496 / 503 下一个更大元素](https://leetcode.cn/problems/next-greater-element-i/)（含环形）→ [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)（贡献法）→ [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)（困难，模板 07 里已有骨架）。
