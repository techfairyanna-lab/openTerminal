import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs3A: Record<string, ExampleOutputLine[]> = {
  top: [
    {
      line: "top - 14:32:05 up 12 days,  3:15,  2 users,  load average: 0.15, 0.22, 0.18",
      segments: [
        { text: "top - ", explanation: "Program name" },
        { text: "14:32:05 ", explanation: "Current system time" },
        { text: "up 12 days,  3:15,  ", explanation: "System uptime" },
        { text: "2 users,  ", explanation: "Number of active user sessions" },
        { text: "load average: 0.15, 0.22, 0.18", explanation: "System load average over the last 1, 5, and 15 minutes" }
      ]
    },
    {
      line: "Tasks: 135 total,   1 running, 134 sleeping,   0 stopped,   0 zombie",
      segments: [
        { text: "Tasks: ", explanation: "Process summary" },
        { text: "135 total,   ", explanation: "Total number of processes" },
        { text: "1 running, ", explanation: "Processes currently executing on the CPU" },
        { text: "134 sleeping,   ", explanation: "Processes waiting for an event to complete" },
        { text: "0 stopped,   ", explanation: "Processes suspended by a signal" },
        { text: "0 zombie", explanation: "Terminated processes waiting for their parent to read their exit status" }
      ]
    },
    {
      line: "%Cpu(s):  2.5 us,  1.0 sy,  0.0 ni, 96.0 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st",
      segments: [
        { text: "%Cpu(s):  ", explanation: "CPU usage breakdown" },
        { text: "2.5 us,  ", explanation: "User space time (normal processes)" },
        { text: "1.0 sy,  ", explanation: "System time (kernel operations)" },
        { text: "0.0 ni, ", explanation: "Nice time (low priority processes)" },
        { text: "96.0 id,  ", explanation: "Idle time (CPU doing nothing)" },
        { text: "0.5 wa,  ", explanation: "I/O Wait time" },
        { text: "0.0 hi,  0.0 si,  0.0 st", explanation: "Hardware/Software interrupts and Steal time (virtualization)" }
      ]
    },
    {
      line: "MiB Mem :  7965.2 total,  1254.5 free,  4560.1 used,  2150.6 buff/cache",
      segments: [
        { text: "MiB Mem :  ", explanation: "Physical memory statistics in Mebibytes" },
        { text: "7965.2 total,  ", explanation: "Total available RAM" },
        { text: "1254.5 free,  ", explanation: "Completely unused RAM" },
        { text: "4560.1 used,  ", explanation: "RAM currently in use by processes" },
        { text: "2150.6 buff/cache", explanation: "RAM used for system buffers and page cache" }
      ]
    },
    {
      line: "MiB Swap:  2048.0 total,  2048.0 free,     0.0 used.  3120.4 avail Mem",
      segments: [
        { text: "MiB Swap:  ", explanation: "Virtual memory (swap space) statistics" },
        { text: "2048.0 total,  2048.0 free,     0.0 used.  ", explanation: "Swap usage details" },
        { text: "3120.4 avail Mem", explanation: "Estimated memory available for starting new applications without swapping" }
      ]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
      segments: [
        { text: "  PID ", explanation: "Process ID" },
        { text: "USER      ", explanation: "User who owns the process" },
        { text: "PR  NI    ", explanation: "Priority and Nice value" },
        { text: "VIRT    RES    SHR ", explanation: "Virtual, Resident, and Shared memory" },
        { text: "S  ", explanation: "Process Status (S=sleeping, R=running)" },
        { text: "%CPU  %MEM     ", explanation: "CPU and Memory percentage used" },
        { text: "TIME+ ", explanation: "Total accumulated CPU time" },
        { text: "COMMAND", explanation: "Command that started the process" }
      ]
    },
    {
      line: "    1 root      20   0  168512  12480   8516 S   0.0   0.2   1:12.35 systemd",
      segments: [
        { text: "    1 ", explanation: "PID 1, the first process started by the kernel" },
        { text: "root      20   0  ", explanation: "Owned by root, standard priority" },
        { text: "168512  12480   8516 ", explanation: "Memory footprint (VIRT, RES, SHR in KB)" },
        { text: "S   0.0   0.2   1:12.35 ", explanation: "Sleeping, low resources, 1 min 12 sec total CPU time" },
        { text: "systemd", explanation: "The system and service manager" }
      ]
    },
    {
      line: "  452 root      20   0       0      0      0 I   0.0   0.0   0:05.12 kworker/u8:0-events_unbound",
      segments: [
        { text: "  452 root      20   0       0      0      0 ", explanation: "A kernel worker thread has 0 user-space memory usage" },
        { text: "I   ", explanation: "Idle kernel thread state" },
        { text: "0.0   0.0   0:05.12 kworker/u8:0-events_unbound", explanation: "Kernel worker managing background events" }
      ]
    },
    {
      line: "  890 root      20   0   15480   8740   7120 S   0.0   0.1   0:02.45 sshd",
      segments: [
        { text: "  890 root      20   0   15480   8740   7120 S   0.0   0.1   0:02.45 ", explanation: "Standard process metrics" },
        { text: "sshd", explanation: "Secure Shell Daemon listening for remote connections" }
      ]
    },
    {
      line: "  912 www-data  20   0  145620  24500   8100 S   1.2   0.3   5:23.10 nginx",
      segments: [
        { text: "  912 www-data  20   0  145620  24500   8100 S   1.2   0.3   5:23.10 ", explanation: "Process metrics for a web server worker" },
        { text: "nginx", explanation: "Nginx web server handling HTTP requests" }
      ]
    },
    {
      line: " 1105 postgres  20   0  356100 145000 120500 S   0.5   1.8  12:45.00 postgres",
      segments: [
        { text: " 1105 postgres  20   0  ", explanation: "Database process owned by postgres user" },
        { text: "356100 145000 120500 S   0.5   1.8  12:45.00 ", explanation: "High shared memory (SHR) typical for relational databases" },
        { text: "postgres", explanation: "PostgreSQL database server" }
      ]
    },
    {
      line: " 1540 nodeuser  20   0  856100 125400  35100 S   3.4   1.5  45:12.60 node",
      segments: [
        { text: " 1540 nodeuser  20   0  856100 125400  35100 S   3.4   1.5  45:12.60 ", explanation: "Process metrics with notable VIRT memory size typical for V8 engine" },
        { text: "node", explanation: "Node.js JavaScript runtime process" }
      ]
    },
    {
      line: " 2150 pydev     20   0  412500  85400  12500 S   2.1   1.0   8:34.20 python3",
      segments: [
        { text: " 2150 pydev     20   0  412500  85400  12500 S   2.1   1.0   8:34.20 ", explanation: "Process metrics" },
        { text: "python3", explanation: "Python interpreter executing a script" }
      ]
    },
    {
      line: " 3145 user      20   0 1564000 345000 154000 S   5.8   4.2 124:10.45 chrome",
      segments: [
        { text: " 3145 user      20   0 ", explanation: "User-owned desktop application" },
        { text: "1564000 345000 154000 S   5.8   4.2 124:10.45 ", explanation: "Heavy memory and CPU usage over a long period" },
        { text: "chrome", explanation: "Google Chrome browser process" }
      ]
    }
  ],
  htop: [
    {
      line: "  1  [|||||||                                    15.2%]   Tasks: 145, 150 thr, 120 kthr; 1 running",
      segments: [
        { text: "  1  ", explanation: "CPU Core 1" },
        { text: "[|||||||                                    15.2%]   ", explanation: "Visual utilization bar for this core" },
        { text: "Tasks: 145, 150 thr, 120 kthr; 1 running", explanation: "Summary of tasks, user threads, and kernel threads" }
      ]
    },
    {
      line: "  2  [||||||||||||||                             30.4%]   Load average: 1.25 1.10 0.95",
      segments: [
        { text: "  2  ", explanation: "CPU Core 2" },
        { text: "[||||||||||||||                             30.4%]   ", explanation: "Visual utilization bar for this core" },
        { text: "Load average: 1.25 1.10 0.95", explanation: "Average system load over 1, 5, and 15 minutes" }
      ]
    },
    {
      line: "  3  [|||||                                      10.1%]   Uptime: 15 days, 04:20:12",
      segments: [
        { text: "  3  ", explanation: "CPU Core 3" },
        { text: "[|||||                                      10.1%]   ", explanation: "Visual utilization bar for this core" },
        { text: "Uptime: 15 days, 04:20:12", explanation: "Time since last reboot" }
      ]
    },
    {
      line: "  Mem[|||||||||||||||||||||                4.51G/15.5G]",
      segments: [
        { text: "  Mem", explanation: "Physical Memory (RAM)" },
        { text: "[|||||||||||||||||||||                4.51G/15.5G]", explanation: "Visual bar showing used memory versus total memory" }
      ]
    },
    {
      line: "  Swp[                                        0K/2.00G]",
      segments: [
        { text: "  Swp", explanation: "Swap Space (Virtual Memory)" },
        { text: "[                                        0K/2.00G]", explanation: "Empty bar indicating no swap is currently being used" }
      ]
    },
    {
      line: "  PID USER      PRI  NI  VIRT   RES   SHR S  CPU%  MEM%   TIME+  Command",
      segments: [
        { text: "  PID USER      PRI  NI  VIRT   RES   SHR S  CPU%  MEM%   TIME+  Command", explanation: "Table headers defining process metrics (similar to top, but formatted for htop)" }
      ]
    },
    {
      line: " 1240 root       20   0 1542M  125M 45100 S   1.5   0.8 15:20.10 /usr/bin/dockerd -H fd://",
      segments: [
        { text: " 1240 root       20   0 1542M  125M 45100 S   1.5   0.8 15:20.10 ", explanation: "Process metrics with human-readable M/G suffixes" },
        { text: "/usr/bin/dockerd -H fd://", explanation: "Docker daemon process managing containers" }
      ]
    },
    {
      line: " 2450 appuser    20   0 4520M 1.25G 15400 S  12.5   8.2 45:10.50 java -cp /app/lib/* com.example.App",
      segments: [
        { text: " 2450 appuser    20   0 4520M 1.25G 15400 S  12.5   8.2 45:10.50 ", explanation: "Heavy memory usage (1.25G Resident)" },
        { text: "java -cp /app/lib/* com.example.App", explanation: "Java Virtual Machine executing an application" }
      ]
    },
    {
      line: " 3105 www-data   20   0  145M 25100  8100 S   2.0   0.2  5:12.40 nginx: worker process",
      segments: [
        { text: " 3105 www-data   20   0  145M 25100  8100 S   2.0   0.2  5:12.40 ", explanation: "Metrics for a lightweight worker process" },
        { text: "nginx: worker process", explanation: "Nginx child process serving actual requests" }
      ]
    },
    {
      line: " 1105 postgres   20   0  356M  145M  120M S   0.5   0.9 12:45.00 postgres: main process",
      segments: [
        { text: " 1105 postgres   20   0  356M  145M  120M S   0.5   0.9 12:45.00 ", explanation: "Database process metrics" },
        { text: "postgres: main process", explanation: "Main PostgreSQL process managing connections" }
      ]
    },
    {
      line: "    1 root       20   0  168M 12480  8516 S   0.0   0.1  1:12.35 /sbin/init",
      segments: [
        { text: "    1 root       20   0  168M 12480  8516 S   0.0   0.1  1:12.35 ", explanation: "Metrics for PID 1" },
        { text: "/sbin/init", explanation: "System initializer (often a symlink to systemd)" }
      ]
    },
    {
      line: " 1350 root       20   0  120M 45100 21500 S   0.5   0.3  4:10.20 /usr/bin/containerd",
      segments: [
        { text: " 1350 root       20   0  120M 45100 21500 S   0.5   0.3  4:10.20 ", explanation: "Metrics" },
        { text: "/usr/bin/containerd", explanation: "Container runtime daemon" }
      ]
    },
    {
      line: " 1540 nodeuser   20   0  856M  125M 35100 S   3.4   0.8 45:12.60 node server.js",
      segments: [
        { text: " 1540 nodeuser   20   0  856M  125M 35100 S   3.4   0.8 45:12.60 ", explanation: "Metrics" },
        { text: "node server.js", explanation: "Node.js application" }
      ]
    },
    {
      line: " 4200 user       20   0  120M 10400  5100 R   0.0   0.1  0:00.05 bash",
      segments: [
        { text: " 4200 user       20   0  120M 10400  5100 ", explanation: "Metrics" },
        { text: "R   ", explanation: "Currently running process state" },
        { text: "0.0   0.1  0:00.05 bash", explanation: "Interactive shell" }
      ]
    }
  ],
  netstat: [
    {
      line: "Proto Recv-Q Send-Q Local Address           Foreign Address         State      ",
      segments: [
        { text: "Proto ", explanation: "Network protocol" },
        { text: "Recv-Q Send-Q ", explanation: "Bytes in the receive and send queues (should be 0 for stable connections)" },
        { text: "Local Address           ", explanation: "IP address and port on the local machine" },
        { text: "Foreign Address         ", explanation: "IP address and port of the remote peer" },
        { text: "State      ", explanation: "Connection state of the socket" }
      ]
    },
    {
      line: "tcp        0      0 192.168.1.10:44812      93.184.216.34:443       ESTABLISHED",
      segments: [
        { text: "tcp        0      0 ", explanation: "TCP connection with empty queues" },
        { text: "192.168.1.10:44812      ", explanation: "Local ephemeral port" },
        { text: "93.184.216.34:443       ", explanation: "Remote server (HTTPS)" },
        { text: "ESTABLISHED", explanation: "Active connection" }
      ]
    },
    {
      line: "tcp        0      0 192.168.1.10:5432       192.168.1.50:41234      ESTABLISHED",
      segments: [
        { text: "tcp        0      0 192.168.1.10:5432       192.168.1.50:41234      ESTABLISHED", explanation: "Local database serving an active remote client" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ", explanation: "SSH server listening on all interfaces" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ", explanation: "Web server listening on all interfaces" }
      ]
    },
    {
      line: "tcp        0      0 192.168.1.10:38210      104.21.5.12:80          TIME_WAIT  ",
      segments: [
        { text: "tcp        0      0 192.168.1.10:38210      104.21.5.12:80          ", explanation: "A connection that was recently closed" },
        { text: "TIME_WAIT  ", explanation: "Waiting to ensure remote peer received closure acknowledgment" }
      ]
    },
    {
      line: "udp        0      0 0.0.0.0:53              0.0.0.0:*               ",
      segments: [
        { text: "udp        ", explanation: "User Datagram Protocol (connectionless)" },
        { text: "0      0 0.0.0.0:53              0.0.0.0:*               ", explanation: "Listening on port 53 (DNS). UDP sockets do not have a 'LISTEN' state." }
      ]
    }
  ],
  ss: [
    {
      line: "Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process",
      segments: [
        { text: "Netid ", explanation: "Network protocol type" },
        { text: "State  ", explanation: "Socket state" },
        { text: "Recv-Q Send-Q ", explanation: "Bytes in queues or listen backlog limits" },
        { text: "Local Address:Port ", explanation: "Local binding" },
        { text: "Peer Address:Port ", explanation: "Remote connection" },
        { text: "Process", explanation: "Process owning the socket (shown with -p flag)" }
      ]
    },
    {
      line: "tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*           ",
      segments: [
        { text: "tcp   LISTEN ", explanation: "TCP socket listening for connections" },
        { text: "0      128          ", explanation: "Current queued connections (0) and max backlog limit (128)" },
        { text: "0.0.0.0:22        0.0.0.0:*           ", explanation: "SSH port open on all interfaces" }
      ]
    },
    {
      line: "tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*           ",
      segments: [
        { text: "tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*           ", explanation: "HTTP port with a backlog of 511" }
      ]
    },
    {
      line: "tcp   LISTEN 0      511          0.0.0.0:443       0.0.0.0:*           ",
      segments: [
        { text: "tcp   LISTEN 0      511          0.0.0.0:443       0.0.0.0:*           ", explanation: "HTTPS port" }
      ]
    },
    {
      line: "tcp   LISTEN 0      244        127.0.0.1:5432      0.0.0.0:*           ",
      segments: [
        { text: "tcp   LISTEN 0      244        ", explanation: "Metrics" },
        { text: "127.0.0.1:5432      ", explanation: "PostgreSQL bound exclusively to local loopback interface" },
        { text: "0.0.0.0:*           ", explanation: "Peer" }
      ]
    },
    {
      line: "tcp   LISTEN 0      1024         0.0.0.0:3000      0.0.0.0:*           ",
      segments: [
        { text: "tcp   LISTEN 0      1024         0.0.0.0:3000      0.0.0.0:*           ", explanation: "Node server bound to all interfaces" }
      ]
    },
    {
      line: "udp   UNCONN 0      0            0.0.0.0:53        0.0.0.0:*           ",
      segments: [
        { text: "udp   UNCONN ", explanation: "UDP is connectionless, so state is UNCONN" },
        { text: "0      0            0.0.0.0:53        0.0.0.0:*           ", explanation: "DNS service port" }
      ]
    }
  ],
  lsblk: [
    {
      line: "NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS",
      segments: [
        { text: "NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS", explanation: "Headers showing device name, major/minor numbers, removable flag, size, read-only flag, device type, and mount point" }
      ]
    },
    {
      line: "sda           8:0    0  500G  0 disk ",
      segments: [
        { text: "sda           ", explanation: "First SCSI/SATA block device" },
        { text: "8:0    0  ", explanation: "Major/minor device numbers and not removable (0)" },
        { text: "500G  0 ", explanation: "500 Gigabytes, not read-only" },
        { text: "disk ", explanation: "It represents an entire physical or virtual drive" }
      ]
    },
    {
      line: "├─sda1        8:1    0  512M  0 part /boot/efi",
      segments: [
        { text: "├─sda1        ", explanation: "First partition on sda" },
        { text: "8:1    0  512M  0 ", explanation: "Metrics" },
        { text: "part ", explanation: "Indicates this is a partition" },
        { text: "/boot/efi", explanation: "Mounted as the EFI system partition for booting" }
      ]
    },
    {
      line: "├─sda2        8:2    0   50G  0 part /",
      segments: [
        { text: "├─sda2        8:2    0   50G  0 part ", explanation: "Second partition" },
        { text: "/", explanation: "Mounted as the root filesystem" }
      ]
    },
    {
      line: "├─sda3        8:3    0  200G  0 part /home",
      segments: [
        { text: "├─sda3        8:3    0  200G  0 part /home", explanation: "Third partition, mounted for user data" }
      ]
    },
    {
      line: "└─sda4        8:4    0    8G  0 part [SWAP]",
      segments: [
        { text: "└─", explanation: "Terminal tree branch indicating the last child of sda" },
        { text: "sda4        8:4    0    8G  0 part ", explanation: "Fourth partition" },
        { text: "[SWAP]", explanation: "Actively used as system swap space" }
      ]
    },
    {
      line: "nvme0n1     259:0    0    1T  0 disk ",
      segments: [
        { text: "nvme0n1     ", explanation: "First Non-Volatile Memory Express (NVMe) solid-state drive" },
        { text: "259:0    0    1T  0 disk ", explanation: "1 Terabyte drive" }
      ]
    },
    {
      line: "└─nvme0n1p1 259:1    0    1T  0 part /data",
      segments: [
        { text: "└─nvme0n1p1 ", explanation: "First partition on the NVMe drive" },
        { text: "259:1    0    1T  0 part /data", explanation: "Mounted as a high-speed data volume" }
      ]
    }
  ],
  lscpu: [
    {
      line: "Architecture:            x86_64",
      segments: [
        { text: "Architecture:            ", explanation: "Key" },
        { text: "x86_64", explanation: "The CPU architecture (64-bit x86)" }
      ]
    },
    {
      line: "CPU op-mode(s):          32-bit, 64-bit",
      segments: [{ text: "CPU op-mode(s):          32-bit, 64-bit", explanation: "Indicates the processor supports both 32-bit and 64-bit operation modes" }]
    },
    {
      line: "CPU(s):                  8",
      segments: [{ text: "CPU(s):                  8", explanation: "Total number of logical processors visible to the operating system" }]
    },
    {
      line: "Thread(s) per core:      2",
      segments: [{ text: "Thread(s) per core:      2", explanation: "Indicates Hyper-Threading or Simultaneous Multithreading (SMT) is enabled" }]
    },
    {
      line: "Core(s) per socket:      4",
      segments: [{ text: "Core(s) per socket:      4", explanation: "Physical cores present inside each physical processor chip" }]
    },
    {
      line: "Model name:              Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz",
      segments: [{ text: "Model name:              Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz", explanation: "The specific brand and model string reported by the hardware" }]
    },
    {
      line: "CPU MHz:                 2904.000",
      segments: [{ text: "CPU MHz:                 2904.000", explanation: "Current operating frequency of the CPU" }]
    },
    {
      line: "L1d cache:               128 KiB",
      segments: [{ text: "L1d cache:               128 KiB", explanation: "Level 1 Data cache size (fastest, closest to CPU)" }]
    },
    {
      line: "L1i cache:               128 KiB",
      segments: [{ text: "L1i cache:               128 KiB", explanation: "Level 1 Instruction cache size" }]
    },
    {
      line: "L2 cache:                1 MiB",
      segments: [{ text: "L2 cache:                1 MiB", explanation: "Level 2 cache size" }]
    },
    {
      line: "L3 cache:                16 MiB",
      segments: [{ text: "L3 cache:                16 MiB", explanation: "Level 3 cache size (shared among cores)" }]
    }
  ],
  vmstat: [
    {
      line: "procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----",
      segments: [
        { text: "procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----", explanation: "Main category headers for virtual memory statistics" }
      ]
    },
    {
      line: " r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st",
      segments: [
        { text: " r  b   ", explanation: "Procs: r = running/runnable, b = blocked (waiting for IO)" },
        { text: "swpd   free   buff  cache   ", explanation: "Memory: used swap, free RAM, buffer RAM, cache RAM" },
        { text: "si   so    ", explanation: "Swap: KB swapped in from disk, KB swapped out to disk" },
        { text: "bi    bo   ", explanation: "IO: Blocks sent to/received from block devices per second" },
        { text: "in   cs ", explanation: "System: Interrupts and Context Switches per second" },
        { text: "us sy id wa st", explanation: "CPU: User, System, Idle, IO Wait, and Steal percentages" }
      ]
    },
    {
      line: " 2  0      0 125450 215060 456010    0    0    12    45  150  250  5  2 92  1  0",
      segments: [
        { text: " 2  0      ", explanation: "2 runnable processes, 0 blocked processes" },
        { text: "0 125450 215060 456010    ", explanation: "No swap used, lots of cached memory" },
        { text: "0    0    ", explanation: "No active swapping (good health)" },
        { text: "12    45  ", explanation: "Low disk read/write activity" },
        { text: "150  250  ", explanation: "System interrupts and context switches" },
        { text: "5  2 92  1  0", explanation: "CPU is mostly idle (92%)" }
      ]
    },
    {
      line: " 1  0      0 125400 215080 456010    0    0     0    10  120  200  4  1 95  0  0",
      segments: [{ text: " 1  0      0 125400 215080 456010    0    0     0    10  120  200  4  1 95  0  0", explanation: "A subsequent snapshot showing normal, idle behavior" }]
    },
    {
      line: " 3  1      0 125100 215100 456050    0    0   250   100  500  800 15  5 75  5  0",
      segments: [
        { text: " 3  1      ", explanation: "Load spike: 3 running, 1 blocked waiting for disk" },
        { text: "0 125100 215100 456050    0    0   ", explanation: "Memory stable" },
        { text: "250   100  500  800 ", explanation: "Increased disk IO and context switches" },
        { text: "15  5 75  5  0", explanation: "CPU usage increased, IO wait (wa) jumped to 5%" }
      ]
    }
  ],
  iostat: [
    {
      line: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)",
      segments: [{ text: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)", explanation: "System information header" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "avg-cpu:  %user   %nice %system %iowait  %steal   %idle",
      segments: [{ text: "avg-cpu:  %user   %nice %system %iowait  %steal   %idle", explanation: "Headers for the aggregate CPU report since boot" }]
    },
    {
      line: "           5.25    0.00    1.50    0.25    0.00   93.00",
      segments: [{ text: "           5.25    0.00    1.50    0.25    0.00   93.00", explanation: "Average CPU utilization percentages" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "Device             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn",
      segments: [
        { text: "Device             ", explanation: "Block device name" },
        { text: "tps    ", explanation: "Transfers per second (I/O requests)" },
        { text: "kB_read/s    kB_wrtn/s    ", explanation: "Throughput: Kilobytes read and written per second" },
        { text: "kB_read    kB_wrtn", explanation: "Total amount of data read and written since boot" }
      ]
    },
    {
      line: "sda              15.20       450.50       200.10   15405000    6840000",
      segments: [
        { text: "sda              15.20       450.50       200.10   15405000    6840000", explanation: "I/O statistics for the first SATA drive" }
      ]
    },
    {
      line: "nvme0n1         120.50      2540.20      1024.50   85400200   35100500",
      segments: [
        { text: "nvme0n1         120.50      2540.20      1024.50   85400200   35100500", explanation: "Much higher throughput and transactions per second on the NVMe drive" }
      ]
    },
    {
      line: "dm-0              5.10        50.20        20.50    1500200     540100",
      segments: [
        { text: "dm-0              5.10        50.20        20.50    1500200     540100", explanation: "Device Mapper volume (e.g., LVM or LUKS encrypted volume)" }
      ]
    }
  ],
  sar: [
    {
      line: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)",
      segments: [{ text: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)", explanation: "System Activity Reporter header" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "10:00:01 AM     CPU     %user     %nice   %system   %iowait    %steal     %idle",
      segments: [{ text: "10:00:01 AM     CPU     %user     %nice   %system   %iowait    %steal     %idle", explanation: "Headers showing historical CPU usage metric columns" }]
    },
    {
      line: "10:10:01 AM     all      4.50      0.00      1.20      0.10      0.00     94.20",
      segments: [{ text: "10:10:01 AM     all      4.50      0.00      1.20      0.10      0.00     94.20", explanation: "Aggregate CPU usage recorded at this 10-minute interval" }]
    },
    {
      line: "10:20:01 AM     all      5.10      0.00      1.50      0.20      0.00     93.20",
      segments: [{ text: "10:20:01 AM     all      5.10      0.00      1.50      0.20      0.00     93.20", explanation: "Historical record" }]
    },
    {
      line: "10:30:01 AM     all      8.50      0.00      2.10      0.50      0.00     88.90",
      segments: [{ text: "10:30:01 AM     all      8.50      0.00      2.10      0.50      0.00     88.90", explanation: "Slight increase in load" }]
    },
    {
      line: "10:40:01 AM     all     12.20      0.00      3.50      1.10      0.00     83.20",
      segments: [{ text: "10:40:01 AM     all     12.20      0.00      3.50      1.10      0.00     83.20", explanation: "Peak load interval" }]
    },
    {
      line: "10:50:01 AM     all      6.40      0.00      1.80      0.30      0.00     91.50",
      segments: [{ text: "10:50:01 AM     all      6.40      0.00      1.80      0.30      0.00     91.50", explanation: "Load decreasing" }]
    },
    {
      line: "11:00:01 AM     all      4.20      0.00      1.10      0.10      0.00     94.60",
      segments: [{ text: "11:00:01 AM     all      4.20      0.00      1.10      0.10      0.00     94.60", explanation: "Return to baseline idle" }]
    },
    {
      line: "Average:        all      6.81      0.00      1.86      0.38      0.00     90.93",
      segments: [
        { text: "Average:        ", explanation: "Summary statistic" },
        { text: "all      6.81      0.00      1.86      0.38      0.00     90.93", explanation: "Averages calculated over the requested time period" }
      ]
    }
  ],
  mpstat: [
    {
      line: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)",
      segments: [{ text: "Linux 5.15.0-76-generic (hostname) 	10/12/2023 	_x86_64_	(8 CPU)", explanation: "System banner" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "14:32:05     CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest   %idle",
      segments: [
        { text: "14:32:05     ", explanation: "Timestamp" },
        { text: "CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest   %idle", explanation: "Detailed per-processor utilization headers, including hardware/software interrupts and guest VMs" }
      ]
    },
    {
      line: "14:32:05     all    5.25    0.00    1.50    0.25    0.00    0.10    0.00    0.00   92.90",
      segments: [
        { text: "14:32:05     all    ", explanation: "Aggregate of all CPUs" },
        { text: "5.25    0.00    1.50    0.25    0.00    0.10    0.00    0.00   92.90", explanation: "Global averages" }
      ]
    },
    {
      line: "14:32:05       0    4.10    0.00    1.20    0.10    0.00    0.05    0.00    0.00   94.55",
      segments: [
        { text: "14:32:05       0    ", explanation: "Specific metrics for CPU core 0" },
        { text: "4.10    0.00    1.20    0.10    0.00    0.05    0.00    0.00   94.55", explanation: "Core 0 utilization" }
      ]
    },
    {
      line: "14:32:05       1    6.50    0.00    1.80    0.30    0.00    0.15    0.00    0.00   91.25",
      segments: [{ text: "14:32:05       1    6.50    0.00    1.80    0.30    0.00    0.15    0.00    0.00   91.25", explanation: "Core 1 utilization" }]
    },
    {
      line: "14:32:05       2    3.80    0.00    1.10    0.10    0.00    0.05    0.00    0.00   94.95",
      segments: [{ text: "14:32:05       2    3.80    0.00    1.10    0.10    0.00    0.05    0.00    0.00   94.95", explanation: "Core 2 utilization" }]
    },
    {
      line: "14:32:05       3    8.20    0.00    2.10    0.50    0.00    0.20    0.00    0.00   89.00",
      segments: [{ text: "14:32:05       3    8.20    0.00    2.10    0.50    0.00    0.20    0.00    0.00   89.00", explanation: "Core 3 utilization, slightly higher load than others" }]
    }
  ],
  ifconfig: [
    {
      line: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
      segments: [
        { text: "eth0: ", explanation: "First Ethernet network interface" },
        { text: "flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  ", explanation: "Interface state flags showing it is active and configured" },
        { text: "mtu 1500", explanation: "Maximum Transmission Unit (max packet size in bytes)" }
      ]
    },
    {
      line: "        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255",
      segments: [
        { text: "        inet 192.168.1.10  ", explanation: "IPv4 address assigned to this interface" },
        { text: "netmask 255.255.255.0  ", explanation: "Subnet mask defining the local network boundary" },
        { text: "broadcast 192.168.1.255", explanation: "Address used to broadcast packets to all devices on the subnet" }
      ]
    },
    {
      line: "        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>",
      segments: [
        { text: "        inet6 fe80::a00:27ff:fe4e:66a1  ", explanation: "IPv6 link-local address" },
        { text: "prefixlen 64  scopeid 0x20<link>", explanation: "IPv6 subnet prefix and scope (link-local means valid only on this local network)" }
      ]
    },
    {
      line: "        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)",
      segments: [
        { text: "        ether 08:00:27:4e:66:a1  ", explanation: "Hardware MAC address" },
        { text: "txqueuelen 1000  (Ethernet)", explanation: "Transmit queue length limit" }
      ]
    },
    {
      line: "        RX packets 154200  bytes 125400000 (125.4 MB)",
      segments: [
        { text: "        RX packets 154200  ", explanation: "Total Received packets since boot" },
        { text: "bytes 125400000 (125.4 MB)", explanation: "Total Received data volume" }
      ]
    },
    {
      line: "        RX errors 0  dropped 0  overruns 0  frame 0",
      segments: [{ text: "        RX errors 0  dropped 0  overruns 0  frame 0", explanation: "Receive error statistics (0 indicates perfect network health)" }]
    },
    {
      line: "        TX packets 85400  bytes 45100000 (45.1 MB)",
      segments: [{ text: "        TX packets 85400  bytes 45100000 (45.1 MB)", explanation: "Total Transmitted (sent) packets and data volume" }]
    },
    {
      line: "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0",
      segments: [{ text: "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0", explanation: "Transmit error statistics" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
      segments: [
        { text: "lo: ", explanation: "Loopback interface (virtual interface used for local communication)" },
        { text: "flags=73<UP,LOOPBACK,RUNNING>  ", explanation: "State flags" },
        { text: "mtu 65536", explanation: "Huge MTU because traffic never leaves the machine's memory" }
      ]
    },
    {
      line: "        inet 127.0.0.1  netmask 255.0.0.0",
      segments: [{ text: "        inet 127.0.0.1  netmask 255.0.0.0", explanation: "Standard IPv4 localhost address" }]
    },
    {
      line: "        inet6 ::1  prefixlen 128  scopeid 0x10<host>",
      segments: [{ text: "        inet6 ::1  prefixlen 128  scopeid 0x10<host>", explanation: "Standard IPv6 localhost address" }]
    },
    {
      line: "        loop  txqueuelen 1000  (Local Loopback)",
      segments: [{ text: "        loop  txqueuelen 1000  (Local Loopback)", explanation: "Hardware type is Virtual Loopback" }]
    },
    {
      line: "        RX packets 4510  bytes 1254000 (1.2 MB)",
      segments: [{ text: "        RX packets 4510  bytes 1254000 (1.2 MB)", explanation: "Loopback receive stats (matches transmit perfectly)" }]
    },
    {
      line: "        RX errors 0  dropped 0  overruns 0  frame 0",
      segments: [{ text: "        RX errors 0  dropped 0  overruns 0  frame 0", explanation: "Errors" }]
    },
    {
      line: "        TX packets 4510  bytes 1254000 (1.2 MB)",
      segments: [{ text: "        TX packets 4510  bytes 1254000 (1.2 MB)", explanation: "Loopback transmit stats" }]
    },
    {
      line: "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0",
      segments: [{ text: "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0", explanation: "Errors" }]
    }
  ],
  ip: [
    {
      line: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000",
      segments: [
        { text: "1: ", explanation: "Interface index" },
        { text: "lo: ", explanation: "Interface name (loopback)" },
        { text: "<LOOPBACK,UP,LOWER_UP> ", explanation: "Interface flags indicating it is enabled and linked" },
        { text: "mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000", explanation: "Maximum transmission unit and advanced queuing parameters" }
      ]
    },
    {
      line: "    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00",
      segments: [{ text: "    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00", explanation: "Loopback does not have a real hardware MAC address" }]
    },
    {
      line: "    inet 127.0.0.1/8 scope host lo",
      segments: [
        { text: "    inet 127.0.0.1/8 ", explanation: "IPv4 localhost address and subnet mask notation (/8)" },
        { text: "scope host lo", explanation: "This address is only valid internally on this host" }
      ]
    },
    {
      line: "       valid_lft forever preferred_lft forever",
      segments: [{ text: "       valid_lft forever preferred_lft forever", explanation: "Lease time (infinite for static localhost)" }]
    },
    {
      line: "    inet6 ::1/128 scope host ",
      segments: [{ text: "    inet6 ::1/128 scope host ", explanation: "IPv6 localhost address" }]
    },
    {
      line: "       valid_lft forever preferred_lft forever",
      segments: [{ text: "       valid_lft forever preferred_lft forever", explanation: "Lease time" }]
    },
    {
      line: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000",
      segments: [
        { text: "2: eth0: ", explanation: "Second interface (Main ethernet)" },
        { text: "<BROADCAST,MULTICAST,UP,LOWER_UP> ", explanation: "Flags showing it supports broadcast/multicast, is enabled (UP), and physically connected (LOWER_UP)" },
        { text: "mtu 1500 qdisc pfifo_fast state UP group default qlen 1000", explanation: "Queuing discipline (packet scheduler) is pfifo_fast" }
      ]
    },
    {
      line: "    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff",
      segments: [
        { text: "    link/ether 08:00:27:4e:66:a1 ", explanation: "Hardware MAC address" },
        { text: "brd ff:ff:ff:ff:ff:ff", explanation: "Hardware broadcast address" }
      ]
    },
    {
      line: "    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0",
      segments: [
        { text: "    inet 192.168.1.10/24 ", explanation: "IPv4 address and CIDR subnet mask" },
        { text: "brd 192.168.1.255 ", explanation: "Network broadcast IP" },
        { text: "scope global dynamic eth0", explanation: "Globally routable IP, acquired dynamically via DHCP" }
      ]
    },
    {
      line: "       valid_lft 86395sec preferred_lft 86395sec",
      segments: [{ text: "       valid_lft 86395sec preferred_lft 86395sec", explanation: "DHCP lease expiration countdown in seconds" }]
    },
    {
      line: "    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link ",
      segments: [{ text: "    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link ", explanation: "IPv6 address restricted to the local network segment (scope link)" }]
    },
    {
      line: "       valid_lft forever preferred_lft forever",
      segments: [{ text: "       valid_lft forever preferred_lft forever", explanation: "Link local addresses do not expire" }]
    }
  ]
};