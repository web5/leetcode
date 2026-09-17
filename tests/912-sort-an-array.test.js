const {
  sortArray,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  insertionSort,
  bubbleSort,
} = require('../solutions/912-sort-an-array')

// 每个实现跑同一批场景，保证行为一致
const impls = [
  ['归并排序 mergeSort', mergeSort],
  ['快速排序 quickSort', quickSort],
  ['堆排序 heapSort', heapSort],
  ['计数排序 countingSort', countingSort],
  ['插入排序 insertionSort', insertionSort],
  ['冒泡排序 bubbleSort', bubbleSort],
]

describe('912. 排序数组', () => {
  impls.forEach(([name, sort]) => {
    describe(name, () => {
      test('示例 1：[5,2,3,1] → [1,2,3,5]', () => {
        expect(sort([5, 2, 3, 1])).toEqual([1, 2, 3, 5])
      })

      test('示例 2：[5,1,1,2,0,0] → [0,0,1,1,2,5]（值可重复）', () => {
        expect(sort([5, 1, 1, 2, 0, 0])).toEqual([0, 0, 1, 1, 2, 5])
      })

      test('边界：空数组 / 单元素 / 已排序 / 逆序', () => {
        expect(sort([])).toEqual([])
        expect(sort([1])).toEqual([1])
        expect(sort([1, 2, 3])).toEqual([1, 2, 3])
        expect(sort([3, 2, 1])).toEqual([1, 2, 3])
      })

      test('含负数与重复值：[-1,5,-3,0,-1] → [-3,-1,-1,0,5]', () => {
        expect(sort([-1, 5, -3, 0, -1])).toEqual([-3, -1, -1, 0, 5])
      })
    })
  })

  test('LeetCode 入口 sortArray 结果等同于归并排序', () => {
    const data = [5, 2, 3, 1]
    expect(sortArray(data)).toEqual(mergeSort(data))
    expect(sortArray(data)).toEqual([1, 2, 3, 5])
  })

  test('全部实现对同一组数据结果一致', () => {
    const data = [5, 2, 9, 1, 5, 6, -3, 0, 6, 2]
    const expected = [-3, 0, 1, 2, 2, 5, 5, 6, 6, 9]
    for (const [, sort] of impls) {
      expect(sort(data)).toEqual(expected)
    }
  })

  test('所有实现都不改动入参', () => {
    const data = [3, 1, 2]
    for (const [, sort] of impls) sort(data)
    expect(data).toEqual([3, 1, 2])
  })
})
