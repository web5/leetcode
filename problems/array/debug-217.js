function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length
}

// 字符拼接操作是个坑[12, 2]， 2 字符有重复，但是数组没有重复的数字
// function containsDuplicate(nums) {
//   let str = ''
//   for(let i = 0; i < nums.length; i++) {
//     if(str.includes(nums[i])) return true
//     str += nums[i]
//   }
//   return false
// }

const res = containsDuplicate([2, 7, 11, 3])
console.log('res>>>', res)

