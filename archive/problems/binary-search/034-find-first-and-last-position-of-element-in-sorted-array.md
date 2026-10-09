# 34. 在排序数组中查找元素的第一个和最后一个位置（中等）

> https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
> 标签：数组、二分查找
> 答案：[solutions/034-find-first-and-last-position-of-element-in-sorted-array.js](../../solutions/034-find-first-and-last-position-of-element-in-sorted-array.js)
> 关联模板：[templates/01-binary-search.js](../../templates/01-binary-search.js)（变体 B1/B2）

## 题目描述

给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。

## 示例

**示例 1：**
- 输入：`nums = [5,7,7,8,8,10], target = 8`
- 输出：`[3,4]`

**示例 2：**
- 输入：`nums = [5,7,7,8,8,10], target = 6`
- 输出：`[-1,-1]`

**示例 3：**
- 输入：`nums = [], target = 0`
- 输出：`[-1,-1]`

## 提示

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `nums` 是一个非递减数组
- `-10^9 <= target <= 10^9`

## 为什么它是模板 01 的验证题

一次二分只能定位「某个」目标，而本题要的是**左右两个边界**，正好分别对应 `lowerBound`（第一个 `>= target`）与 `upperBound`（第一个 `> target`）：

```
left  = lowerBound(nums, target)
right = upperBound(nums, target) - 1
若 left === nums.length 或 nums[left] !== target → [-1, -1]
```

自己写一遍后对照：两个变体的差别**只有一行比较符**（`<` 与 `<=`），这就是「模板是压缩包」的意思。
