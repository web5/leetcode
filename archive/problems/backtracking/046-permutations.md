# 46. 全排列（中等）

> https://leetcode.cn/problems/permutations/
> 标签：数组、回溯
> 答案：[solutions/046-permutations.js](../../solutions/046-permutations.js)
> 关联模板：[templates/02-backtracking.js](../../templates/02-backtracking.js)（原型 3）

## 题目描述

给定一个不含重复数字的数组 `nums`，返回其 **所有可能的全排列**。你可以 **按任意顺序** 返回答案。

## 示例

**示例 1：**
- 输入：`nums = [1,2,3]`
- 输出：`[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`

**示例 2：**
- 输入：`nums = [0,1]`
- 输出：`[[0,1],[1,0]]`

**示例 3：**
- 输入：`nums = [1]`
- 输出：`[[1]]`

## 提示

- `1 <= nums.length <= 6`
- `-10 <= nums[i] <= 10`
- `nums` 中的所有整数 **互不相同**

## 为什么它是模板 02 的验证题

排列是回溯的「元素可回头、但不能重复用」分支，唯一的解法变量是 `used` 数组：

- 子集/组合用 `start` 控制选择列表（元素不回头）
- 排列用 `used` 标记（元素可回头，靠标记防重复）

`path.push(...)` 前必须 `path.slice()` 再存结果，否则存进去的是同一个数组引用——这是回溯最常见的 bug。

**进阶（必做）**：做完这题顺手写 [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/)（含重复数字），体会「排序 + `i > 0 && nums[i] === nums[i-1] && !used[i-1]` 同层去重」这行代码的必要性。
