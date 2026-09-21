# 工程约定（leetcode）

## 测试

- **禁止自动运行测试**：不要主动执行 `npm test` / `npx jest` / `jest --watch` 等任何测试命令，包括改动 `solutions/` 或 `tests/` 之后的自检。
- 只有用户明确说「跑测试」「验证一下」时才执行，且只运行用户指定的文件或用例。
- lint / 类型检查同理，非用户要求不主动跑。
- 写题解、改测试文件后，直接说明需要时如何运行（如 `npx jest tests/217-contains-duplicate.test.js`），不要替用户执行。
