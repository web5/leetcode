// Author: geekwen
// n 阶楼梯有多少种爬法
function climbStairs(n) {
  if(n < 2) return 1
  let prev = 1
  let cur = 1
  for(let i = 2; i <= n; i++) {
    const next = prev + cur
    prev = cur
    cur = next
  }
  return cur
}

const res = climbStairs(3)
console.log('res>>>', res)
// 1+1+1+1
// 1+1+2
// 1+2+1
// 2+1+1
// 2+2

// 3
// 1+1+1
// 1+2
// 2+1
