# 743. 网络延迟时间（中等）

> https://leetcode.cn/problems/network-delay-time/
> 标签：图、最短路、堆（优先队列）
> 答案：[solutions/743-network-delay-time.js](../../solutions/743-network-delay-time.js)
> 关联模板：[templates/06-dijkstra.js](../../templates/06-dijkstra.js)

## 题目描述

有 `n` 个网络节点，标记为 `1` 到 `n`。

给你一个列表 `times`，表示信号经过 **有向** 边的传递时间。`times[i] = (ui, vi, wi)`，其中 `ui` 是源节点，`vi` 是目标节点，`wi` 是一个信号从源节点传递到目标节点的时间。

现在，从某个节点 `K` 发出一个信号。需要多久才能使 **所有节点** 都收到信号？如果不能使所有节点收到信号，返回 `-1`。

## 示例

**示例 1：**
- 输入：`times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2`
- 输出：`2`

**示例 2：**
- 输入：`times = [[1,2,1]], n = 2, k = 1`
- 输出：`1`

**示例 3：**
- 输入：`times = [[1,2,1]], n = 2, k = 2`
- 输出：`-1`

## 提示

- `1 <= k <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= ui, vi <= n`
- `ui != vi`
- `0 <= wi <= 100`
- 所有 `(ui, vi)` 对都 **互不相同**（即，不含重复边）

## 为什么它是模板 06 的验证题

本题 = 「从 k 出发的单源最短路，答案是 `max(dist)`，有不可达点则 -1」，恰好把 Dijkstra 的三个必须动作全考了：

1. **节点编号从 1 开始** → 建图时要统一偏移（`dist` 开 `n + 1`，或全部 -1）；
2. **有向图** → 只加单向边（这是最容易照抄模板出错的地方）；
3. **不可达判定** → `dist` 里出现 `Infinity` 就返回 -1。

面试高频追问：「为什么边权为负就不能用 Dijkstra？」标准答法：算法依赖「弹出堆顶时该点距离已最终确定」，负权边可能在之后把已确定的点改小，前提被破坏 → 换 Bellman-Ford。

**顺手做**：[787. K 站中转内最便宜的航班](https://leetcode.cn/problems/cheapest-flights-within-k-stops/)（限制中转次数的 Bellman-Ford / 分层最短路）。
