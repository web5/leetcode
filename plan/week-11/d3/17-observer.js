/**
 * 手撕 17：观察者模式（与发布订阅的区别是高频追问）
 * 参考实现：无（对照 06-event-emitter.js：那是发布订阅）
 * 排期：第 11 周 D3
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 口述笔记 ───────────────────────────────────────────
 * 观察者 vs 发布订阅一句话：____（前者目标**直接持有**观察者；后者经由事件中心解耦，双方互不认识）
 * 谁维护订阅关系：____（Subject 内部数组 vs 事件中心 Map）
 * 通知时为什么要快照遍历：____（回调里退订会导致漏通知或死循环）
 * 追问：Vue2 的 Dep/Watcher 属于哪一类；响应式里「依赖收集」怎么落在这套结构上
 * 本文件约定：observer 可以是 { update(data) }，也可以直接是函数
 * ─────────────────────────────────────────────────
 */

/** 作答区：目标对象 Subject（subscribe / unsubscribe / notify） */
class Subject {
  subscribe(observer) {
    throw new Error('17 subscribe 未作答')
  }

  unsubscribe(observer) {
    throw new Error('17 unsubscribe 未作答')
  }

  notify(data) {
    throw new Error('17 notify 未作答')
  }
}

/** 自测素材 */
const CHECKS = [
  {
    name: 'subscribe + notify：对象型与函数型观察者都收到 data',
    run: async () => {
      const subject = new Subject()
      const got = []
      subject.subscribe({ update: (d) => got.push(`obj:${d}`) })
      subject.subscribe((d) => got.push(`fn:${d}`))
      subject.notify('A')
      assertEqual(got, ['obj:A', 'fn:A'], '观察者未全部收到通知（函数型也要支持）')
    },
  },
  {
    name: 'unsubscribe：精确移除指定观察者',
    run: async () => {
      const subject = new Subject()
      const got = []
      const a = { update: () => got.push('a') }
      const b = { update: () => got.push('b') }
      subject.subscribe(a)
      subject.subscribe(b)
      subject.unsubscribe(a)
      subject.notify('x')
      assertEqual(got, ['b'], '被移除的观察者不该再收到通知')
    },
  },
  {
    name: 'notify 期间 unsubscribe 不影响本轮遍历（快照）',
    run: async () => {
      const subject = new Subject()
      const got = []
      const second = () => got.push('second')
      subject.subscribe(() => {
        got.push('first')
        subject.unsubscribe(second)
      })
      subject.subscribe(second)
      subject.notify('y')
      assertEqual(got, ['first', 'second'], '本轮应遍历进入时的快照')
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

// 直接跑：node plan/handwritten/17-observer.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('手撕 17 观察者模式', () => {
    for (const one of CHECKS) test(one.name, one.run)
  })
}

module.exports = { Subject }
