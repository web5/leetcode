# 手撕 05 讲解：手写 Promise

> 同目录三个文件：
> - `05-promise.js` —— **你的作答文件**（D1 / D2 那两份各 5 个 check；D3 那份 9 个——多出的 4 个是 any / finally / allSettled）
> - `05-promise.reference.js` —— **学习参考实现**（分三块：状态机 / then 链 / 静态方法）+ 真机时序演示
> - 本文 —— 讲解
>
> 同题还有两份：`week-01/d2`（第 2 天 then 链）、`week-01/d3`（第 3 天 静态方法）。本讲解覆盖全部三天，写到哪份都回来看这里。
>
> 📌 **10-08 / 10-09 位置变更**：本题原排在第 2 周 D2/D3/D4；现已调成**连续三天，都在第 1 周**：**D1 状态机（`week-01/d1`）→ D2 then 链（`week-01/d2`）→ D3 静态方法（`week-01/d3`）**。原本占第 1 周 D1/D2/D3 的 01 防抖节流、02 call/apply/bind、03 new/instanceof 依次顺延到第 2 周 D2/D3/D4。
> 下文（含 §5、§8）里的「第 1 / 2 / 3 天」= `week-01/d1`、`week-01/d2`、`week-01/d3`。

## 0. 怎么用（按顺序，别跳）

1. **先跑演示**，把时序看进眼睛里：`node plan/week-01/d1/05-promise.reference.js`
2. 读第 1、2 节，把「then 的两条硬性规则」说顺——**这两条是这题的全部考点**。
3. 看第 3 节（四个进阶点），每个点都自己敲一遍。
4. 第 4 节的静态方法表，**先按表格默写语义，再看代码**。
5. 关掉这份讲解，回作答文件从零写；跑自测，红了再回来对照。

**重要提醒**：`week-01/d3` 那份作答文件是 **9 个 check**（D1 / D2 两份是前 5 个），覆盖从状态机到 `any / allSettled`。三天各一份（第 1 天 状态机 / 第 2 天 then 链 / 第 3 天 静态方法），当天还没写的部分自然是红的——**那是进度标记，不是写错了**。

---

## 1. 最小模型：三态状态机

Promise 的本质就是一个**只能迁移一次状态**的对象，外加一个回调队列。

```
        ┌──────────┐
        │ pending  │  ← 初始
        └────┬─────┘
     resolve │ reject
        ┌────┴─────┐
        ▼          ▼
  ┌──────────┐ ┌──────────┐
  │fulfilled │ │ rejected │   ← 之后任何 resolve/reject 都被忽略
  └──────────┘ └──────────┘
```

```js
constructor(executor) {
  this.state = PENDING
  this.value = undefined
  this.callbacks = []          // pending 期间攒下的 then 回调

  const resolve = (value) => this._settle(FULFILLED, value)
  const reject  = (reason) => this._settle(REJECTED, reason)

  try {
    executor(resolve, reject)  // executor 同步执行
  } catch (err) {
    reject(err)                // ★ 构造器里抛错 = 主动 reject，这是规范要求的
  }
}
```

要主动讲出来的三点：

1. `executor` 是**同步执行**的（`new Promise(() => console.log(1))` 会立刻打印 1）。
2. `try/catch` 包住 executor 是**必须的**——不包的话 `new Promise(() => { throw x })` 会把错误抛给调用方，而规范要求它变成 rejected 的 promise。
3. 状态迁移只能发生一次，所以 `_settle` 开头就是 `if (this.state !== PENDING) return`。

---

## 2. then 的两条硬性规则（全题考点）

### 规则一：回调**必须异步**执行

```js
then(onFulfilled, onRejected) {
  if (this.state === FULFILLED) queueMicrotask(() => onFulfilled(this.value))  // ★ 必须包一层
  else if (this.state === REJECTED) queueMicrotask(() => onRejected(this.value))
  else this.callbacks.push({ onFulfilled, onRejected })
}
```

**为什么不能同步调？** 两个理由，面试答出任意一个都算过关：

- 如果同步调，`p.then(cb)` 在 p 已结算时会立刻执行 `cb`，而 p 还是 pending 时会延后执行——**同一个 API 时早时晚**（业内叫 releasing Zalgo），调用方无法预测顺序。
- 规范要求「then 的回调永远排在当前同步代码之后」，这样才能保证 `a.then(); b;` 里 `b` 一定先执行，别人才能依赖这个顺序写代码。

**微任务 vs 宏任务**：这里用 `queueMicrotask`（也可以 `Promise.resolve().then`）。用 `setTimeout` 也能"异步"，但会掉到宏任务队列，时序就和原生 Promise 不一致了——对照演示第 ① 节能看到自己的实现和原生打印顺序一致。

### 规则二：`then` **返回新 promise**

```js
then(onFulfilled, onRejected) {
  const next = new MyPromise((resolve, reject) => {
    const cb = { onFulfilled, onRejected, resolve, reject }
    if (this.state === PENDING) this.callbacks.push(cb)
    else queueMicrotask(() => this._run(cb))   // 已结算：也要异步补一次
  })
  return next
}
```

`_run` 是核心，它决定了链式调用的行为：

```js
_run(cb) {
  const handler = this.state === FULFILLED ? cb.onFulfilled : cb.onRejected

  if (typeof handler !== 'function') {          // ← 值穿透
    if (this.state === FULFILLED) cb.resolve(this.value)
    else cb.reject(this.value)
    return
  }

  try {
    cb.resolve(handler(this.value))             // ← 返回值喂给下一个 promise
  } catch (err) {
    cb.reject(err)                              // ← 回调里抛错 = 下一个 promise rejected
  }
}
```

三句话总结 `_run`：**handler 不是函数就透传**、**返回值喂给下一个**、**抛错变成下一个的 reject**。

---

## 3. 四个进阶点（面试的追问都在这）

### ① 值穿透

`p.then().then(v => ...)` 中间的 `then` 不传 handler，值也要能传下去。实现就是上面 `typeof handler !== 'function'` 那个分支——**不写这个分支，中间空 then 会把值吃掉**。

### ② 抛错捕获

`then` 回调里 `throw` 不会往外扔，而是变成新 promise 的 rejected。所以 `try { cb.resolve(handler(...)) } catch (err) { cb.reject(err) }` 是必须的。

注意区分两个 catch 位置：

- `constructor` 里的 `try/catch` 管的是 **executor 同步抛错**；
- `_run` 里的 `try/catch` 管的是 **then 回调抛错**。

### ③ thenable 跟随（`resolve` 一个 promise 会怎样）

```js
_settle(state, value) {
  if (this.state !== PENDING) return

  if (state === FULFILLED && isThenable(value)) {
    value.then(                                   // ← 跟随它，而不是直接 fulfilled
      (v) => this._settle(FULFILLED, v),
      (r) => this._settle(REJECTED, r)
    )
    return
  }
  // …
}
```

这条正是 **`await` 能 await 任意 thenable** 的原因：`await x` 内部就是 `x.then(...)`。也是「手写 Promise 能被 `await`」的前提——所以作答文件里直接用 `await` 测你的实现是合法的。

### ④ 循环引用

```js
resolve: (v) =>
  v === next ? reject(new TypeError('Chaining cycle detected for promise')) : resolve(v),
```

`const p = MyPromise.resolve(1); const cyc = p.then(() => cyc)` —— 回调返回自己，规范要求抛 `TypeError`，而不是无限递归。演示第 ⑤ 节会打印这条。

---

## 4. 静态方法：语义 + 易错点

| 方法 | 何时成功 | 何时失败 | 结果顺序 | 最容易错的地方 |
| --- | --- | --- | --- | --- |
| `resolve(v)` | 立刻成功（v 是 promise 则跟随） | — | — | 忘了「已经是 MyPromise 就原样返回」（可用于去重） |
| `reject(r)` | — | 立刻失败 | — | 参数是 `(_, reject)` 别写错 |
| `all` | 全部成功 | **有一个失败就立刻失败** | **按入参顺序**，不是完成顺序 | 忘了按下标落位 `out[i] = v`；忘了空数组 `[]` 直接成功 |
| `allSettled` | **永不失败** | 永不 | 按入参顺序 | 每一项都要包成 `{ status, value/reason }`，不能直接透传 |
| `race` | 第一个**结算**的（成功或失败都算） | 同上 | 只取一个 | 误以为「第一个成功的」——那是 `any` |
| `any` | 第一个**成功**的 | **全部失败才失败** | 只取一个 | 全失败时的错误类型（原生是 `AggregateError`） |

`all` 的按下标落位写法（这是它和「顺序即完成顺序」的关键区别）：

```js
items.forEach((item, i) => {
  MyPromise.resolve(item).then((v) => {
    out[i] = v                       // ★ 按下标写回
    done += 1
    if (done === items.length) resolve(out)
  }, reject)
})
```

---

## 5. 三天怎么分配（对应计划）

| 天（文件） | 目标 | 当天能绿的 check | 为什么是这几个 |
| --- | --- | --- | --- |
| 第 1 天 · `week-01/d1` | **状态机**：三态 + 状态只迁移一次 + executor 同步执行 | **第 1 个** | 它直接把你的 promise 交给 `withDeadline`，不依赖 `then` 的返回值 |
| 第 2 天 · `week-01/d2` | **then 链**：`then` 返回新 promise、值穿透、抛错捕获 | **第 2、3 个** | 都要 `then` / `catch` 返回新 promise，才拿得到链式结果 |
| 第 3 天 · `week-01/d3` | **静态方法**：resolve / reject / all / race / any / allSettled | **第 4–9 个** | 需要静态方法（第 6–9 个只在 D3 那份文件里） |

> ⚠️ **最容易误判的一点**：d2 只写了「`then` 里 `queueMicrotask` 调回调」时，第 2、3 个 check 会报 **`期望 undefined，实际…` 或「必须返回一个新的 Promise」** —— 那个 `undefined` 是 **`then` 的返回值**（第 1 层没有 `return`），不是 promise 里存的值丢了。状态机写对了也会这样，别去改 `resolve`。
> 判据：`console.log(p.then(() => {}))` 打印 `undefined` ⇒ 还停在第 1 层，该写 d3 的「返回新 promise」了。

建议：每天开工先跑一次 `node plan/week-01/d1/05-promise.js`，看今天要"点亮"哪几个。

---

## 6. 易错点清单（写完自查）

- [ ] `then` 里直接同步调 handler（**最高频错误**），导致回调早于后面注册的同步代码。
- [ ] `then` 不返回新 promise → 链式直接崩。
- [ ] 忘了值穿透分支，`p.then().then(fn)` 里 `fn` 收不到值。
- [ ] `_run` 里没包 `try/catch`，then 回调抛错直接冒泡到外面。
- [ ] `resolve(thenable)` 没做「跟随」，直接把 promise 对象当成值 fulfilled 了。
- [ ] 状态可以迁移两次（`new Promise((res) => { res(1); res(2) })` 应该只有 1 生效）。
- [ ] `all` 用「完成计数」却没按下标落位，结果顺序变成完成顺序。
- [ ] `constructor` 里忘了 `try/catch`，`new Promise(() => { throw x })` 变成同步抛错。
- [ ] 用 `setTimeout` 代替微任务，时序与原生不一致。
- [ ] 不处理循环引用，`p.then(() => p)` 死循环/爆栈。

---

## 7. 面试口述模板（60 秒）

> 「Promise 的本质是**三态状态机 + 回调队列**。状态只能从 pending 迁移一次。
> `then` 有两条硬性要求：回调**必须异步**（我用 `queueMicrotask`，保证时序和原生一致），以及**必须返回新 promise**——这样才可能链式。
> 链式的核心是 `_run`：handler 不是函数就**值穿透**，返回值喂给下一个 promise，回调里抛错则把下一个变成 rejected。
> `resolve` 一个 thenable 时会**跟随**它，这也是 `await` 能 await 任意 thenable 的原因；返回值是自己时按规范抛 `TypeError`。
> 静态方法里 `all` 要**按下标落位**保证顺序、有一个失败就整体失败；`allSettled` 永不失败；`race` 取第一个结算的；`any` 取第一个成功的、全失败才失败。」

---

## 8. 自测在验什么（`week-01/d3/05-promise.js` 的 9 个 check；D1 / D2 两份是前 5 个）

| # | check | 验的是什么 | 属于第几天 |
| --- | --- | --- | --- |
| 1 | then 回调是异步的（晚于同步代码） | **规则一**；用 `order` 数组对比 `sync` 与 `then` 的先后 | 第 1 天 |
| 2 | 链式 then 与值透传 | **规则二**；`resolve(1).then(+1).then(*10)` 应为 20 | 第 2 天 |
| 3 | 构造函数内抛错 → 走 catch | `try/catch` 包 executor（断言依赖 `catch` 返回 promise） | 第 2 天 |
| 4 | 静态方法 resolve / all（保持入参顺序） | `resolve` 跟随 + `all` 按下标落位（含一个原生 promise 混入） | 第 3 天 |
| 5 | 静态方法 race（取最先结算的） | `race` 的「结算」语义（慢的 80ms vs 立刻 resolve） | 第 3 天 |
| 6 | 静态方法 any：第一个成功就成功 | **any 的结算语义**：慢的 50ms vs 立刻成功，中间那个失败被忽略 | 第 3 天 |
| 7 | 静态方法 any 全失败 → AggregateError | **errors 按入参下标排列**（不是「谁先失败」）；用 `push` 就会写反 | 第 3 天 |
| 8 | finally：不改变结论，保留原 rejection 原因 | 规范要求 `onFinally()` 返回非 thenable 时**原结果原样穿过**，不能被它顶掉 | 第 3 天 |
| 9 | 静态方法 allSettled：全部出结果、永不失败 | 每项 `{status,value}` / `{status,reason}`，且按下标 | 第 3 天 |

### 自己补 reject 用例时怎么写（原第 6–8 个 check 已按你的要求删掉，套路留在这里）

三个要点，缺一个就会得到误导性的失败信息：

1. **`await` 一个 rejected 的 promise 会「抛」**，把 `run` 直接判失败。所以要么用 `.then(_, onRejected)` / `.catch()` 把失败**转成值**，要么用 `try/catch` 主动接住。
2. **要验「确实抛了」**，别直接断言 `caught.message`——如果实现把 reject 丢了，`caught` 是 `null`，你会看到「Cannot read properties of null」这种看不出病因的错误。先断言 `caught !== null`。
3. **resolve / reject 一起测，测的是「互斥」**：同一个 promise 只有第一次 `resolve`/`reject` 生效。这是状态机最容易写错的地方（忘了 `if (state !== PENDING) return`，后一次就会覆盖前一次）。

> 每个 check 外面套了 800ms 的超时护栏（`withDeadline`）：实现有 bug 卡住时不会永久挂起，而是报「800ms 内未结算」；参数不是 thenable 时（比如 `then` 忘了 `return`）会直接报出「必须返回一个新的 Promise」。

---

## 9. 深水区（有余力再看）

- **A+ 规范的 2.3 节**（Promise Resolution Procedure）是整个规范最长的部分，讲的就是 `_settle` 里「跟随 thenable」那几十行；能手写出来就是 A+ 通过。
- **`then` 可被多次调用**：同一个 promise 注册多个 then，应该都执行（所以用 `callbacks` 数组，而不是单个 handler）。
- **`queueMicrotask` 的替代**：`Promise.resolve().then(fn)`、Node 的 `process.nextTick`（它是**先于**微任务的队列，别混用）。
- **`async/await` 与 thenable**：`await` 只认 `then`，所以手写 Promise 能直接被 `await`。
- **未处理的 rejection**：原生有 `unhandledrejection` 事件 / `process.on('unhandledRejection')`，手写版要自己加。
- **与 `AbortController` 结合**：Promise 本身不可取消，取消要靠外部信号（对应手撕 11 的追问）。
