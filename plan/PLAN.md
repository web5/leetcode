# 刷题计划（12 周 · 按目录）

> 建立：2026-10-08 · 周期：12 周（84 天 = 72 个学习日 + 12 个复盘日）
> 定位：**本文件是唯一入口**。回答「今天做哪几道题」，并给每道题的题干 / 作答文件直链。

---

## 0. 文档地图

| 文档 | 回答什么问题 | 什么时候看 |
| --- | --- | --- |
| **PLAN.md（本文）** | 计划总览 + 每天做哪几道题 + 每题直链 + 进度 | **每天开工先看** |
| [archive/decision-tree.md](../archive/decision-tree.md) | 拿到裸题干，第一反应该往哪想 | **每道新题动笔之前**（已归档，仍在使用） |
| [archive/algorithm-60d-plan.md](../archive/algorithm-60d-plan.md) | 训练规则（每日节奏、五问笔记、二刷判定）、验收指标 | 建习惯时通读一次；其八周题单已被本文取代顺序 |
| [archive/README.md](../archive/README.md) | 为什么归档、归档了什么 + 旧题单总表 | 好奇旧文档时 |

目录分工：

```
leetcode/                       # 根目录只保留两桶 + 配置文件
├── plan/                       # ① 本次：计划 + 题目 + 作答
│   ├── PLAN.md                 #    计划（唯一入口，日常只看这个）
│   ├── problems/<分类>/         #    题干（力扣原文）
│   ├── week-XX/dN/             #    一天一个目录：算法 + 手撕混放
│   │   ├── 075-sort-colors.js             # 作答（算法）：实现 + CASES + 自测运行器
│   │   ├── 01-debounce-throttle.js        # 作答（手撕）：实现 + CHECKS + 自测运行器
│   │   ├── 01-debounce-throttle.notes.md  # 讲解（不是作业）
│   │   └── 01-….reference.js              # 学习参考实现（jest 忽略）
│   └── scripts/                #    review-progress.js（npm run review 看板）
└── archive/                    # ② 归档：之前的一切，仅作参考
    ├── problems/ solutions/ tests/
    ├── templates/ handwritten/ dp/ basics/
    ├── README.md               #    原根 README（旧题单总表）
    └── decision-tree.md · algorithm-60d-plan.md
```

本计划与 60d 计划（已归档）有两处口径差异，**以本文为准**：

1. **顺序用「基础优先」，不是「缺口优先」**。60d 计划把图论排第 1 周；但排序与 DP 的基本盘没坐稳，所以本计划：**第 1 周专攻排序，第 9–10 周给 DP 整整两周**，图论后移到第 8 周。
2. **周期由 8 周延到 12 周**。60d 计划按「每天 2 道新题」在 8 周内只能覆盖约 96 道新题；12 周 × 6 天 × 2 题 ≈ **144 道新题**，加归档区已有的 35 道（`archive/`），一刷总量 175–185。

顺带一句：**排序不是「刷几道题」，是「能盲写 + 说清取舍」**。第 1 周做的就是这件事，不要跳过。

---

## 1. 时间口径与题量档位

默认走**标准档**（每天约 2–2.5 小时）：

| 档位 | 新题 | 二刷 | 手撕 | 日耗时 | 走完 12 周能覆盖 |
| --- | --- | --- | --- | --- | --- |
| 轻 | 1 | 1 | 0–1 | ~1 h | 72 题（周期需延到 20 周以上） |
| **标准** | **2** | **2** | **1** | **~2.5 h** | **144 题 + 已有 35 题** |
| 冲刺 | 3 | 3 | 1 | ~3.5 h | 216 题（8 周可走完，但极易断） |

> 没有面试时间压力就用轻档拉长周期；**硬撑标准档然后第 4 天断了，比走轻档差得多**。

每天三段固定动作（顺序别换，先难后易会烂尾）：

```
新题 2 道（各 40 min，超时立刻看题解，当场补笔记）
  ↓
二刷 2 道（各 20 min，限时盲写，写完才允许翻历史笔记）
  ↓
手撕 1 道（20 min，就在当天的 week-XX/dN/ 目录里，编号 01–17）
  ↓
收尾 10 min（填「复现」字段 + 补 decision-tree 一行）
```

每周第 7 天：**复盘 + 60 分钟限时模拟**（算法 2 道 + 手撕 1 道，中途不查资料、不跑测试）。

### 手撕题索引（17 题，贯穿 12 周）

手撕和算法题**放在同一个目录**：`plan/week-XX/dN/` 就是那一天的全部作答文件（算法 + 手撕混放），每个文件都自带作答区 + 自测素材 + 自测运行器。

同目录里可能还有**学习资料**，靠后缀区分（都**不是**作业，别在上面作答）：

| 后缀 | 是什么 | 会被 jest 跑吗 |
| --- | --- | --- |
| 无后缀 `xxx.js` | **你的作答文件**（唯一的作业） | 会 |
| `xxx.notes.md` | 讲解：语义差别、分层实现、易错点、面试话术 | 不会 |
| `xxx.reference.js` | 学习用的分层参考实现 + 可跑演示 | **不会**（`jest.config` 已按 `*.reference.js` 排除） |

已有：手撕 **05 占第 1 周 D1/D2/D3 三天**（状态机 → then 链 → 静态方法），`week-01/d1/` 配了 `xxx.notes.md` + `xxx.reference.js`；手撕 **01（防抖 / 节流）** 现排在第 2 周 D2。

下面这张表是**考点索引**（链接指向该题第一次出现的文件）；重复出现的「重写 / 口述」日会各拿一份**全新的 TODO 副本**——重写时才不会被上一版的实现干扰。参考实现在 `archive/handwritten/`（写完再对照）。

| # | 题目 | 作答 + 自测 | 核心考点 |
| --- | --- | --- | --- |
| 01 | 防抖 / 节流 | [01-debounce-throttle.js](week-02/d2/01-debounce-throttle.js) | 闭包存定时器、this 与参数透传、leading/trailing |
| 02 | call / apply / bind | [02-call-apply-bind.js](week-02/d3/02-call-apply-bind.js) | 「挂到目标对象再调用」、bind 的 new 语义与偏函数 |
| 03 | new / instanceof | [03-new-instanceof.js](week-02/d4/03-new-instanceof.js) | 原型链四步、构造函数返回值规则 |
| 04 | 深拷贝 | [04-deep-clone.js](week-01/d4/04-deep-clone.js) | WeakMap 处理循环引用、Date/RegExp 分派 |
| 05 | 手写 Promise | [05-promise.js](week-01/d1/05-promise.js) | 三态状态机、then 链、resolve/all/race |
| 06 | 事件总线 | [06-event-emitter.js](week-02/d5/06-event-emitter.js) | on/once/off/emit、快照遍历 |
| 07 | 并发调度器 | [07-concurrency-limit.js](week-02/d6/07-concurrency-limit.js) | worker 池、结果按下标落位、失败不阻塞 |
| 08 | 柯里化 / 组合 / once / memoize | [08-func-utils.js](week-01/d5/08-func-utils.js) | fn.length、缓存命中 |
| 09 | 数组与字符串工具 | [09-array-utils.js](week-01/d6/09-array-utils.js) | 大数相加、千分位、Fisher-Yates |
| 10 | LRU 缓存 | [10-lru-cache.js](week-02/d1/10-lru-cache.js) | 哈希 + 双向链表、双哨兵 |
| 11 | 异步工具族 | [11-async-utils.js](week-03/d2/11-async-utils.js) | retry 退避、withTimeout、串行/并行 |
| 12 | Promise.all 限流版 | [12-promise-pool.js](week-03/d4/12-promise-pool.js) | 并发上限、结果按下标落位、不整体 reject |
| 13 | JSON.stringify | [13-json-stringify.js](week-03/d5/13-json-stringify.js) | 转义、省略 vs null、循环引用抛错 |
| 14 | 数组方法 map/filter/reduce | [14-array-methods.js](week-04/d2/14-array-methods.js) | 回调三参、新数组、reduce 无初值抛错 |
| 15 | Object.create / assign | [15-object-utils.js](week-04/d3/15-object-utils.js) | 原型创建、浅拷贝、null 源忽略 |
| 16 | 类型判断 getType | [16-get-type.js](week-04/d5/16-get-type.js) | null/array/date/regexp、toString 被重写 |
| 17 | 观察者模式 | [17-observer.js](week-11/d3/17-observer.js) | 目标直接持有观察者、快照遍历 |

> 12–17 是原「待补清单」里排进计划的那几道，现已出文件；排期见 §4 的「手撕」列（12、13 在第 3 周，14–16 在第 4 周，17 在第 11 周）。归档的 `archive/handwritten/README.md` 里还有更长的一串候补（分片上传、虚拟 DOM diff、generator 执行器等），需要时再出。

---

## 2. 每天怎么开工

**每题只有一个 js 文件**，路径是 `week-XX/dN/<题号>-<slug>.js`（周目录 + 当天目录），实现、测试素材、自测运行器都在里面。

1. 看本文当天的行，拿到题号（表里已给直链，不用自己找路径）。
2. **新题**：先只读 `problems/<分类>/<题号>-<slug>.md` 的题干，在脑内走一遍 [决策树](../archive/decision-tree.md) 的判据（**不要从目录名想**），再打开同一天的 `week-XX/dN/<题号>-<slug>.js`。
3. 那个文件里已经放好四块东西，从上往下填：
   - **五问笔记模板**（文件头注释）—— 逐行填，**「否掉」那一行不能省**；
   - **函数签名**（`throw new Error('xxx 未作答')`）—— 把你的实现写进这个函数体；
   - **测试素材 `CASES`** —— 官方示例 + 边界用例，格式 `{ name, args, expected }`，顺序无关的题带 `norm`，原地题用 `run(fn)`；不够就自己往下加；
   - **自测运行器**（文件末尾，不用改）—— 跑一次就出 ✅/❌ 和通过数。
4. **自测**：`node plan/week-02/d2/015-3sum.js`（也可以 `npm test -- 015` 走 jest）。
5. **二刷**：限时盲写，写完才允许翻历史笔记。
6. 收尾 10 分钟：填 `复现` 字段（见 §5）→ 跑 `npm run review` 看漏 → 把「题干特征 → 候选方向 → 否掉理由」补一行到决策树。

状态标记：

| 标记 | 含义 |
| --- | --- |
| 🟡 | 题干 + 作答文件都已就位，等你写实现；现在 `node` 跑该文件会**全红**，这是进度信号不是故障 |
| ✅ | 实现写完、自测全绿（`node plan/week-XX/dN/xxx.js` 全 ✅）、五问笔记填完 |
| ⬜ | 尚未出题（后续周次） |

---

## 3. 十二周总览

| 周 | 主目录 | 主题 | 新题 | 周末里程碑（能盲写 / 能口述） |
| --- | --- | --- | --- | --- |
| 1 | `problems/sorting/` | **排序基本功** | 10 | 六种排序盲写 + 说出各自适用场景与稳定性 |
| 2 | `array/ hash-table/ two-pointers/ sliding-window/ prefix-sum/` | 数组与线性技巧 | 12 | 滑动窗口两套模板（可变长 / 定长）分得清 |
| 3 | `binary-search/` | 二分与二分答案 | 12 | 手写 lower/upper bound 不看模板 |
| 4 | `stack/ queue/` | 栈、队列、单调栈 | 12 | 42 / 84 能讲出「贡献法」为什么成立 |
| 5 | `linked-list/` | 链表 | 12 | 六件套（哑节点 / 快慢指针 / 反转 / 归并 / 穿针引线 / 哈希）随手用 |
| 6 | `heap/ binary-tree/` | 堆 + 二叉树基础 | 12 | 手写堆的上浮 / 下沉；树四序迭代一次过 |
| 7 | `binary-tree/` | 二叉树进阶与 BST | 12 | 树形 DP 的「返回值定义」能讲清 |
| 8 | `graph/` | 图论 | 13 | 并查集 / Dijkstra / 拓扑三个模板盲写 |
| 9 | `dynamic-programming/` | **DP 基础：线性 + 背包** | 12 | 0-1 与完全背包的遍历顺序差异能说出为什么 |
| 10 | `dynamic-programming/` | **DP 进阶：序列 + 区间** | 13 | 编辑距离 / 戳气球能独立推导状态定义 |
| 11 | `backtracking/ greedy/` | 回溯与贪心 | 14 | 回溯三要素 + 区间贪心按右端点排序 |
| 12 | 设计题 / 字符串 / 位运算 / 矩阵 | 收口与模拟 | 14 | Hot 100 随机抽题 20 分钟内出可运行代码 |

标记说明：`★` = 该主题母题，**必做且必须能盲写**；其余为同族变体。旧题（001–912 共 35 道，现都在 `archive/`）一律计入「二刷」列，不重复列进新题。

---

## 4. 逐周逐日题单

> 每天一行 = **新题 2 道 + 二刷 2 道 + 手撕 1 道**。**「手撕」列已全部是可点直链**，点开就是你当天要写的那个文件（写实现 + 跑自测都在里面）；「新题」列的题干 / 作答文件直链，在第 1、2 周各自下方的索引表里（后续周次出题时同步补）。

### 第 1 周：排序基本功（`problems/sorting/`）

目标不是「刷题」，是**把六种排序写到能盲写，并说清取舍**。912 已有一份六实现答案，在归档里（`archive/solutions/912-sort-an-array.js`：归并 / 三路快排 / 堆排 / 计数 / 插入 / 冒泡），本周前三天就是**重写它**——不看答案。

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | [912 排序数组](week-01/d1/912-sort-an-array.js) —— 盲写 冒泡 / 选择 / 插入 | — | [05 手写 Promise（状态机）](week-01/d1/05-promise.js) ✅ |
| D2 | [912 排序数组](week-01/d2/912-sort-an-array.js) —— 盲写 归并 / 三路快排（含随机 pivot） | [217 存在重复元素](week-01/d2/217-contains-duplicate.js) | [05 Promise（then 链）](week-01/d2/05-promise.js) |
| D3 | 75 颜色分类（三路快排 / 计数两解）· 274 H 指数 | [1 两数之和](week-01/d3/001-two-sum.js) | [05 Promise（静态方法）](week-01/d3/05-promise.js) |
| D4 | 56 合并区间 ★ · 1122 数组的相对排序 | [704 二分查找](week-01/d4/704-binary-search.js) | [04 深拷贝](week-01/d4/04-deep-clone.js) |
| D5 | [215 第 K 个最大元素](week-01/d5/215-kth-largest-element-in-an-array.js)（快速选择，重刷）· 347 前 K 个高频元素 | [239 滑动窗口最大值](week-01/d5/239-sliding-window-maximum.js) | [08 函数工具（柯里化 / memoize）](week-01/d5/08-func-utils.js) |
| D6 | 148 排序链表（归并）★ · 315 计算右侧小于当前元素的个数（困难，归并计数） | [49 字母异位词分组](week-01/d6/049-group-anagrams.js) | [09 数组工具（大数相加 / 千分位）](week-01/d6/09-array-utils.js) |
| D7 | 复盘：默写六种排序 + 填下方自查表 + 补决策树排序条目 | — | — |

> 📌 **10-08 / 10-09 排期调整**（文件已跟着搬目录）——
> **05 手写 Promise 占满第 1 周 D1/D2/D3**：`week-01/d1`（状态机）→ `week-01/d2`（then 链）→ `week-01/d3`（静态方法），一天一份、一天一层；当天该让哪几个 check 变绿见讲解 §5。
> **被挤出来的两道顺延到第 2 周**：`02 call / apply / bind` → 第 2 周 D3（`week-02/d3/`）；`03 new / instanceof` → 第 2 周 D4（`week-02/d4/`）。
> 另：原第 1 周 D1 的 `01 防抖 / 节流` → 第 2 周 D2（`week-02/d2/`）。
> `复现` 字段写在每份文件头。
>
> 📌 **旧题（912 / 217 / 1 / 704 / 215 / 239 / 49）的作答文件**：出题时我漏建了（当时只给「新题」建了文件，可 912 是被排进新题列做**重写**的）。**第 1 周的 8 份现已全部补齐**，都在对应天的目录里，直接 `node plan/week-01/dN/xxx.js` 跑：
> D1 `912-sort-an-array.js`（冒泡 / 选择 / 插入）· D2 `912-sort-an-array.js`（归并 / 三路快排）+ `217-contains-duplicate.js` · D3 `001-two-sum.js` · D4 `704-binary-search.js` · D5 `215-kth-largest-element-in-an-array.js` + `239-sliding-window-maximum.js` · D6 `049-group-anagrams.js`。函数名与用例都对齐 `archive/` 里的旧实现，写完可直接对照。

**排序自查表**（D7 填完，之后每次面试前扫一眼）：

| 算法 | 平均 | 最坏 | 空间 | 稳定 | 什么时候用 |
| --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | 是 | 只用来讲「交换相邻元素」的直觉 |
| 选择 | O(n²) | O(n²) | O(1) | 否 | 交换次数最少（n-1 次）时 |
| 插入 | O(n²) | O(n²) | O(1) | 是 | n 很小 / 近乎有序（快排的小数组优化） |
| 归并 | O(n log n) | O(n log n) | O(n) | 是 | **要求稳定** 或 **链表排序** 或 **统计逆序对** |
| 快排 | O(n log n) | O(n²) | O(log n) | 否 | 通用最快（随机 pivot 规避最坏） |
| 堆排 | O(n log n) | O(n log n) | O(1) | 否 | 要求最坏 O(n log n) 且空间 O(1) |
| 计数 | O(n + k) | O(n + k) | O(k) | 是 | 值域有界（912 的 `\|nums[i]\| ≤ 5e4` 正好） |

面试必答的追问：为什么快排最坏 O(n²)、怎么规避？为什么归并有 O(n) 空间、能否原地？`Array.prototype.sort` 在 V8 里是什么算法（TimSort，稳定）？

**第 1 周新题**（每题一个自包含 js，按天归到 `week-01/dN/`）：

| 天 | 题号 | 题干 | 作答 + 自测（同一个文件） | 状态 |
| --- | --- | --- | --- | --- |
| D3 | 75 颜色分类 | [075-sort-colors.md](problems/sorting/075-sort-colors.md) | [075-sort-colors.js](week-01/d3/075-sort-colors.js) | 🟡 |
| D3 | 274 H 指数 | [274-h-index.md](problems/sorting/274-h-index.md) | [274-h-index.js](week-01/d3/274-h-index.js) | 🟡 |
| D4 | 56 合并区间 | [056-merge-intervals.md](problems/sorting/056-merge-intervals.md) | [056-merge-intervals.js](week-01/d4/056-merge-intervals.js) | 🟡 |
| D4 | 1122 数组的相对排序 | [1122-relative-sort-array.md](problems/sorting/1122-relative-sort-array.md) | [1122-relative-sort-array.js](week-01/d4/1122-relative-sort-array.js) | 🟡 |
| D5 | 347 前 K 个高频元素 | [347-top-k-frequent-elements.md](problems/heap/347-top-k-frequent-elements.md) | [347-top-k-frequent-elements.js](week-01/d5/347-top-k-frequent-elements.js) | 🟡 |
| D6 | 148 排序链表 | [148-sort-list.md](problems/linked-list/148-sort-list.md) | [148-sort-list.js](week-01/d6/148-sort-list.js) | 🟡 |
| D6 | 315 右侧小于当前元素的个数 | [315-count-of-smaller-numbers-after-self.md](problems/sorting/315-count-of-smaller-numbers-after-self.md) | [315-count-of-smaller-numbers-after-self.js](week-01/d6/315-count-of-smaller-numbers-after-self.js) | 🟡 |

D1 的 912 与 D5 的 215 是**旧题**，完整答案在归档里（[912](../archive/solutions/912-sort-an-array.js) / [215](../archive/solutions/215-kth-largest-element-in-an-array.js)），按计划**只看题干重写、不看答案**。

### 第 2 周：数组 · 哈希 · 双指针 · 滑动窗口 · 前缀和

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 128 最长连续序列（哈希）· 242 有效的字母异位词 | 1 · 217 | [10 LRU 缓存](week-02/d1/10-lru-cache.js) |
| D2 | 15 三数之和 ★ · 167 两数之和 II | 11 盛最多水的容器 · 125 验证回文串 | [01 防抖 / 节流](week-02/d2/01-debounce-throttle.js)（从第 1 周 D1 顺延） |
| D3 | 16 最接近的三数之和 · 18 四数之和 | 3 无重复字符的最长子串 | [02 call / apply / bind](week-02/d3/02-call-apply-bind.js)（从第 1 周 D2 顺延） |
| D4 | 76 最小覆盖子串（困难）★ · 209 长度最小的子数组 | 239 | [03 new / instanceof](week-02/d4/03-new-instanceof.js)（从第 1 周 D3 顺延） |
| D5 | 438 找到字符串中所有字母异位词 · 567 字符串的排列 | 560 和为 K 的子数组 | [06 事件总线](week-02/d5/06-event-emitter.js) |
| D6 | 238 除自身以外数组的乘积 · 41 缺失的第一个正数（困难） | 49 · 125 | [07 并发调度器](week-02/d6/07-concurrency-limit.js) |
| D7 | 复盘：把滑动窗口两套模板（可变长 / 定长）补进 `templates/09` | — | — |

**第 2 周新题**（同样每题一个自包含 js，按天归到 `week-02/dN/`）：

| 天 | 题号 | 题干 | 作答 + 自测（同一个文件） | 状态 |
| --- | --- | --- | --- | --- |
| D1 | 128 最长连续序列 | [128-longest-consecutive-sequence.md](problems/hash-table/128-longest-consecutive-sequence.md) | [128-longest-consecutive-sequence.js](week-02/d1/128-longest-consecutive-sequence.js) | 🟡 |
| D1 | 242 有效的字母异位词 | [242-valid-anagram.md](problems/hash-table/242-valid-anagram.md) | [242-valid-anagram.js](week-02/d1/242-valid-anagram.js) | 🟡 |
| D2 | 15 三数之和 ★ | [015-3sum.md](problems/two-pointers/015-3sum.md) | [015-3sum.js](week-02/d2/015-3sum.js) | 🟡 |
| D2 | 167 两数之和 II | [167-two-sum-ii-input-array-is-sorted.md](problems/two-pointers/167-two-sum-ii-input-array-is-sorted.md) | [167-two-sum-ii-input-array-is-sorted.js](week-02/d2/167-two-sum-ii-input-array-is-sorted.js) | 🟡 |
| D3 | 16 最接近的三数之和 | [016-3sum-closest.md](problems/two-pointers/016-3sum-closest.md) | [016-3sum-closest.js](week-02/d3/016-3sum-closest.js) | 🟡 |
| D3 | 18 四数之和 | [018-4sum.md](problems/two-pointers/018-4sum.md) | [018-4sum.js](week-02/d3/018-4sum.js) | 🟡 |
| D4 | 76 最小覆盖子串 ★ | [076-minimum-window-substring.md](problems/sliding-window/076-minimum-window-substring.md) | [076-minimum-window-substring.js](week-02/d4/076-minimum-window-substring.js) | 🟡 |
| D4 | 209 长度最小的子数组 | [209-minimum-size-subarray-sum.md](problems/sliding-window/209-minimum-size-subarray-sum.md) | [209-minimum-size-subarray-sum.js](week-02/d4/209-minimum-size-subarray-sum.js) | 🟡 |
| D5 | 438 找到字符串中所有字母异位词 | [438-find-all-anagrams-in-a-string.md](problems/sliding-window/438-find-all-anagrams-in-a-string.md) | [438-find-all-anagrams-in-a-string.js](week-02/d5/438-find-all-anagrams-in-a-string.js) | 🟡 |
| D5 | 567 字符串的排列 | [567-permutation-in-string.md](problems/sliding-window/567-permutation-in-string.md) | [567-permutation-in-string.js](week-02/d5/567-permutation-in-string.js) | 🟡 |
| D6 | 238 除自身以外数组的乘积 | [238-product-of-array-except-self.md](problems/prefix-sum/238-product-of-array-except-self.md) | [238-product-of-array-except-self.js](week-02/d6/238-product-of-array-except-self.js) | 🟡 |
| D6 | 41 缺失的第一个正数 | [041-first-missing-positive.md](problems/array/041-first-missing-positive.md) | [041-first-missing-positive.js](week-02/d6/041-first-missing-positive.js) | 🟡 |

三组「母题 → 变体」连着做：**15 → 16 → 18**（三数 / 最接近 / 四数，同一骨架）· **76 → 209**（可变长窗口）· **438 → 567**（定长窗口，567 是 438 的布尔版）。

### 第 3 周：二分与二分答案（`binary-search/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 35 搜索插入位置 · 69 x 的平方根 | 704 · 34 查找区间 | [07 并发调度器（重写）](week-03/d1/07-concurrency-limit.js) |
| D2 | 33 搜索旋转排序数组 ★ · 153 寻找旋转排序数组中的最小值 | 34 | [11 异步工具（重试 / 超时）](week-03/d2/11-async-utils.js) |
| D3 | 162 寻找峰值 · 875 爱吃香蕉的珂珂 ★ | 704 | — |
| D4 | 1011 在 D 天内送达包裹的能力 ★ · 410 分割数组的最大值（困难） | 34 | [12 Promise.all 限流版](week-03/d4/12-promise-pool.js) |
| D5 | 4 寻找两个正序数组的中位数（困难） | 33 | [13 JSON.stringify](week-03/d5/13-json-stringify.js) |
| D6 | 852 山脉数组的峰顶索引 · 278 第一个错误的版本 | 875 | — |
| D7 | 复盘：二分三形态（精确值 / lower_bound / upper_bound）+ 二分答案的「check 单调」判据，补进 `templates/01` 注释 | — | — |

关键：**二分答案 = 把「求最优值」转成「判定可行性」**。看到「最小化最大值 / 最大化最小值」就该怀疑它。

### 第 4 周：栈 · 队列 · 单调栈（`stack/ queue/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 155 最小栈 · 150 逆波兰表达式求值 | 20 有效的括号 | — |
| D2 | 232 用栈实现队列 · 225 用队列实现栈 | 933 最近的请求次数 | [14 数组方法](week-04/d2/14-array-methods.js) |
| D3 | 394 字符串解码 ★ · 32 最长有效括号（困难） | 20 | [15 Object.create / assign](week-04/d3/15-object-utils.js) |
| D4 | 739 每日温度（重刷）★ · 496 下一个更大元素 I | 739 · 20 | — |
| D5 | 503 下一个更大元素 II（环形）· 316 去除重复字母 | 739 | [16 getType](week-04/d5/16-get-type.js) |
| D6 | 42 接雨水（困难，栈 / 双指针 / 前缀最值三解）★ · 84 柱状图中最大的矩形（困难）★ | 739 | — |
| D7 | 复盘：单调栈模板 07 的两种改写 —— 环形（下标翻倍）与贡献法（弹栈时结算） | — | — |

### 第 5 周：链表（`linked-list/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 21 合并两个有序链表 · 2 两数相加 | 206 反转链表 · 141 环形链表 | [03 new / instanceof（重写）](week-05/d1/03-new-instanceof.js) |
| D2 | 19 删除链表的倒数第 N 个结点 · 24 两两交换链表中的节点 | 206 | — |
| D3 | 92 反转链表 II · 143 重排链表 | 141 | [04 深拷贝（重写）](week-05/d3/04-deep-clone.js) |
| D4 | 25 K 个一组翻转链表（困难）★ · 160 相交链表 | 206 | — |
| D5 | 23 合并 K 个升序链表（困难）★ · 138 随机链表的复制 | 141 | [02 call / apply / bind（重写）](week-05/d5/02-call-apply-bind.js) |
| D6 | 234 回文链表 · 86 分隔链表 · 328 奇偶链表 | 206 | — |
| D7 | 复盘：链表六件套 —— 哑节点 / 快慢指针 / 反转 / 归并 / 穿针引线 / 哈希存旧节点 | — | — |

### 第 6 周：堆 + 二叉树基础（`heap/ binary-tree/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 1046 最后一块石头的重量 · 253 会议室 II（扫描线 / 小顶堆） | 215 | [08 函数工具（重写）](week-06/d1/08-func-utils.js) |
| D2 | 295 数据流的中位数（困难）★ · 703 数据流中的第 K 大元素 | 215 | — |
| D3 | 144 前序遍历（迭代）· 145 后序遍历（迭代） | 94 中序遍历（迭代） | — |
| D4 | 102 二叉树的层序遍历 ★ · 199 二叉树的右视图 | 104 最大深度 | [09 数组工具（重写）](week-06/d4/09-array-utils.js) |
| D5 | 226 翻转二叉树 · 101 对称二叉树 | 104 | — |
| D6 | 543 二叉树的直径 · 110 平衡二叉树 | 94 | — |
| D7 | 复盘：树四序迭代模板 08 + **手写堆**（建堆 / 上浮 / 下沉 / 取顶） | — | — |

JS 没有内置堆，`heap/` 与 `253 / 295 / 347 / 23` 全靠手写堆。这周必须把它写熟。

### 第 7 周：二叉树进阶与 BST（`binary-tree/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 98 验证二叉搜索树 ★ · 230 BST 中第 K 小的元素 | 94 · 104 | — |
| D2 | 236 最近公共祖先 ★ · 235 BST 的最近公共祖先 | 104 | [10 LRU 缓存（重写）](week-07/d2/10-lru-cache.js) |
| D3 | 105 从前序与中序构造二叉树 ★ · 106 中序与后序构造 | 94 | — |
| D4 | 114 二叉树展开为链表 · 437 路径总和 III | 102 | — |
| D5 | 124 二叉树中的最大路径和（困难）★ · 337 打家劫舍 III | 104 | — |
| D6 | 297 二叉树的序列化与反序列化（困难）· 700 BST 中的搜索 | 94 | — |
| D7 | 复盘：树形 DP 的「返回值定义」三连（124 返回单边最大链 / 543 返回高度 / 337 返回选与不选两个状态） | — | — |

### 第 8 周：图论（`graph/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 695 岛屿的最大面积 · 130 被围绕的区域 | 200 岛屿数量 | [06 事件总线（重写）](week-08/d1/06-event-emitter.js) |
| D2 | 133 克隆图 · 797 所有可能的路径 | 994 腐烂的橘子 | — |
| D3 | 207 课程表 ★ · 210 课程表 II（拓扑排序入度法） | 200 | — |
| D4 | 542 01 矩阵（多源 BFS）· 684 冗余连接（并查集判环） | 547 省份数量 | — |
| D5 | 721 账户合并 · 947 移除最多的同行或同列石头 | 547 | [07 并发调度器（重写）](week-08/d5/07-concurrency-limit.js) |
| D6 | 743 网络延迟时间（重刷）★ · 787 K 站中转内最便宜的航班 · 886 可能的二分法 | 200 | — |
| D7 | 复盘：手写并查集（路径压缩 + 按秩合并）/ Dijkstra（手写堆）/ 拓扑入度法，三个模板合上一次 | — | — |

### 第 9 周：DP 基础 —— 线性 + 背包（`dynamic-programming/`）

归档区已有线性 DP 的股票五连（121 / 122 / 188 / 309 / 714）+ 70，本周**从背包开始补**，股票族只在二刷列里过。

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 198 打家劫舍 ★ · 213 打家劫舍 II（环形拆两段） | 70 · 121 | [11 异步工具（重写）](week-09/d1/11-async-utils.js) |
| D2 | 322 零钱兑换 ★（完全背包求最少）· 279 完全平方数 | 70 · 122 | — |
| D3 | 518 零钱兑换 II（求方案数）· 416 分割等和子集 ★（0-1 背包） | 188 | — |
| D4 | 494 目标和 · 1049 最后一块石头的重量 II | 122 | — |
| D5 | 139 单词拆分 ★ · 62 不同路径 | 70 | — |
| D6 | 64 最小路径和 · 221 最大正方形 | 121 | — |
| D7 | 复盘：**背包最小集**（0-1 / 完全 / 求最值 / 求方案数）写进 `templates/15`，重点答「为什么 0-1 要倒序遍历容量、完全背包正序」 | — | — |

### 第 10 周：DP 进阶 —— 序列 + 区间

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 300 最长递增子序列 ★（O(n²) 与贪心 + 二分两解）· 1143 最长公共子序列 ★ | 70 | — |
| D2 | 72 编辑距离 ★ · 583 两个字符串的删除操作 | 1143 | [10 LRU 缓存（口述）](week-10/d2/10-lru-cache.js) |
| D3 | 152 乘积最大子数组（正负双状态）· 53 最大子数组和 | 121 | — |
| D4 | 312 戳气球（困难）★ · 516 最长回文子序列 | — | — |
| D5 | 5 最长回文子串 · 647 回文子串 | — | — |
| D6 | 96 不同的二叉搜索树 · 354 俄罗斯套娃信封问题（困难） | 309 · 714 | — |
| D7 | 复盘：**区间 DP 的「枚举最后一步」** vs **序列 DP 的「看末尾能否匹配」** —— 这两类状态定义方式必须能自己推出来 | — | — |

### 第 11 周：回溯与贪心（`backtracking/ greedy/`）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 47 全排列 II（同层去重）· 90 子集 II | 46 全排列 · 78 子集 | — |
| D2 | 39 组合总和 · 40 组合总和 II | 78 | — |
| D3 | 17 电话号码的字母组合 · 22 括号生成 ★ | 46 | [17 观察者模式](week-11/d3/17-observer.js) |
| D4 | 79 单词搜索 ★ · 131 分割回文串 | 78 | — |
| D5 | 51 N 皇后（困难）★ · 93 复原 IP 地址 | 46 | — |
| D6 | 45 跳跃游戏 II ★ · 435 无重叠区间 ★ · 452 用最少数量的箭引爆气球 · 763 划分字母区间 | 55 跳跃游戏 | — |
| D7 | 复盘：回溯三要素（路径 / 选择列表 / 结束条件）+ 区间贪心「按右端点排序」；余量题 134 加油站 / 135 分发糖果 / 406 根据身高重建队列 | — | — |

### 第 12 周：收口与全真模拟（设计题 / 字符串 / 位运算 / 矩阵）

| 天 | 新题（2 道） | 二刷（2 道） | 手撕 |
| --- | --- | --- | --- |
| D1 | 146 LRU 缓存 ★ · 380 O(1) 时间插入、删除和获取随机元素 | — | [10 LRU（与 146 对照写）](week-12/d1/10-lru-cache.js) |
| D2 | 208 实现 Trie ★ · 460 LFU 缓存（困难） | — | — |
| D3 | 191 位 1 的个数 · 338 比特位计数 · 268 丢失的数字 | 136 只出现一次的数字 | — |
| D4 | 137 只出现一次的数字 II · 260 只出现一次的数字 III · 190 颠倒二进制位 · 231 2 的幂 | — | — |
| D5 | 54 螺旋矩阵 ★ · 48 旋转图像 ★ · 73 矩阵置零 | — | — |
| D6 | 14 最长公共前缀 · 43 字符串相乘 · 415 字符串相加 · 8 字符串转换整数 (atoi) | — | — |
| D7 | **全真模拟**：Hot 100 随机抽 2 道 + 手撕 1 道，60 分钟限时，不查资料不跑测试 | — | — |

第 12 周结束后进入**面试期节奏**：不再刷新题，每天只做「二刷未过的 + 困难题」+ 手撕口述 + Hot 100 随机抽题模拟。

---

## 5. 每日收尾动作（10 分钟，别省）

1. **填「复现」字段**（写在 `week-XX/dN/*.js` 文件头，看板脚本靠它统计）：
   ```js
   /**
    * 复现：一刷 10-09 提示 · 二刷 10-11 独立 · 三刷 ____
    */
   ```
   二刷未通过把 `独立` 改成 `✗`。
2. **跑看板**，照「今日建议」核对有没有遗漏：
   ```bash
   npm run review              # 全量看板 + 今日建议
   npm run review:overdue      # 一刷后超 2 天未二刷（逾期）
   ```
3. **补决策树一行**：把本题的「题干特征 → 候选方向 → **否掉的那条路的理由**」写进 [decision-tree.md](../archive/decision-tree.md) §3 的补录模板。「否掉理由」是这份笔记里唯一不能省的一行。
4. 新题落位：题干 `problems/<分类>/<题号>-<slug>.md`，**作答 + 自测同一个文件** `week-XX/dN/<题号>-<slug>.js`（内含函数签名、`CASES` 测试素材、自测运行器；照同目录已有文件抄一份模板即可）。
   > 自测命令：`node plan/week-02/d2/015-3sum.js`（直接看 ✅/❌）；或 `npx jest plan/week-02/d2/015-3sum.js` / `npm test -- 015`。
   > 本工程约定：Agent **不自动跑测试**，命令留给你自己执行。

---

## 6. 里程碑与卡壳预案

| 时间点 | 标志 |
| --- | --- |
| 第 1 周末 | 六种排序盲写通过 + 自查表填写完整（**这一周不达标不要往后走**） |
| 第 4 周末 | 二分 / 单调栈两族能在 30 秒内互相否掉 |
| 第 8 周末 | 图论三模板（并查集 / Dijkstra / 拓扑）盲写；一刷总量 ≥ 100 |
| 第 10 周末 | DP 能自己推导状态定义（不是背转移方程） |
| 第 12 周末 | 一刷 ≥ 175，Hot 100 随机抽题 20 分钟内出可运行代码 |

卡壳预案（**积压不超过一周**）：

- **某周只完成 60%** → 缺的题平移到下一周的二刷列，不占新题名额；连续两周不达标就降到轻档，把周期延到 16 周。
- **某道题卡超过 40 分钟** → 立刻看题解，当场补五问笔记，48 小时内安排二刷（这类题才是真正要回炉的）。
- **DP 两周走完仍不踏实** → 不要进入第 11 周，把第 9–10 周的母题（322 / 416 / 139 / 300 / 1143 / 72 / 312）再盲写一遍。DP 是面试区分度最高的一块，值得多花一周。

---

## 7. 进度

### 做题进度（每周日花 10 分钟更新）

| 周 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 状态 | 🟡 | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### 出题进度（题干 + 作答/自测文件是否已就位）

每个作答文件都是自包含的（函数签名 + 测试素材 + 自测运行器），**算法题和手撕题一起**落在 `plan/week-XX/dN/`（一天一个目录）。

手撕 **31 份**已全部就位 ✅（17 道题按天铺开，重复的「重写/口述」日各一份新副本）—— 考点索引见 §1，每日直链见 §4。

| 周 | 主题 | 新题 | 出题 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | 排序基本功 | 10 | ✅ | 7 道已出（题干 + 作答/自测文件）；912 / 215 是旧题，答案在 `archive/solutions/` |
| 2 | 数组 · 哈希 · 双指针 · 滑动窗口 · 前缀和 | 12 | ✅ | 12 道已出（题干 + 作答/自测文件） |
| 3 | 二分与二分答案 | 12 | ⬜ | |
| 4 | 栈 · 队列 · 单调栈 | 12 | ⬜ | |
| 5 | 链表 | 12 | ⬜ | |
| 6 | 堆 + 二叉树基础 | 12 | ⬜ | |
| 7 | 二叉树进阶与 BST | 12 | ⬜ | |
| 8 | 图论 | 13 | ⬜ | |
| 9 | DP 基础（线性 + 背包） | 12 | ⬜ | |
| 10 | DP 进阶（序列 + 区间） | 13 | ⬜ | |
| 11 | 回溯与贪心 | 14 | ⬜ | |
| 12 | 设计题 / 字符串 / 位运算 / 矩阵 | 14 | ⬜ | |
