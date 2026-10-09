# 547. 省份数量（中等）

> https://leetcode.cn/problems/number-of-provinces/
> 标签：深度优先搜索、广度优先搜索、并查集、图
> 答案：[solutions/547-number-of-provinces.js](../../solutions/547-number-of-provinces.js)
> 关联模板：[templates/05-union-find.js](../../templates/05-union-find.js)

## 题目描述

有 `n` 个城市，其中一些彼此相连，另一些没有相连。如果城市 `a` 与城市 `b` 直接相连，且城市 `b` 与城市 `c` 直接相连，那么城市 `a` 与城市 `c` 间接相连。

**省份** 是一组直接或间接相连的城市，组内不含其他没有相连的城市。

给你一个 `n x n` 的矩阵 `isConnected`，其中 `isConnected[i][j] = 1` 表示第 `i` 个城市和第 `j` 个城市直接相连，而 `isConnected[i][j] = 0` 表示二者不直接相连。

返回矩阵中 **省份** 的数量。

## 示例

**示例 1：**
- 输入：`isConnected = [[1,1,0],[1,1,0],[0,0,1]]`
- 输出：`2`

**示例 2：**
- 输入：`isConnected = [[1,0,0],[0,1,0],[0,0,1]]`
- 输出：`3`

## 提示

- `1 <= n <= 200`
- `n == isConnected.length`
- `n == isConnected[i].length`
- `isConnected[i][j]` 为 `1` 或 `0`
- `isConnected[i][i] == 1`
- `isConnected[i][j] == isConnected[j][i]`

## 为什么它是模板 05 的验证题

「有多少个连通分量」是并查集的两大典型问法之一（另一个是「判环」）。这题最关键的一步是**初始化时 `count = n`**，然后每成功合并一次就 `count--`：

```
初始化 count = n
for j > i: if (isConnected[i][j]) if (uf.union(i, j)) count--
返回 count
```

`union` 返回 boolean（本次是否真的合并了两个不同集合）是这个模板的核心设计——没有它就得额外判 `find` 是否相等。

**一题三解（必做）**：并查集 / DFS / BFS 各写一遍。三者复杂度都是 O(n²)，但并查集版代码最短，DFS 版最能体现「图的隐式表示」（邻接矩阵不用转邻接表也能直接遍历）。
