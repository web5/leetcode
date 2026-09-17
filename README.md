# LeetCode 基础算法题

## 目录约定

```
leetcode/
├── problems/            # 题目（按算法分类用目录归类，每题一个 .md）
│   ├── array/
│   ├── hash-table/
│   ├── two-pointers/
│   ├── sliding-window/
│   ├── prefix-sum/
│   ├── stack/
│   ├── queue/
│   ├── linked-list/
│   ├── binary-tree/
│   ├── binary-search/
│   ├── heap/
│   ├── sorting/
│   ├── backtracking/
│   ├── greedy/
│   ├── dynamic-programming/
│   ├── bit-manipulation/
│   └── math/
├── solutions/           # 答案（统一放这个根目录，平铺，文件名与题目一一对应）
│   ├── 001-two-sum.js
│   └── ...
└── tests/               # 每个答案对应的 jest 用例
    └── 001-two-sum.test.js
```

命名规则：`<题号>-<英文slug>.md / .js`，例如 `problems/array/001-two-sum.md` ↔ `solutions/001-two-sum.js`。
答案文件统一 `module.exports = { 函数名 }`，并用 `require.main === module` 隔离手动运行代码。

## 题单

| 状态 | 题号 | 标题 | 难度 | 分类 |
| --- | --- | --- | --- | --- |
| ✅ | [1](problems/array/001-two-sum.md) | Two Sum | 简单 | array |
| ✅ | [217](problems/array/217-contains-duplicate.md) | Contains Duplicate | 简单 | array |
| ✅ | [125](problems/two-pointers/125-valid-palindrome.md) | Valid Palindrome | 简单 | two-pointers |
| ✅ | [11](problems/two-pointers/011-container-with-most-water.md) | Container With Most Water | 中等 | two-pointers |
| ✅ | [3](problems/sliding-window/003-longest-substring-without-repeating-characters.md) | Longest Substring Without Repeating Characters | 中等 | sliding-window |
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
| ✅ | [136](problems/bit-manipulation/136-single-number.md) | Single Number | 简单 | bit-manipulation |
| ✅ | [9](problems/math/009-palindrome-number.md) | Palindrome Number | 简单 | math |

上表 ✅ 表示「题目 + 答案 + 用例」三件套都已就位。

`problems/` 里每题的 md 是力扣官网题干原文（逐题抓取，含示例与约束）；`solutions/` 里是对应 JS 答案，`tests/` 里是 jest 用例。`dp/` 是历史草稿区（内含正在推敲的 188 早期版本），**保留不动**；正式三件套以上面的目录为准，两边互不干扰。

## 运行

```bash
npm test              # 跑全部用例
npm test -- 001       # 只跑某一题（文件名模糊匹配）
npm run test:watch
```

## 计算机基础面试题

见 [basics/](basics/README.md)，按 `os / network / database / architecture / data-structure` 分目录，共约 125 题 + 答案。
# leetcode
