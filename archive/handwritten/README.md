# 手撕代码 handwritten/

大厂前端 / 全栈岗的面试结构：**算法题（手撕）+ 手写 JS（手撕）+ 八股 + 项目**。这个目录专门对付第二类——它和算法题占同等权重，但准备成本低得多，属于「投入产出比最高的一块」。

约定：实现放本目录，测试统一放 `tests/handwritten/*.test.js`（这样 `npm test` 会把它们和算法题一起跑）。

## 清单

| # | 题目 | 核心考点 | 高频追问 | 难度 | 文件 |
| --- | --- | --- | --- | --- | --- |
| 01 | 防抖 / 节流 | 闭包保存定时器与上次执行时间、`this` 透传 | leading / trailing、cancel / flush、lodash 与手写的差异 | 中 | [debounce-throttle.js](debounce-throttle.js) |
| 02 | call / apply / bind | 「函数挂到目标对象上再调用」这一原理、Symbol 防污染 | bind 的 new 语义、硬绑定、偏函数 | 中 | [call-apply-bind.js](call-apply-bind.js) |
| 03 | new / instanceof | 原型链、构造函数返回值规则 | `Reflect.construct`、`Object.create(null)` | 易-中 | [new-instanceof.js](new-instanceof.js) |
| 04 | 深拷贝 | 循环引用（WeakMap）、内置类型分派 | JSON 方案四大硬伤、不可枚举属性、原型保留 | 中 | [deep-clone.js](deep-clone.js) |
| 05 | 手写 Promise | 三态状态机、微任务、then 返回新 Promise、A+ 解析过程 | all/allSettled/race/any、thenable、循环引用报错 | 难 | [promise.js](promise.js) |
| 06 | 事件总线 | Map + 监听器快照遍历、once 精确移除 | on 返回取消函数、内存泄漏、与发布订阅的区别 | 易-中 | [event-emitter.js](event-emitter.js) |
| 07 | 并发调度器 | worker 池 / 队列补位、结果按下标落位 | 限制并发数、动态追加、失败不阻塞其他任务 | 中-难 | [concurrency-limit.js](concurrency-limit.js) |
| 08 | 柯里化 / 组合 / once / memoize | 闭包状态、`fn.length`、reduce 抽象 | 缓存如何清空、多参数柯里化、组合函数的 this | 易-中 | [func-utils.js](func-utils.js) |
| 09 | 数组与字符串工具 | 双指针、逐位进位、正则分组、Fisher-Yates | 千分位、大数相加、按 key 去重、洗牌等概率性 | 易-中 | [array-utils.js](array-utils.js) |
| 10 | LRU 缓存 | 哈希表 + 双向链表、双哨兵 | 两个操作都要 O(1)、改用 LFU、与 Redis 近似 LRU 的区别 | 中-难 | [lru-cache.js](lru-cache.js) |
| 11 | 异步工具族 | Promise 组合、指数退避、finally 清理定时器 | 幂等重试、AbortController 取消、超时后原 promise 状态 | 易-中 | [async-utils.js](async-utils.js) |

## 怎么练（三个层次，别只停在第一层）

1. **照着写**：看一遍实现，理解「为什么这么写」；再关掉文件默写一遍。
2. **口头讲**：对着空气讲 60 秒：「这个题考的是……关键是……如果面试官追问 X，我会答……」。面试是边说边写，光会写不够。
3. **接追问**：表格最后一列就是面试官的第二问、第三问。每个追问都要能答上来（例如节流的 leading/trailing 组合、深拷贝为什么不能用 JSON、Promise 为什么回调必须异步）。

## 待补清单（按面试出现频率排序）

- [ ] 手写 `Promise.all` 的并发限制版（`promisePool`）
- [ ] 手写 `JSON.stringify` / `JSON.parse`（含 undefined、循环引用处理）
- [ ] 手写数组方法：`map` / `filter` / `reduce` / `flat` / `forEach`（面试官爱让「不调 API 实现」）
- [ ] 手写 `Object.create` / `Object.assign` / `Object.freeze`（浅冻结 vs 深冻结）
- [ ] 手写 `instanceof` 加强版 + 类型判断 `getType`（区分 array / null / date / regexp）
- [ ] 手写观察者模式（与发布订阅的区别：一个直接通知、一个经由事件中心）
- [ ] 手写简易虚拟 DOM diff（同层比较 + key 复用，能讲清 O(n) 复杂度）
- [ ] 手写大文件分片上传（含并发控制 + 断点续传 + 秒传校验）
- [ ] 手写 `async/await` 的 generator 自动执行器（`run(gen)`）
- [ ] 手写 `sleep` 的多种实现（Promise / async）+ 手写 `thunkify`
- [ ] 手写限流 / 防重复提交（token bucket、点击锁）
- [ ] 手写简易模板引擎（`{{name}}` 插值）
- [ ] 手写 `query` 解析 / `url` 参数拼接 / 驼峰下划线互转
- [ ] 手写深比较 `isEqual`（面试常问「怎么判断两个对象相等」）

## 与算法目录的关系

- 算法题（`solutions/`）练**思维和复杂度**，手撕 JS 练**语言功底和工程直觉**——两条线要并行推，别等算法刷完再补手撕。
- 时间分配建议：工作日各 1 道算法 + 1 道手撕；周末做一次限时模拟（算法 2 道 + 手撕 1 道，60 分钟）。
