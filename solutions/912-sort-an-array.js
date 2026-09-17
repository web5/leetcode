/**
 * 912. 排序数组（中等）
 * 题目：problems/sorting/912-sort-an-array.md
 *
 * 本体要求：不调用内置函数、时间 O(n log n)、空间尽可能小。
 * 下面给了 6 种实现，按「是否够格解本题」排列：
 *
 * | 实现            | 平均时间   | 最坏时间   | 空间     | 稳定 | 能解本题 |
 * | --------------- | ---------- | ---------- | -------- | ---- | -------- |
 * | mergeSort       | O(n log n) | O(n log n) | O(n)     | 稳定 | ✅ 默认答案 |
 * | quickSort       | O(n log n) | O(n^2)     | O(log n) | 否   | ✅ 实际最快 |
 * | heapSort        | O(n log n) | O(n log n) | O(1)     | 否   | ✅ 空间最优 |
 * | countingSort    | O(n + k)   | O(n + k)   | O(k)     | 稳定 | ✅ k 有界时（本题 |nums[i]| <= 5*10^4） |
 * | insertionSort   | O(n^2)     | O(n^2)     | O(1)     | 稳定 | ❌ 会超时，留作对照 |
 * | bubbleSort      | O(n^2)     | O(n^2)     | O(1)     | 稳定 | ❌ 会超时，留作对照 |
 *
 * 说明：所有实现都不改动入参，返回新数组。
 */

/** 1. 归并排序（分治）——本题默认答案 */
function mergeSort(nums) {
  const n = nums.length
  if (n < 2) return [...nums]
  const mid = Math.floor(n / 2)
  return merge(mergeSort(nums.slice(0, mid)), mergeSort(nums.slice(mid)))
}

function merge(left, right) {
  const merged = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++])
    else merged.push(right[j++])
  }
  while (i < left.length) merged.push(left[i++])
  while (j < right.length) merged.push(right[j++])
  return merged
}

/** 2. 快速排序（三路快排 + 随机 pivot）
 *  三路切分把等值区一次性铺平，重复元素不会退化到 O(n^2)；
 *  随机选 pivot 是为了避免「输入本身就有序」时每次都切出最坏分割。
 */
function quickSort(nums) {
  const arr = [...nums]
  quick(arr, 0, arr.length - 1)
  return arr
}

function quick(arr, left, right) {
  if (left >= right) return
  const pivotIndex = left + Math.floor(Math.random() * (right - left + 1))
  ;[arr[left], arr[pivotIndex]] = [arr[pivotIndex], arr[left]]

  const pivot = arr[left]
  let lt = left // [left, lt-1] < pivot
  let i = left + 1 // [lt, i-1] === pivot
  let gt = right // [gt+1, right] > pivot
  while (i <= gt) {
    if (arr[i] < pivot) {
      ;[arr[lt], arr[i]] = [arr[i], arr[lt]]
      lt++
      i++
    } else if (arr[i] > pivot) {
      ;[arr[i], arr[gt]] = [arr[gt], arr[i]]
      gt--
    } else {
      i++
    }
  }
  quick(arr, left, lt - 1)
  quick(arr, gt + 1, right)
}

/** 3. 堆排序（原地，空间 O(1)）——先建大顶堆，再反复把堆顶换到末尾 */
function heapSort(nums) {
  const arr = [...nums]
  const n = arr.length
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, n, i)
  for (let end = n - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    siftDown(arr, end, 0) // 此时堆的大小是 end
  }
  return arr
}

function siftDown(arr, size, i) {
  while (true) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2
    if (left < size && arr[left] > arr[largest]) largest = left
    if (right < size && arr[right] > arr[largest]) largest = right
    if (largest === i) break
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
    i = largest
  }
}

/** 4. 计数排序——值域有界时最快，本题 |nums[i]| <= 5*10^4 正好适用 */
function countingSort(nums) {
  if (nums.length < 2) return [...nums]
  let min = Infinity
  let max = -Infinity
  for (const n of nums) {
    if (n < min) min = n
    if (n > max) max = n
  }
  const count = new Array(max - min + 1).fill(0)
  for (const n of nums) count[n - min]++
  const out = []
  for (let v = min; v <= max; v++) {
    for (let c = count[v - min]; c > 0; c--) out.push(v)
  }
  return out
}

/** 5. 插入排序——O(n^2)，不适合本题，保留用来和小数据/近乎有序的场景对照 */
function insertionSort(nums) {
  const arr = [...nums]
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > cur) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = cur
  }
  return arr
}

/** 6. 冒泡排序——O(n^2)，同样不适合本题，留作最直观的对照 */
function bubbleSort(nums) {
  const arr = [...nums]
  for (let end = arr.length - 1; end > 0; end--) {
    let swapped = false
    for (let i = 0; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        swapped = true
      }
    }
    if (!swapped) break // 已经有序就提前收工
  }
  return arr
}

// LeetCode 提交入口：默认走归并排序
function sortArray(nums) {
  return mergeSort(nums)
}

module.exports = {
  sortArray,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  insertionSort,
  bubbleSort,
}
