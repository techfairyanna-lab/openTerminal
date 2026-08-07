import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const psVariants: Record<string, ExampleOutputLine[]> = {
  "aux": [
    {
      line: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
      segments: [
        { text: "USER       ", explanation: "User who owns the process" },
        { text: "PID ", explanation: "Process ID" },
        { text: "%CPU %MEM    ", explanation: "CPU and memory utilization percentages" },
        { text: "VSZ   ", explanation: "Virtual memory size in KiB" },
        { text: "RSS ", explanation: "Resident set size (physical memory) in KiB" },
        { text: "TTY      ", explanation: "Controlling terminal ('?' means none)" },
        { text: "STAT ", explanation: "Process state code (e.g., S for sleeping, R for running)" },
        { text: "START   ", explanation: "Starting time of the process" },
        { text: "TIME ", explanation: "Cumulative CPU time" },
        { text: "COMMAND", explanation: "Command and arguments" }
      ]
    },
    {
      line: "root         1  0.0  0.1 168512 12480 ?        Ss   Oct12   1:12 /sbin/init",
      segments: [
        { text: "root         1  0.0  0.1 168512 12480 ?        Ss   Oct12   1:12 ", explanation: "System init process running as root" },
        { text: "/sbin/init", explanation: "The first process started by the kernel" }
      ]
    },
    {
      line: "root         2  0.0  0.0      0     0 ?        S    Oct12   0:00 [kthreadd]",
      segments: [
        { text: "root         2  0.0  0.0      0     0 ?        S    Oct12   0:00 ", explanation: "Kernel thread daemon" },
        { text: "[kthreadd]", explanation: "Kernel process (indicated by brackets)" }
      ]
    },
    {
      line: "root       890  0.0  0.1  15480  8740 ?        Ss   Oct12   0:02 sshd: /usr/sbin/sshd -D",
      segments: [
        { text: "root       890  0.0  0.1  15480  8740 ?        Ss   Oct12   0:02 ", explanation: "SSH daemon process metrics" },
        { text: "sshd: /usr/sbin/sshd -D", explanation: "SSH server running in the background" }
      ]
    },
    {
      line: "postgres  1105  0.1  1.8 356100 145000 ?       Ss   Oct12  12:45 postgres: main process",
      segments: [
        { text: "postgres  1105  0.1  1.8 356100 145000 ?       Ss   Oct12  12:45 ", explanation: "PostgreSQL main database process" },
        { text: "postgres: main process", explanation: "Database master process" }
      ]
    },
    {
      line: "postgres  1107  0.0  0.5 356100 45000 ?        Ss   Oct12   0:15 postgres: background writer",
      segments: [
        { text: "postgres  1107  0.0  0.5 356100 45000 ?        Ss   Oct12   0:15 ", explanation: "PostgreSQL worker metrics" },
        { text: "postgres: background writer", explanation: "Database background worker writing cached data to disk" }
      ]
    },
    {
      line: "www-data   912  1.2  0.3 145620 24500 ?        S    Oct12   5:23 nginx: worker process",
      segments: [
        { text: "www-data   912  1.2  0.3 145620 24500 ?        S    Oct12   5:23 ", explanation: "Nginx worker process running as non-root user" },
        { text: "nginx: worker process", explanation: "Web server handling incoming requests" }
      ]
    },
    {
      line: "user      3450  0.5  0.2  18450 12400 pts/0    S+   14:20   0:05 vim index.js",
      segments: [
        { text: "user      3450  0.5  0.2  18450 12400 ", explanation: "User's interactive process" },
        { text: "pts/0    ", explanation: "Attached to pseudo-terminal 0" },
        { text: "S+   14:20   0:05 ", explanation: "Running in the foreground process group (+)" },
        { text: "vim index.js", explanation: "Text editor process" }
      ]
    },
    {
      line: "nodeuser  1540  3.4  1.5 856100 125400 ?       Sl   Oct12  45:12 node /app/server.js",
      segments: [
        { text: "nodeuser  1540  3.4  1.5 856100 125400 ?       ", explanation: "Node process consuming moderate CPU and memory" },
        { text: "Sl   ", explanation: "Multi-threaded process (l)" },
        { text: "Oct12  45:12 node /app/server.js", explanation: "Application server process" }
      ]
    }
  ],
  "-ef": [
    {
      line: "UID          PID    PPID  C STIME TTY          TIME CMD",
      segments: [
        { text: "UID          ", explanation: "User ID running the process" },
        { text: "PID    ", explanation: "Process ID" },
        { text: "PPID  ", explanation: "Parent Process ID" },
        { text: "C ", explanation: "Processor utilization" },
        { text: "STIME ", explanation: "Start time" },
        { text: "TTY          ", explanation: "Controlling terminal" },
        { text: "TIME ", explanation: "Cumulative CPU time" },
        { text: "CMD", explanation: "Command name and arguments" }
      ]
    },
    {
      line: "root           1       0  0 Oct12 ?        00:01:12 /sbin/init",
      segments: [
        { text: "root           1       ", explanation: "Init process" },
        { text: "0  ", explanation: "No parent process (kernel started it)" },
        { text: "0 Oct12 ?        00:01:12 ", explanation: "Metrics" },
        { text: "/sbin/init", explanation: "System initializer" }
      ]
    },
    {
      line: "root           2       0  0 Oct12 ?        00:00:00 [kthreadd]",
      segments: [
        { text: "root           2       0  0 Oct12 ?        00:00:00 ", explanation: "Kernel thread daemon process" },
        { text: "[kthreadd]", explanation: "Kernel process" }
      ]
    },
    {
      line: "root         890       1  0 Oct12 ?        00:00:02 sshd: /usr/sbin/sshd -D",
      segments: [
        { text: "root         890       ", explanation: "SSH daemon" },
        { text: "1  ", explanation: "Child of the init process" },
        { text: "0 Oct12 ?        00:00:02 sshd: /usr/sbin/sshd -D", explanation: "Command details" }
      ]
    },
    {
      line: "postgres    1105       1  0 Oct12 ?        00:12:45 postgres: main process",
      segments: [
        { text: "postgres    1105       1  0 Oct12 ?        00:12:45 ", explanation: "Main database process, child of init" },
        { text: "postgres: main process", explanation: "Database master" }
      ]
    },
    {
      line: "postgres    1107    1105  0 Oct12 ?        00:00:15 postgres: background writer",
      segments: [
        { text: "postgres    1107    ", explanation: "Database background worker" },
        { text: "1105  ", explanation: "Child of the postgres main process (PID 1105)" },
        { text: "0 Oct12 ?        00:00:15 postgres: background writer", explanation: "Command details" }
      ]
    },
    {
      line: "root         910       1  0 Oct12 ?        00:00:00 nginx: master process /usr/sbin/nginx -g daemon off;",
      segments: [
        { text: "root         910       1  0 Oct12 ?        00:00:00 ", explanation: "Nginx master running as root" },
        { text: "nginx: master process /usr/sbin/nginx -g daemon off;", explanation: "Master process managing web server workers" }
      ]
    },
    {
      line: "www-data     912     910  0 Oct12 ?        00:05:23 nginx: worker process",
      segments: [
        { text: "www-data     912     ", explanation: "Nginx worker running under www-data user" },
        { text: "910  ", explanation: "Child of the nginx master process (PID 910)" },
        { text: "0 Oct12 ?        00:05:23 nginx: worker process", explanation: "Command details" }
      ]
    },
    {
      line: "nodeuser    1540       1  0 Oct12 ?        00:45:12 node /app/server.js",
      segments: [
        { text: "nodeuser    1540       1  0 Oct12 ?        00:45:12 ", explanation: "Node server child of init" },
        { text: "node /app/server.js", explanation: "JavaScript runtime application" }
      ]
    }
  ]
};