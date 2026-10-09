/**
 * 手撕 09：数组与字符串工具（千分位 / 大数相加 / 去重 / 打平 / 洗牌）
 * 参考实现（写完再对照）：archive/handwritten/array-utils.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 大数相加为什么不能 Number 相加：____（精度丢失，超过 2^53 就不准）
 * 千分位用正则怎么分组：____（/\B(?=(\d{3})+$)/g）
 * 洗牌要等概率：____（Fisher-Yates，从后往前随机交换；不要用 sort(() => Math.random() - 0.5)）
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：flatten —— 默认完全打平（支持传入深度可选） */
function flatten(arr, depth = Infinity) {
  throw new Error('09 flatten 未作答')
}

/** 作答区 2：uniqueBy —— 按 key 去重，保留首次出现的元素 */
function uniqueBy(arr, key) {
  throw new Error('09 uniqueBy 未作答')
}

/** 作答区 3：bigAdd —— 两个非负整数字符串相加，返回字符串 */
function bigAdd(a, b) {
  throw new Error('09 bigAdd 未作答')
}

/** 作答区 4：thousandSeparator —— 1234567 → '1,234,567' */
function thousandSeparator(num) {
  throw new Error('09 thousandSeparator 未作答')
}

/** 作答区 5：shuffle —— Fisher-Yates，返回新数组（不改入参） */
function shuffle(arr) {
  throw new Error('09 shuffle 未作答')
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'flatten：多层打平',
    run: async () => {
      assertEqual(flatten([1, [2, [3, [4]]]]), [1, 2, 3, 4], '完全打平')
      assertEqual(flatten([1, [2, [3]]], 1), [1, 2, [3]], 'depth=1 只打平一层')
    },
  },
  {
    name: 'uniqueBy：按 key 去重且保留首次出现',
    run: async () => {
      const out = uniqueBy([{ id: 1, n: 'a' }, { id: 1, n: 'b' }, { id: 2 }], 'id')
      assertEqual(out, [{ id: 1, n: 'a' }, { id: 2 }], '应保留第一次出现的元素')
    },
  },
  {
    name: 'bigAdd：逐位进位',
    run: async () => {
      assertEqual(bigAdd('123', '456'), '579', '普通相加')
      assertEqual(bigAdd('999', '1'), '1000', '连续进位')
      assertEqual(bigAdd('0', '0'), '0', '全 0')
      assertEqual(bigAdd('9007199254740991', '1'), '9007199254740992', '超出 Number.MAX_SAFE_INTEGER')
    },
  },
  {
    name: 'thousandSeparator：千分位',
    run: async () => {
      assertEqual(thousandSeparator(1234567), '1,234,567', '七位数')
      assertEqual(thousandSeparator(123), '123', '不足四位不加分隔')
      assertEqual(thousandSeparator(1000), '1,000', '刚好四位')
    },
  },
  {
    name: 'shuffle：元素不丢不增，且不修改入参',
    run: async () => {
      const src = Array.from({ length: 20 }, (_, i) => i)
      const out = shuffle(src)
      assertEqual([...out].sort((a, b) => a - b), src, '洗牌后元素集合应不变')
      assertEqual(src, Array.from({ length: 20 }, (_, i) => i), '不应修改入参')
    },
  },
]

// ── 以下不用改 ──────────────────────────────────────────
function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${label}：期望 ${e}，实际 ${a}`)
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runAll() {
  let pass = 0
  for (const one of CHECKS) {
    try {
      await one.run()
      pass += 1
      console.log(`✅ ${one.name}`)
    } catch (err) {
      console.log(`❌ ${one.name}\n   ${err.message}`)
    }
  }
  console.log(`\n${pass}/${CHECKS.length} 通过`)
  if (pass < CHECKS.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d6/09-array-utils.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 09 数组与字符串工具', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { flatten, uniqueBy, bigAdd, thousandSeparator, shuffle }
