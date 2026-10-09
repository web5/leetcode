# leetcode

LeetCode 刷题工程。根目录只保留两桶：

| 目录 | 是什么 | 入口 |
| --- | --- | --- |
| `plan/` | **① 本次计划**：12 周题单 + 题干 + 按天的作答文件（含自测） | [plan/PLAN.md](plan/PLAN.md) |
| `archive/` | **② 归档**：之前的一切（旧题 / 答案 / 用例 / 模板 / 手撕参考实现 / DP 总纲 / 计算机基础 / 两份旧文档），仅作参考 | [archive/README.md](archive/README.md) |

```
leetcode/
├── plan/                    # ① 本次计划
│   ├── PLAN.md              # 计划唯一入口（每天做哪几道题 + 直链）
│   ├── problems/            # 题干（按算法分类，力扣原文）
│   ├── week-XX/dN/          # 一天的作答文件：算法题 + 手撕题混放在一起
│   │   ├── 075-sort-colors.js
│   │   └── 01-debounce-throttle.js
│   └── scripts/             # review-progress.js（时间维度看板）
└── archive/                 # ② 之前的代码与文档
```

## 一天一个目录

`plan/week-XX/dN/` 就是那一天要写的全部文件 —— **算法题和手撕题放在一起**。

目录里按后缀区分文件种类：

| 文件 | 是什么 |
| --- | --- |
| `xxx.js` | **作答文件**（唯一的作业），自包含：实现 + 测试素材 + 自测运行器 |
| `xxx.notes.md` | 讲解（语义差别 / 分层实现 / 易错点 / 面试话术），不是作业 |
| `xxx.reference.js` | 学习用的分层参考实现 + 可跑演示，**jest 会忽略**（`*.reference.js`） |

作答文件的结构：

```
笔记模板（算法是五问笔记 / 手撕是口述笔记）   ← 你填
function xxx(...) { ... }                    ← 你写实现
const CASES = [...]                          ← 测试素材（手撕题写的是 CHECKS）
自测运行器                                    ← 不用改，跑一次出 ✅/❌ 与通过数
```

```bash
node plan/week-02/d1/128-longest-consecutive-sequence.js   # 当天算法题自测
node plan/week-02/d1/10-lru-cache.js                       # 当天手撕题自测
npm test                                                   # 全部（19 算法 + 31 手撕 = 50 个文件）
```

## 一天怎么走

1. 打开 [plan/PLAN.md](plan/PLAN.md) 看当天那一行，或直接跑看板：
   ```bash
   npm run review          # 时间维度看板：今天该做 / 逾期未二刷 / 待二刷 / 手撕进度
   ```
2. 算法题：读 `plan/problems/<分类>/<题号>-<slug>.md` 的题干（**先别看目录名猜算法**，走一遍 [决策树](archive/decision-tree.md)），在当天目录的同名 js 里作答。
3. 手撕题：直接打开当天目录里那个手撕文件（参考实现在 `archive/handwritten/`，写完再对照）。
4. 收尾：填「复现」字段 → 再跑一次看板 → 补决策树一行。

## 常用命令

```bash
npm test                    # 跑本次计划全部用例（jest 扫 plan/week-*/**）
npm test -- 015             # 只跑某一题（文件名模糊匹配）
npm run test:watch
npm run test:archive        # 跑归档用例（archive/tests，默认不跑）

npm run review              # 时间维度看板（全量）
npm run review:today        # 只看今天该做（当前进度所在那一天）
npm run review:overdue      # 只看逾期未二刷
npm run review:hw           # 只看手撕进度（同编号多次练习合并显示）
npm run review -- 未开始     # 状态子串过滤
```

单跑某个归档用例：`npx jest --testMatch "<rootDir>/archive/tests/*.test.js" 206`

## 约定

- 命名：`<题号>-<英文slug>.md / .js`，例如 `plan/problems/two-pointers/015-3sum.md` ↔ `plan/week-02/d2/015-3sum.js`。
- 作答文件统一 `module.exports = { 函数名 }`，并用 `require.main === module` 隔离手动自测。
- 题干一律是力扣官网原文（含示例与约束）。
- **不自动跑测试**：只有明确要求时才执行，详见 `.codebuddy/CODEBUDDY.md`。
