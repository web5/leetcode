# 567. 字符串的排列（中等）

> https://leetcode.cn/problems/permutation-in-string/
> 标签：哈希表、双指针、字符串、滑动窗口
> 作答文件：`solutions/567-permutation-in-string.js`（按计划手动编写）

## 题目描述

给你两个字符串 `s1` 和 `s2`，写一个函数来判断 `s2` 是否包含 `s1` 的排列。如果是，返回 `true`；否则，返回 `false`。

换句话说，`s1` 的排列之一是 `s2` 的 **子串**。

## 示例

**示例 1：**
- 输入：`s1 = "ab", s2 = "eidbaooo"`
- 输出：`true`
- 解释：`s2` 包含 `s1` 的排列之一（`"ba"`）。

**示例 2：**
- 输入：`s1 = "ab", s2 = "eidboaoo"`
- 输出：`false`

## 提示

- `1 <= s1.length, s2.length <= 10^4`
- `s1` 和 `s2` 仅包含小写字母

## 与 438 的关系

**同一个定长窗口模板**：438 要求返回所有命中的起始下标，567 只要求「命中一次就 return true」。567 可以看作是 438 的布尔版本（且能提前返回，写法上多一个 `return true` 的出口）。
