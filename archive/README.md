# 归档区 archive/

> 📦 归档日期：2026-10-08
> 本目录是**本轮刷题计划之前**的全部代码与文档。**不再维护，仅作参考**。
> 日常入口已经换成 → [plan/PLAN.md](../plan/PLAN.md)

## 归档了什么

| 目录 / 文件 | 是什么 |
| --- | --- |
| `problems/` | 早期 35 道题的题干（力扣官网原文，按算法分类） |
| `solutions/` | 对应答案（完整实现，文件头带「复现」字段） |
| `tests/` | 对应 jest 用例（含 `tests/handwritten/`） |
| `templates/` | 8 个骨架模板（二分 / 回溯 / BFS / DFS / 并查集 / Dijkstra / 单调栈 / 树遍历） |
| `handwritten/` | 手撕 JS 11 题 |
| `dp/` | DP 总纲（概念总览 + 股票族脚本）+ 历史草稿 `.js` |
| `basics/` | 计算机基础面试题约 125 题（os / network / database / architecture / data-structure） |
| [decision-tree.md](decision-tree.md) | 决策树：题干特征 → 候选算法。**仍在使用**——[PLAN.md](../plan/PLAN.md) 要求每道新题动笔之前先走一遍 |
| [algorithm-60d-plan.md](algorithm-60d-plan.md) | 8 周攻坚计划。**训练规则与验收指标仍有效**；题单顺序已被 PLAN.md 取代 |
| 本文 | 原根 README（含旧题单总表） |

两点关系说明：

1. 之前的 `problems/` `solutions/` `tests/` 是**要二刷的旧题**的落点——PLAN.md 的二刷列（912 / 215 / 217 / 1 / 704 / 49 / 125 / 11 / 3 / 560 / 136 / 104 / 94 / 20 / 933 / 206 / 141）都指到这里。
2. 本次计划新出的题目、作答与用例在 `plan/` 下，与这里互不影响。

## 命名与三件套约定（旧题仍适用）

命名规则：`<题号>-<英文slug>.md / .js`，例如 `problems/array/001-two-sum.md` ↔ `solutions/001-two-sum.js`。

答案文件统一 `module.exports = { 函数名 }`，并用 `require.main === module` 隔离手动运行代码。

## 题单（旧 35 道，三件套齐备）

| 状态 | 题号 | 标题 | 难度 | 分类 |
| --- | --- | --- | --- | --- |
| ✅ | [1](problems/array/001-two-sum.md) | Two Sum | 简单 | array |
| ✅ | [217](problems/array/217-contains-duplicate.md) | Contains Duplicate | 简单 | array |
| ✅ | [125](problems/two-pointers/125-valid-palindrome.md) | Valid Palindrome | 简单 | two-pointers |
| ✅ | [11](problems/two-pointers/011-container-with-most-water.md) | Container With Most Water | 中等 | two-pointers |
| ✅ | [3](problems/sliding-window/003-longest-substring-without-repeating-characters.md) | Longest Substring Without Repeating Characters | 中等 | sliding-window |
| ✅ | [239](problems/sliding-window/239-sliding-window-maximum.md) | Sliding Window Maximum | 困难 | sliding-window |
| ✅ | [560](problems/prefix-sum/560-subarray-sum-equals-k.md) | Subarray Sum Equals K | 中等 | prefix-sum |
| ✅ | [49](problems/hash-table/049-group-anagrams.md) | Group Anagrams | 中等 | hash-table |
| ✅ | [20](problems/stack/020-valid-parentheses.md) | Valid Parentheses | 简单 | stack |
| ✅ | [933](problems/queue/933-number-of-recent-calls.md) | Number of Recent Calls | 简单 | queue |
| ✅ | [206](problems/linked-list/206-reverse-linked-list.md) | Reverse Linked List | 简单 | linked-list |
| ✅ | [141](problems/linked-list/141-linked-list-cycle.md) | Linked List Cycle | 简单 | linked-list |
| ✅ | [104](problems/binary-tree/104-maximum-depth-of-binary-tree.md) | Maximum Depth of Binary Tree | 简单 | binary-tree |
| ✅ | [704](problems/binary-search/704-binary-search.md) | Binary Search | 简单 | binary-search |
| ✅ | [215](problems/heap/215-kth-largest-element-in-an-array.md) | Kth Largest Element in an Array | 中等 | heap |
| ✅ | [912](problems/sorting/912-sort-an-array.md) | Sort an Array（六种实现） | 中等 | sorting |
| ✅ | [78](problems/backtracking/078-subsets.md) | Subsets | 中等 | backtracking |
| ✅ | [55](problems/greedy/055-jump-game.md) | Jump Game | 中等 | greedy |
| ✅ | [70](problems/dynamic-programming/070-climbing-stairs.md) | Climbing Stairs | 简单 | dynamic-programming |
| ✅ | [121](problems/dynamic-programming/121-best-time-to-buy-and-sell-stock.md) | Best Time to Buy and Sell Stock | 简单 | dynamic-programming |
| ✅ | [122](problems/dynamic-programming/122-best-time-to-buy-and-sell-stock-ii.md) | Best Time to Buy and Sell Stock II | 中等 | dynamic-programming |
| ✅ | [188](problems/dynamic-programming/188-best-time-to-buy-and-sell-stock-iv.md) | Best Time to Buy and Sell Stock IV | 困难 | dynamic-programming |
| ✅ | [714](problems/dynamic-programming/714-best-time-to-buy-and-sell-stock-with-transaction-fee.md) | Best Time to Buy and Sell Stock with Transaction Fee | 中等 | dynamic-programming |
| ✅ | [309](problems/dynamic-programming/309-best-time-to-buy-and-sell-stock-with-cooldown.md) | Best Time to Buy and Sell Stock with Cooldown | 中等 | dynamic-programming |
| ✅ | [136](problems/bit-manipulation/136-single-number.md) | Single Number | 简单 | bit-manipulation |
| ✅ | [9](problems/math/009-palindrome-number.md) | Palindrome Number | 简单 | math |

### 模板验证题（配合 `templates/`）

每个骨架模板配一道验证题，做完即可掌握对应模板；详见 [templates/README.md](templates/README.md)。

| 状态 | 题号 | 标题 | 难度 | 分类 | 对应模板 |
| --- | --- | --- | --- | --- | --- |
| ✅ | [34](problems/binary-search/034-find-first-and-last-position-of-element-in-sorted-array.md) | Find First and Last Position | 中等 | binary-search | 01 二分 |
| ✅ | [46](problems/backtracking/046-permutations.md) | Permutations（含 47） | 中等 | backtracking | 02 回溯 |
| ✅ | [994](problems/graph/994-rotting-oranges.md) | Rotting Oranges | 中等 | graph | 03 BFS |
| ✅ | [200](problems/graph/200-number-of-islands.md) | Number of Islands（三解） | 中等 | graph | 04 DFS / 05 并查集 |
| ✅ | [547](problems/graph/547-number-of-provinces.md) | Number of Provinces（三解） | 中等 | graph | 05 并查集 |
| ✅ | [743](problems/graph/743-network-delay-time.md) | Network Delay Time | 中等 | graph | 06 Dijkstra + 手写堆 |
| ✅ | [739](problems/stack/739-daily-temperatures.md) | Daily Temperatures | 中等 | stack | 07 单调栈 |
| ✅ | [94](problems/binary-tree/094-binary-tree-inorder-traversal.md) | Binary Tree Inorder Traversal | 简单 | binary-tree | 08 树迭代遍历 |

上表 ✅ 表示「题目 + 答案 + 用例」三件套都已就位（答案文件里是完整实现）。

> 曾在根 README 里的「待作答」表（75 / 274 / 56 / 1122 / 347 / 148 / 315 七道骨架题）已迁到 [plan/](../plan/PLAN.md)，那里的题干、作答骨架与用例都是活跃版本。

## 其它索引

- 骨架模板库：[templates/README.md](templates/README.md)
- 手撕 JS 题单：[handwritten/README.md](handwritten/README.md)
- DP 总纲：[dp/README.md](dp/README.md)
- 计算机基础面试题：[basics/README.md](basics/README.md)

## 怎么跑归档用例

根目录的 `npm test` 现在只跑本次计划（`plan/tests/`）。归档用例单独跑：

```bash
npm run test:archive          # 跑全部 archive/tests 用例
npm run review                # 二刷看板（同时扫 plan/solutions 与 archive/solutions）
npm run review:overdue        # 只看逾期未二刷的
npx jest --testMatch "<rootDir>/archive/tests/**/*.test.js" 206   # 只跑归档里的某一题
```

> 「复现」字段约定见 [plan/PLAN.md §5](../plan/PLAN.md)：`复现：一刷 09-28 提示 · 二刷 10-02 独立 · 三刷 ____`，二刷未通过写 `✗`。看板脚本在 [plan/scripts/review-progress.js](../plan/scripts/review-progress.js)。
