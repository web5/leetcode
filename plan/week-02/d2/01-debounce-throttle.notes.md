# 手撕 01 讲解：防抖 debounce / 节流 throttle

> 同目录的三个文件：
> - `01-debounce-throttle.js` —— **你的作答文件**（写完跑它看 ✅/❌）
> - `01-debounce-throttle.reference.js` —— **学习用的参考实现**（分层 + 时间线演示，可 `node` 直接跑）
> - 本文 —— 讲解

## 0. 怎么用（按顺序，别跳）

1. **先跑演示**，用眼睛看到差别：`node plan/week-02/d2/01-debounce-throttle.reference.js`
2. 读第 1 节，把「一句话差别」说顺——这是面试第一句，说不清后面全崩。
3. 看第 2、3 节的分层代码，**每看一层就合上文件，自己敲一遍**（只敲那一层，不要整份抄）。
4. 看第 4、5 节（对比表 + 常见误答），然后**关掉这份讲解**，回作答文件从零写。
5. 跑自测（`node plan/week-02/d2/01-debounce-throttle.js`），红了再回来对照。**别一边看一边写**。

---

## 1. 一句话差别

| | 防抖 debounce | 节流 throttle |
| --- | --- | --- |
| 执行时机 | 触发**停止** wait 毫秒后执行一次（要求「静默」） | 距上次执行**满** wait 毫秒就执行（不看是否还在触发） |
| 连续触发 10 次（间隔 < wait） | 只执行 **1 次**（最后那次） | 大约每 wait 执行 **1 次**（可能 2～3 次） |
| 典型场景 | 搜索框联想、表单校验、窗口 resize 后重排 | 滚动监听、拖拽、鼠标移动、埋点上报 |

**判断口诀**：用户会停下来 → 防抖；用户一直在动但我不能太频繁 → 节流。

---

## 2. 防抖：四层递进（对应面试官的四个追问层次）

面试节奏是「先给能跑的，再按追问加东西」。**不要一上来就写完整版**——面试官想看你的推导顺序。

### 第 1 层：骨架（能跑就行）

```js
function debounce(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer !== null) clearTimeout(timer)   // 核心就这一行：重新计时
    timer = setTimeout(() => fn(...args), wait)
  }
}
```

要主动讲的两点：① 用**闭包**保存 `timer`，保证每次调用看到同一个定时器 id；② `clearTimeout` 是把「上一次的预约」取消掉——第一次调用时 `timer` 是 `null`，`clearTimeout(null)` 无害，所以那一行可以不加判断，但加上更能体现边界意识。

### 第 2 层：透传 this 与参数（追问「对象方法调用时呢」）

```js
return function (...args) {
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    fn.apply(this, args)     // ← 箭头函数里 this = debounced 被调用时的 this
  }, wait)
}
```

两个坑：

- 定时器回调**不要**用 `function () { fn.apply(this) }`：那时候 `this` 已经不是调用方了（浏览器是 window / 严格模式是 undefined）。
- `timer = null` 要在真正执行时置空，否则你无法判断「当前有没有挂着的定时器」——第 3 层的 `leading` 就依赖这个判断。

### 第 3 层：leading / trailing 两个开关（追问「首次要不要立刻执行」）

```js
function debounce(fn, wait, { leading = false, trailing = true } = {}) {
  let timer = null
  let lastArgs = null
  let lastThis = null

  const invokeTrailing = () => {
    timer = null
    if (!trailing || lastArgs === null) return
    const args = lastArgs
    const ctx = lastThis
    lastArgs = null
    lastThis = null
    fn.apply(ctx, args)
  }

  function debounced(...args) {
    const callNow = leading && timer === null   // 没有挂着的定时器 = 一个 burst 的开始

    lastArgs = args
    lastThis = this

    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(invokeTrailing, wait)

    if (callNow) {
      lastArgs = null   // 已经立刻执行过，攒的参数清掉，避免 trailing 再补一次
      lastThis = null
      fn.apply(this, args)
    }
  }
  // …
}
```

四种组合的语义，要能背下来：

| leading | trailing | 首次 | 停止后 | 典型用途 |
| --- | --- | --- | --- | --- |
| false | true | 不执行 | 补一次（**默认**） | 搜索框联想 |
| true | true | 立刻执行 | 再补一次 | 按钮防连点（首点要有反馈，尾次又要保证发出） |
| true | false | 立刻执行 | 不补 | 只关心第一次（如首次曝光埋点） |
| false | false | — | — | 没意义 |

### 第 4 层：cancel / flush（追问「组件卸载时挂起的调用怎么办」）

```js
debounced.cancel = () => {
  if (timer !== null) clearTimeout(timer)
  timer = null
  lastArgs = null
  lastThis = null
}

debounced.flush = () => {
  if (timer === null) return
  clearTimeout(timer)
  invokeTrailing()   // 立刻把挂起的那次执行掉
}
```

场景：路由离开 / 组件卸载要 `cancel`（避免对已销毁的组件 setState）；输入框失焦要 `flush`（保证最后一次输入的数据真的提交了）。

---

## 3. 节流：三种写法，行为不一样（这是高频追问）

```js
// A. 时间戳版：首次立即执行；最后一次「不补」—— 尾部会丢
function throttleByTimestamp(fn, wait) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
    // 不满足就丢弃这次调用
  }
}

// B. 定时器版：首次「延迟」执行；最后一次「会补」—— 头部会丢
function throttleByTimer(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer !== null) return
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, wait)
  }
}

// C. 两者结合（leading + trailing）—— 工程里最常用，也是本题作答的默认口径
//    见 reference.js 里的 throttle()
```

| 写法 | 首次 | 最后一次 | 什么时候用 |
| --- | --- | --- | --- |
| A 时间戳 | 立即 | **丢** | 只关心实时响应（拖拽中的位置更新） |
| B 定时器 | 延迟 wait | **补** | 只关心最终状态（滚动到底部加载） |
| C 结合 | 立即 | 补 | 两者都想要（绝大多数业务） |

自己实现 C 时最容易踩的坑：**冷却期结束后立刻执行时，要把挂着的尾部定时器清掉**，否则会多执行一次。

---

## 4. 一个常见误答（能指出这点会很加分）

> 「节流就是 leading + trailing 的防抖。」

**严格说不对。** 两者共享「用定时器/时间戳把高频调用压缩」的思路，但触发条件不同：

- 防抖的 trailing 要求**静默 wait**——你一直触发，它就**一直不执行**；
- 节流只看「距上次执行是否满 wait」——你一直触发，它**照样每 wait 执行一次**。

反例：以 wait=100ms 持续触发 1000ms。
- `debounce(leading:true, trailing:true)`：只在 t=0 执行 1 次（结束之后再补 1 次），中间**一直是静默吞掉**的。
- `throttle`：t=0、100、200…900 大约执行 10 次。

---

## 5. 易错点清单（写完自查）

- [ ] 定时器回调用了普通函数，`this` 丢了（该用箭头函数包起来）。
- [ ] 忘了在真正执行时把 `timer = null`，导致 `leading` 判断永远为 false。
- [ ] `leading: true` 时没清掉攒下的参数，导致开头的调用**被执行两次**（一次立即、一次 trailing）。
- [ ] 节流实现里冷却结束立刻执行时，没有 `clearTimeout` 掉尾部定时器 → 多执行一次。
- [ ] `clearTimeout(null)` 虽然无害，但主动说明「第一次 timer 为 null」更显边界意识。
- [ ] 完全没有 `cancel`——面试官问「组件卸载了但还有挂起的调用怎么办」时就答不上来了。

---

## 6. 面试口述模板（60 秒版，每天挑一题练说）

> 「这题考的是**用闭包把高频调用压缩**。两者差别是：防抖要求**静默**，停止触发 wait 毫秒后才执行；节流只看**距上次执行**是否满 wait。
> 我先写最简版：闭包存 `timer`，每次调用先 `clearTimeout` 再 `setTimeout`，这样只有最后一次会落地。
> 追问 this 的话，用箭头函数包住定时器回调，再 `fn.apply(this, args)`。
> 追问首次要不要执行，就加 `leading/trailing` 两个开关，用「当前有没有挂着的 timer」判断是不是一个 burst 的开始。
> 追问卸载场景，就再提供 `cancel` 和 `flush`：前者丢弃挂起调用，后者立刻结算。
> 复杂度是 O(1) 时间和空间，每个事件只做一次 `clearTimeout + setTimeout`。」

---

## 7. 自测在验什么（`01-debounce-throttle.js` 的 4 个 check）

| check | 验的是什么 |
| --- | --- |
| 防抖：连续调用只执行一次（trailing） | 基础语义 + 默认 `leading:false / trailing:true` |
| 防抖：透传最后一次调用的 this 与参数 | 第 2 层；`obj.fn(1)` 再 `obj.fn(2,3)` → 应拿到 `this=obj, args=[2,3]` |
| 节流：首次立即执行（leading） | 默认 `leading:true` |
| 节流：冷却期内合并、结束时补一次；冷却过后可再次立即执行 | `trailing` 补齐 + 冷却结束后恢复立即执行 |

> 定时器类断言天然有抖动，所以用例里的等待窗口放得很宽（`wait=40ms`，断言前 `await wait(150)`），失败信息会告诉你期望几次、实际几次。

---

## 8. 想再深入的追问（有余力再看）

- **lodash 的差别**：lodash 的 `debounce` 多一个 `maxWait`（保证最长等待时间，长时间连续触发也会执行一次）；`throttle` 内部就是用 `debounce` + `maxWait` 实现的——这才是「两者关系」的正确说法。
- **raf 版节流**：用 `requestAnimationFrame` 代替定时器，保证每帧最多一次，视觉最顺滑（滚动动画场景）。
- **取消异步结果**：防抖/节流只压调用频率，不取消已发出的请求；要取消得配 `AbortController`（对应手撕 11 的追问）。
- **`this` 与返回值**：完整版可以让 `debounced` 返回 Promise，`flush()` 时 resolve，便于 `await` 收尾。
