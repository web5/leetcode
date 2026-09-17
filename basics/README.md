# 计算机基础面试题

按主题分目录，每个目录下一个或多个 `.md`，统一格式：`**Q：** 问题` + `**A：** 答案`。

```
basics/
├── os/                     # 操作系统
│   ├── 01-process-thread.md
│   ├── 02-memory.md
│   └── 03-concurrency-io.md
├── network/                # 计算机网络
│   ├── 01-tcp-ip.md
│   ├── 02-http.md
│   └── 03-https.md
├── database/               # 数据库与缓存
│   ├── 01-mysql.md
│   └── 02-redis.md
├── architecture/           # 计算机组成与编译链接
│   └── 01-computer-organization.md
└── data-structure/         # 数据结构与算法通识
    ├── 01-structures.md
    └── 02-algorithms.md
```

## 清单

| 目录 | 文件 | 题数 | 覆盖 |
| --- | --- | --- | --- |
| os | [01-process-thread.md](os/01-process-thread.md) | 12 | 进程/线程/协程、调度、IPC、僵尸进程、上下文切换 |
| os | [02-memory.md](os/02-memory.md) | 10 | 虚拟内存、分页分段、页面置换、内存碎片、malloc |
| os | [03-concurrency-io.md](os/03-concurrency-io.md) | 11 | 死锁、锁、IO 多路复用、同步异步、零拷贝 |
| network | [01-tcp-ip.md](network/01-tcp-ip.md) | 13 | 三握四挥、TCP/UDP、可靠传输、拥塞控制、TIME_WAIT、IP/DNS/ARP |
| network | [02-http.md](network/02-http.md) | 15 | 状态码、HTTP1/2/3、HTTPS/TLS、缓存、Cookie/Session、WebSocket、跨域 |
| network | [03-https.md](network/03-https.md) | 12 | TLS 握手、前向安全、TLS1.2/1.3、证书校验、MITM 与防护、排障命令 |
| database | [01-mysql.md](database/01-mysql.md) | 15 | 索引 B+ 树、事务 ACID、隔离级别、MVCC、锁、日志、SQL 优化 |
| database | [02-redis.md](database/02-redis.md) | 13 | 数据结构、持久化、过期淘汰、缓存三兄弟、分布式锁、高可用 |
| architecture | [01-computer-organization.md](architecture/01-computer-organization.md) | 12 | 冯诺依曼、流水线、Cache、大小端、补码、浮点、编译链接 |
| data-structure | [01-structures.md](data-structure/01-structures.md) | 12 | 数组/链表/哈希/树/堆/图、B+ 树 vs 红黑树 |
| data-structure | [02-algorithms.md](data-structure/02-algorithms.md) | 12 | 复杂度、十大排序、二分、DP/贪心、位运算 |

## 怎么用

1. 先盖住 `**A：**` 自己答一遍，答不上来的打标记；
2. 每个主题挑 3 条能串成一条线（例如：`虚拟内存 → 缺页中断 → 页面置换 → TLB → 缓存局部性`）；
3. 面试追问一般落在「为什么」和「代价」，答案里用 *代价/坑* 标出了追问点。
