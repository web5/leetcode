# 工程约定（leetcode）

## 目录结构（两桶）

- `plan/` —— 本次刷题计划：`PLAN.md`（唯一入口）+ `problems/`（题干）+ `week-XX/dN/`（按天的作答文件）+ `scripts/`
- `archive/` —— 归档：之前的一切（旧题 / 答案 / 用例 / 模板 / 手撕参考实现 / DP 总纲 / 计算机基础 / 决策树 / 60 天计划），仅作参考

## 作答文件位置：一天一个目录

`plan/week-XX/dN/` —— **算法题与手撕题混放在同一个天目录里**，归属以 `plan/PLAN.md` §4 的题单表为准。

- 算法题：`plan/week-XX/dN/<题号>-<slug>.js`
- 手撕题：`plan/week-XX/dN/<编号>-<名字>.js`（重复出现的「重写 / 口述」日各有一份新副本）

每个**作答文件**（`<题号>-<slug>.js` / `<编号>-<名字>.js`）都是**自包含**的：笔记模板 + 函数签名 + 测试素材（算法题是 `CASES`，手撕题是 `CHECKS`）+ 自测运行器。

同目录里还有两类**非作业**文件，靠后缀区分：

- `xxx.notes.md` —— 讲解（语义、分层实现、易错点、面试话术）
- `xxx.reference.js` —— 学习用的分层参考实现 + 可跑演示；`jest.config` 的 `testPathIgnorePatterns` 已按 `*.reference.js` 排除，**不要**把它当测试文件

新增学习资料时保持这套命名，别改动作答文件的默认名。

- 手动自测：`node plan/week-02/d2/015-3sum.js`
  （打印 ✅/❌ 与通过数，失败时 `process.exitCode = 1`）
- jest：`npm test`（`testMatch` 为 `plan/week-*/**/*.js`）
- 归档用例：`npm run test:archive`（`archive/tests/**/*.test.js`）

## 看板（时间维度）

`plan/scripts/review-progress.js`：扫描 `plan/week-XX/dN/` 与 `archive/solutions/` 的「复现」字段，
并按时间维度输出（今天该做 / 逾期未二刷 / 待二刷 / 二刷未过 / 手撕进度）。

它同时解析 `plan/PLAN.md` §4 的日表（**只认 4 列的日表行**，索引表是 5 列不会被误读），
所以改动 §4 表格结构时要同步检查看板输出。

```bash
npm run review / review:today / review:overdue / review:hw
```

## 测试

- **禁止自动运行测试**：不要主动执行 `npm test` / `npx jest` / `node plan/week-*/**` 等任何测试或自测命令，包括改动作答文件、`plan/`、`archive/` 下文件之后的自检。
- 只有用户明确说「跑测试」「验证一下」时才执行，且只运行用户指定的文件或用例。
- lint / 类型检查同理，非用户要求不主动跑。
- 写题解、改用例后，直接说明需要时如何运行（如 `node plan/week-02/d2/015-3sum.js`），不要替用户执行。
