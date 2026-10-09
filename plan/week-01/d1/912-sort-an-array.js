/**
 * 912. 排序数组（中等）★ 重写 · https://leetcode.cn/problems/sort-an-array/
 * 题干（旧题，在归档区）：archive/problems/sorting/912-sort-an-array.md
 * 已有答案（写完再对照，别提前翻）：archive/solutions/912-sort-an-array.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 第 1 周 D1 目标：盲写 冒泡 / 选择 / 插入 ────────────
 * 冒泡：____（相邻两两交换，每轮把最大值推到末尾；加 swapped 提前退出 → 有序时 O(n)）
 * 选择：____（每轮找最小值换到前面；交换次数固定 n-1 次，是最少的）
 * 插入：____（把当前元素插进已排好的前缀；近乎有序时接近 O(n)）
 * 稳定性：____（冒泡稳定、插入稳定；选择**不稳定**——请举一组反例）
 * 否掉：____（912 的规模是 5×10^4，这三个 O(n²) 必然 TLE，那今天练它们的理由是什么）
 * 易错：____（冒泡内层的上界；插入要先把当前值存出来再腾位置；选择别忘更新 minIndex）
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：LeetCode 入口 —— 返回升序数组（这三个都能通过示例，但 912 会 TLE；入口先转发给 bubbleSort） */
function sortArray(nums) {
  throw new Error('912 sortArray 未作答')
}

/** 作答区 2：冒泡排序（稳定、返回新数组、不改动入参） */
function bubbleSort(nums) {
  throw new Error('912 bubbleSort 未作答')
}

/** 作答区 3：选择排序（不稳定，但交换次数最少） */
function selectionSort(nums) {
  throw new Error('912 selectionSort 未作答')
}

/** 作答区 4：插入排序（近乎有序时最快） */
function insertionSort(nums) {
  throw new Error('912 insertionSort 未作答')
}

/** 测试素材：四个实现跑同一批场景 */
const CASES = [
  { name: '示例 1：[5,2,3,1]', args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
  { name: '示例 2：[5,1,1,2,0,0]（值可重复）', args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
  { name: '单元素', args: [[1]], expected: [1] },
  { name: '两个元素（逆序）', args: [[2, 1]], expected: [1, 2] },
  { name: '已排序（冒泡/插入的最快路径）', args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
  { name: '完全逆序', args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
  { name: '近乎有序（只有一对错位）', args: [[1, 2, 3, 5, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
  { name: '含负数与重复值', args: [[-1, 5, -3, 0, -1]], expected: [-3, -1, -1, 0, 5] },
  { name: '全相同', args: [[2, 2, 2, 2, 2]], expected: [2, 2, 2, 2, 2] },
]

// ── 以下不用改 ──────────────────────────────────────
const IMPLS = [
  ['sortArray（入口）', sortArray],
  ['bubbleSort（冒泡）', bubbleSort],
  ['selectionSort（选择）', selectionSort],
  ['insertionSort（插入）', insertionSort],
]

function runAll() {
  let pass = 0
  const total = IMPLS.length * CASES.length
  for (const [label, fn] of IMPLS) {
    for (const one of CASES) {
      const input = one.args[0].slice() // 每个用例一份新副本，避免原地排序互相污染
      try {
        const actual = fn(input)
        if (JSON.stringify(actual) === JSON.stringify(one.expected)) {
          pass++
          console.log(`✅ ${label} · ${one.name}`)
        } else {
          console.log(`❌ ${label} · ${one.name}\n   期望 ${JSON.stringify(one.expected)}\n   实际 ${JSON.stringify(actual)}`)
        }
      } catch (err) {
        console.log(`💥 ${label} · ${one.name} 抛错：${err.message}`)
      }
    }
  }
  console.log(`\n${pass}/${total} 通过`)
  if (pass < total) process.exitCode = 1
}

// 直接跑：node plan/week-01/d1/912-sort-an-array.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('912. 排序数组（D1：冒泡 / 选择 / 插入）', () => {
    for (const [label, fn] of IMPLS) {
      describe(label, () => {
        for (const one of CASES) {
          test(one.name, () => expect(fn(one.args[0].slice())).toEqual(one.expected))
        }
      })
    }
  })
}

module.exports = { sortArray, bubbleSort, selectionSort, insertionSort, CASES }
