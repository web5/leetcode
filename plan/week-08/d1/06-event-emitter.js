/**
 * 手撕 06：事件总线 EventEmitter
 * 参考实现（写完再对照）：archive/handwritten/event-emitter.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * on / once / off / emit 四个方法各自的坑：____
 * emit 里为什么要「快照遍历」监听器数组：____（防止回调中 off/on 导致跳过或死循环）
 * once 怎么精确移除：____（包一层 wrapper，off 时按原函数索引）
 * 与发布订阅的区别：____（事件总线是「直接通知」，发布订阅经由事件中心解耦）
 * ─────────────────────────────────────────────────
 */

/** 作答区：事件总线。on 可返回取消函数（也可以只实现 off，本文件两种都兼容） */
class EventEmitter {
  on() { throw new Error('06 on 未作答') }
  once() { throw new Error('06 once 未作答') }
  off() { throw new Error('06 off 未作答') }
  emit() { throw new Error('06 emit 未作答') }
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'on + emit：触发监听器并透传参数',
    run: async () => {
      const bus = new EventEmitter()
      const got = []
      bus.on('a', (x) => got.push(x))
      bus.emit('a', 1)
      bus.emit('a', 2)
      assertEqual(got, [1, 2], 'on / emit 行为不对')
    },
  },
  {
    name: 'once：只触发一次',
    run: async () => {
      const bus = new EventEmitter()
      let n = 0
      bus.once('x', () => { n += 1 })
      bus.emit('x')
      bus.emit('x')
      assertEqual(n, 1, 'once 应只触发一次')
    },
  },
  {
    name: '取消监听：on 返回取消函数或实现 off（两种都认）',
    run: async () => {
      const bus = new EventEmitter()
      const got = []
      const h = () => got.push('h')
      const cancel = bus.on('e', h)
      bus.on('e', () => got.push('other'))
      if (typeof bus.off === 'function') bus.off('e', h)
      else if (typeof cancel === 'function') cancel()
      else throw new Error('on 既没返回取消函数，也没实现 off')
      bus.emit('e')
      assertEqual(got, ['other'], '被取消的监听器不该触发，其它监听器应正常触发')
    },
  },
  {
    name: '监听器内部 off 不会导致漏触发（快照遍历）',
    run: async () => {
      const bus = new EventEmitter()
      const got = []
      const second = () => got.push('second')
      bus.on('s', () => { got.push('first'); if (typeof bus.off === 'function') bus.off('s', second) })
      bus.on('s', second)
      bus.emit('s')
      assertEqual(got, ['first', 'second'], '本次 emit 应遍历的是进入时的快照')
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

// 直接跑：node plan/handwritten/06-event-emitter.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 06 事件总线', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { EventEmitter }
