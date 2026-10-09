/**
 * 912. 排序数组（中等）★ 重写 · https://leetcode.cn/problems/sort-an-array/
 * 题干（旧题，在归档区）：archive/problems/sorting/912-sort-an-array.md
 * 已有答案（写完再对照，别提前翻）：archive/solutions/912-sort-an-array.js · archive/tests/912-sort-an-array.test.js
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 第 1 周 D2 目标：盲写 归并 + 三路快排（含随机 pivot）────────────
 * 归并：____（分治 + 合并；稳定；O(n) 额外空间；为什么「先分到底，再在返回的路上合并」）
 * 三路快排：____（< = > 三段；随机 pivot 规避最坏 O(n²)；重复值多时为什么比二路快）
 * 否掉：____（为什么这题不用插入 / 冒泡？为什么全是重复值时二路快排会退化？）
 * 易错：____（归并临时数组的下标；快排的边界与死循环；随机 pivot 后别把 pivot 位置写死）
 * ─────────────────────────────────────────────────
 */

/** 作答区 1：LeetCode 入口 —— 返回升序数组（这题把 sortArray 转发给 mergeSort 即可） */
function sortArray(nums) {
  throw new Error('912 sortArray 未作答')
}

/** 作答区 2：归并排序（稳定、返回新数组、不改动入参） */
function mergeSort(nums) {
  throw new Error('912 mergeSort 未作答')
}

/** 作答区 3：三路快排（< = > 三段 + 随机 pivot）。
 *  返回新数组、或在副本上原地排都行——自测每个用例都会给一份新副本，别改动传进来的那个。 */
function quickSort(nums) {
  throw new Error('912 quickSort 未作答')
}

/** 测试素材：三个实现跑同一批场景（保证行为一致） */
const CASES = [
  { name: '示例 1：[5,2,3,1]', args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
  { name: '示例 2：[5,1,1,2,0,0]（值可重复）', args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
  { name: '空数组', args: [[]], expected: [] },
  { name: '单元素', args: [[1]], expected: [1] },
  { name: '两个元素（逆序）', args: [[2, 1]], expected: [1, 2] },
  { name: '已排序', args: [[1, 2, 3]], expected: [1, 2, 3] },
  { name: '完全逆序', args: [[3, 2, 1]], expected: [1, 2, 3] },
  { name: '含负数与重复值', args: [[-1, 5, -3, 0, -1]], expected: [-3, -1, -1, 0, 5] },
  { name: '全相同（三路快排的考点）', args: [[2, 2, 2, 2, 2]], expected: [2, 2, 2, 2, 2] },
  { name: '大量重复值', args: [[3, 1, 3, 1, 3, 1, 2]], expected: [1, 1, 1, 2, 3, 3, 3] },
]

// ── 以下不用改 ──────────────────────────────────────
const IMPLS = [
  ['sortArray（入口）', sortArray],
  ['mergeSort（归并）', mergeSort],
  ['quickSort（三路快排）', quickSort],
]

function runAll() {
  let pass = 0
  const total = IMPLS.length * CASES.length
  for (const [label, fn] of IMPLS) {
    for (const one of CASES) {
      const input = one.args[0].slice() // 每个用例给一份新副本，避免原地排序互相污染
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

// 直接跑：node plan/week-01/d2/912-sort-an-array.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('912. 排序数组（D2：归并 / 三路快排）', () => {
    for (const [label, fn] of IMPLS) {
      describe(label, () => {
        for (const one of CASES) {
          test(one.name, () => expect(fn(one.args[0].slice())).toEqual(one.expected))
        }
      })
    }
  })
}

module.exports = { sortArray, mergeSort, quickSort, CASES }
