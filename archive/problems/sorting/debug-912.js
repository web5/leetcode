// 快排，原地版本（debug-912）

/* ---------------------------------------------------------------
 * 计数器：只做统计，不影响算法结果
 * --------------------------------------------------------------- */
function makeCtx() {
  return { compare: 0, swap: 0, calls: 0, maxDepth: 0 }
}

/* 交换 arr[i] / arr[j]，顺带记账 */
function swapAt(arr, i, j, ctx) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
  if (ctx) ctx.swap++
}

/* 可复现的伪随机数（mulberry32），让「随机基准」每次跑出来一致 */
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------------------------------------------------------------
 * 1) 固定基准：取区间末位 arr[high] 作 pivot（Lomuto 分区）
 *    ctx 可选，仅用于统计
 * --------------------------------------------------------------- */
function partition(arr, low, high, ctx) {
  const pivot = arr[high]
  let i = low - 1
  for (let j = low; j < high; j++) {
    if (ctx) ctx.compare++
    if (arr[j] < pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      if (ctx) ctx.swap++
    }
  }
  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
  if (ctx) ctx.swap++
  return i + 1
}

/* ---------------------------------------------------------------
 * 2) 随机基准：先把区间内随机一个元素换到末位，再复用上面的 Lomuto
 *    —— 只多 1 次交换，分区主体逻辑完全不变
 * --------------------------------------------------------------- */
function partitionRandom(arr, low, high, ctx, rand) {
  const k = low + Math.floor(rand() * (high - low + 1))
  swapAt(arr, k, high, ctx)
  return partition(arr, low, high, ctx)
}

/* ---------------------------------------------------------------
 * 3) 三数取中：在 arr[low] / arr[mid] / arr[high] 里取「值居中」的那个
 *    先给这三个位置排好序，此时中位数落在 mid，再换到末位交给 Lomuto
 *    —— 与随机基准同样只动基准位置，分区主体逻辑不变
 * --------------------------------------------------------------- */
function partitionMedianOfThree(arr, low, high, ctx) {
  const mid = low + ((high - low) >> 1)
  if (ctx) ctx.compare += 3 // 选基准本身要付的 3 次比较
  if (arr[mid] < arr[low]) swapAt(arr, low, mid, ctx)
  if (arr[high] < arr[low]) swapAt(arr, low, high, ctx)
  if (arr[high] < arr[mid]) swapAt(arr, mid, high, ctx)
  // 现在 arr[low] <= arr[mid] <= arr[high]，中位数就在 mid
  swapAt(arr, mid, high, ctx)
  return partition(arr, low, high, ctx)
}

/* ---------------------------------------------------------------
 * 快排主过程
 *   opts.pivot : 'last'（固定末位）| 'random'（随机）| 'mot'（三数取中）
 *   opts.ctx   : 计数器容器（makeCtx()）
 *   opts.trace : true = 打印每次递归的 [low, high, p]
 *   opts.rand  : 随机数发生器
 * --------------------------------------------------------------- */
function quickSortInPlace(arr, low = 0, high = arr.length - 1, opts = {}) {
  const { pivot = 'last', ctx = null, trace = false, depth = 0, rand = Math.random } = opts

  if (ctx) {
    ctx.calls++
    if (depth > ctx.maxDepth) ctx.maxDepth = depth
  }

  if (low >= high) {
    if (trace) console.log(`${frame(depth, low, high)}  空区间/单元素，直接返回`)
    return arr
  }

  const p =
    pivot === 'random'
      ? partitionRandom(arr, low, high, ctx, rand)
      : pivot === 'mot'
        ? partitionMedianOfThree(arr, low, high, ctx)
        : partition(arr, low, high, ctx)

  if (trace) console.log(`${frame(depth, low, high, p)}  pivot=${arr[p]}`)

  quickSortInPlace(arr, low, p - 1, { ...opts, depth: depth + 1 })
  quickSortInPlace(arr, p + 1, high, { ...opts, depth: depth + 1 })
  return arr
}

function frame(depth, low, high, p) {
  const indent = '│  '.repeat(depth)
  return p === undefined
    ? `${indent}└─ [low=${low}, high=${high}]`
    : `${indent}├─ [low=${low}, high=${high}, p=${p}]`
}

const isSorted = (a) => a.every((v, i) => i === 0 || a[i - 1] <= v)

/* 跑一个用例：返回排序结果 + 统计 + 耗时 */
function runCase(input, pivot, seed) {
  const arr = [...input]
  const ctx = makeCtx()
  const opts = { pivot, ctx }
  if (pivot === 'random') opts.rand = mulberry32(seed)
  const t0 = Date.now()
  quickSortInPlace(arr, 0, arr.length - 1, opts)
  return { arr, ctx, ms: Date.now() - t0 }
}

/* ==================== Demo 1：三种基准的正确性 ==================== */
const raw = [12, 3, 4, 51, 2, 11, 23, 1, -12]
const asc10 = Array.from({ length: 10 }, (_, i) => i + 1)

console.log(`=== Demo 1：排序结果（输入 ${raw.join(', ')}） ===`)
console.log('期望：  ', [...raw].sort((a, b) => a - b).join(', '))
for (const p of ['last', 'random', 'mot']) {
  const r = runCase(raw, p, 42)
  console.log(`${p.padEnd(8)}`, r.arr.join(', '), isSorted(r.arr) ? '✓' : '✗')
}
console.log()

/* ============ Demo 2：固定基准最坏输入的递归帧 [low, high, p] ============ */
console.log('=== Demo 2：固定基准 + 已升序 [1..10]（观察退化） ===')
const ctx2 = makeCtx()
quickSortInPlace([...asc10], 0, asc10.length - 1, { pivot: 'last', ctx: ctx2, trace: true })
console.log(
  `小计：比较=${ctx2.compare} 交换=${ctx2.swap} 调用=${ctx2.calls} 最大递归深度=${ctx2.maxDepth}`
)
console.log()

/* ============ Demo 3：同一输入、三种基准的代价对比 ============ */
const N = 2000
const ascending = Array.from({ length: N }, (_, i) => i + 1)

console.log(`=== Demo 3：n=${N} 已升序数组 ===`)
console.log(
  'pivot'.padEnd(9),
  'compare'.padEnd(10),
  'swap'.padEnd(10),
  'depth'.padEnd(8),
  'time'
)
for (const p of ['last', 'random', 'mot']) {
  const r = runCase(ascending, p, 1)
  console.log(
    p.padEnd(9),
    String(r.ctx.compare).padEnd(10),
    String(r.ctx.swap).padEnd(10),
    String(r.ctx.maxDepth).padEnd(8),
    `${r.ms}ms`.padEnd(8),
    isSorted(r.arr) ? '✓' : '✗'
  )
}
console.log()

/* ============ Demo 4：三数取中在同一输入上的递归帧 ============ */
console.log('=== Demo 4：三数取中 + 已升序 [1..10]（对比 Demo 2） ===')
const ctx4 = makeCtx()
quickSortInPlace([...asc10], 0, asc10.length - 1, { pivot: 'mot', ctx: ctx4, trace: true })
console.log(
  `小计：比较=${ctx4.compare} 交换=${ctx4.swap} 调用=${ctx4.calls} 最大递归深度=${ctx4.maxDepth}`
)
