export type ExampleOutputSegment = {
  text: string;
  explanation: string;
};

export type ExampleOutputLine = {
  line: string;
  segments: ExampleOutputSegment[];
};

export const linuxCmdExampleOutputs: Record<string, ExampleOutputLine[]> = {
  // ---------------------------------------------------------------------------
  // FILE MANAGEMENT
  // ---------------------------------------------------------------------------
  ls: [
    {
      line: "Desktop  Documents  Downloads  Music",
      segments: [
        { text: "Desktop  Documents  Downloads  Music", explanation: "Directories listed in the current folder" }
      ]
    },
    {
      line: "Pictures  Videos  file.txt  package.json",
      segments: [
        { text: "Pictures  Videos  ", explanation: "More directories" },
        { text: "file.txt  package.json", explanation: "Files listed alongside directories" }
      ]
    }
  ],
  pwd: [
    {
      line: "/home/user/projects",
      segments: [
        { text: "/", explanation: "The root directory, the top of the filesystem" },
        { text: "home/user/projects", explanation: "The absolute path from root to your current working directory" }
      ]
    }
  ],
  cp: [
    {
      line: "'file.txt' -> '/tmp/file.txt'",
      segments: [
        { text: "'file.txt'", explanation: "The source file being copied" },
        { text: " -> ", explanation: "Indicator showing the direction of the copy (visible with -v flag)" },
        { text: "'/tmp/file.txt'", explanation: "The destination path where the new copy is placed" }
      ]
    }
  ],
  find: [
    {
      line: "./src/index.js",
      segments: [
        { text: "./", explanation: "Relative to the current directory" },
        { text: "src/", explanation: "Inside the 'src' folder" },
        { text: "index.js", explanation: "The matched file name" }
      ]
    },
    {
      line: "./src/utils/helpers.js",
      segments: [
        { text: "./src/utils/helpers.js", explanation: "Another matched file matching the search criteria" }
      ]
    }
  ],
  tree: [
    {
      line: ".",
      segments: [
        { text: ".", explanation: "The starting directory for the tree command" }
      ]
    },
    {
      line: "├── src",
      segments: [
        { text: "├── ", explanation: "Branch indicating a subdirectory or file" },
        { text: "src", explanation: "A folder named 'src'" }
      ]
    },
    {
      line: "│   └── index.js",
      segments: [
        { text: "│   ", explanation: "Vertical line showing hierarchy depth" },
        { text: "└── ", explanation: "Terminal branch indicating the last item in this folder" },
        { text: "index.js", explanation: "A file within the 'src' folder" }
      ]
    },
    {
      line: "└── package.json",
      segments: [
        { text: "└── ", explanation: "Terminal branch in the root folder" },
        { text: "package.json", explanation: "A file at the root level" }
      ]
    }
  ],
  stat: [
    {
      line: "  File: file.txt",
      segments: [
        { text: "  File: ", explanation: "Label for the file name" },
        { text: "file.txt", explanation: "The name of the file being analyzed" }
      ]
    },
    {
      line: "  Size: 1024      	Blocks: 8          IO Block: 4096   regular file",
      segments: [
        { text: "  Size: 1024      	", explanation: "Size of the file in bytes" },
        { text: "Blocks: 8          ", explanation: "Number of 512-byte blocks allocated on disk" },
        { text: "IO Block: 4096   ", explanation: "Optimal file system I/O block size" },
        { text: "regular file", explanation: "The type of the file" }
      ]
    },
    {
      line: "Access: (0644/-rw-r--r--)  Uid: ( 1000/    user)   Gid: ( 1000/   group)",
      segments: [
        { text: "Access: (0644/-rw-r--r--)  ", explanation: "Permissions in octal and symbolic formats" },
        { text: "Uid: ( 1000/    user)   ", explanation: "User ID and name of the owner" },
        { text: "Gid: ( 1000/   group)", explanation: "Group ID and name of the group" }
      ]
    }
  ],
  du: [
    {
      line: "4096	./src/components",
      segments: [
        { text: "4096	", explanation: "Disk usage in 1024-byte blocks (approx 4MB)" },
        { text: "./src/components", explanation: "The directory consuming this space" }
      ]
    },
    {
      line: "8192	./src",
      segments: [
        { text: "8192	", explanation: "Total disk usage in 1024-byte blocks for this folder and its subfolders" },
        { text: "./src", explanation: "The parent directory" }
      ]
    }
  ],
  df: [
    {
      line: "Filesystem     1K-blocks      Used Available Use% Mounted on",
      segments: [
        { text: "Filesystem     ", explanation: "Name of the storage device or partition" },
        { text: "1K-blocks      ", explanation: "Total size in 1-kilobyte blocks" },
        { text: "Used ", explanation: "Amount of space used" },
        { text: "Available ", explanation: "Amount of space available" },
        { text: "Use% ", explanation: "Percentage of space used" },
        { text: "Mounted on", explanation: "Where the filesystem is attached in the directory tree" }
      ]
    },
    {
      line: "/dev/sda1       20480000   1500000  18000000   8% /",
      segments: [
        { text: "/dev/sda1       ", explanation: "First partition of the first SCSI/SATA drive" },
        { text: "20480000   ", explanation: "Roughly 20GB total capacity" },
        { text: "1500000  ", explanation: "Roughly 1.5GB used" },
        { text: "18000000   ", explanation: "Roughly 18GB free" },
        { text: "8% ", explanation: "Only 8% of the drive is full" },
        { text: "/", explanation: "Mounted as the root directory" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // TEXT PROCESSING
  // ---------------------------------------------------------------------------
  cat: [
    {
      line: "Hello world!",
      segments: [
        { text: "Hello world!", explanation: "The first line of the text file being read" }
      ]
    },
    {
      line: "This is a plain text file.",
      segments: [
        { text: "This is a plain text file.", explanation: "The second line of the text file" }
      ]
    }
  ],
  grep: [
    {
      line: "src/index.js: console.log('error occurred');",
      segments: [
        { text: "src/index.js", explanation: "The file where the match was found (shown when searching multiple files)" },
        { text: ": ", explanation: "Separator" },
        { text: "console.log('error occurred');", explanation: "The actual line containing the matching search term" }
      ]
    }
  ],
  head: [
    {
      line: "import React from 'react';",
      segments: [
        { text: "import React from 'react';", explanation: "Line 1 of the file output by head" }
      ]
    },
    {
      line: "import { useState } from 'react';",
      segments: [
        { text: "import { useState } from 'react';", explanation: "Line 2 of the file output by head" }
      ]
    }
  ],
  tail: [
    {
      line: "export default App;",
      segments: [
        { text: "export default App;", explanation: "The very last line of the file output by tail" }
      ]
    }
  ],
  wc: [
    {
      line: " 150  450 3042 file.txt",
      segments: [
        { text: " 150", explanation: "Number of lines in the file" },
        { text: "  450", explanation: "Number of words in the file" },
        { text: " 3042", explanation: "Number of bytes in the file" },
        { text: " file.txt", explanation: "The name of the file analyzed" }
      ]
    }
  ],
  sort: [
    {
      line: "apple",
      segments: [{ text: "apple", explanation: "First item in alphabetical order" }]
    },
    {
      line: "banana",
      segments: [{ text: "banana", explanation: "Second item in alphabetical order" }]
    },
    {
      line: "cherry",
      segments: [{ text: "cherry", explanation: "Third item in alphabetical order" }]
    }
  ],
  awk: [
    {
      line: "root",
      segments: [
        { text: "root", explanation: "The extracted first column (e.g., username from /etc/passwd)" }
      ]
    },
    {
      line: "daemon",
      segments: [
        { text: "daemon", explanation: "The extracted first column of the second line" }
      ]
    }
  ],
  sed: [
    {
      line: "The quick brown cat jumps over the lazy dog.",
      segments: [
        { text: "The quick brown ", explanation: "Unmodified text" },
        { text: "cat", explanation: "The text that was substituted (e.g., replaced 'fox' with 'cat')" },
        { text: " jumps over the lazy dog.", explanation: "Unmodified text" }
      ]
    }
  ],
  diff: [
    {
      line: "--- a/file.txt",
      segments: [
        { text: "--- ", explanation: "Indicates the original file" },
        { text: "a/file.txt", explanation: "Path to the original file" }
      ]
    },
    {
      line: "+++ b/file.txt",
      segments: [
        { text: "+++ ", explanation: "Indicates the modified file" },
        { text: "b/file.txt", explanation: "Path to the modified file" }
      ]
    },
    {
      line: "@@ -1,3 +1,3 @@",
      segments: [
        { text: "@@ ", explanation: "Chunk header start" },
        { text: "-1,3 ", explanation: "Original file lines 1 to 3" },
        { text: "+1,3 ", explanation: "Modified file lines 1 to 3" },
        { text: "@@", explanation: "Chunk header end" }
      ]
    },
    {
      line: "-old line",
      segments: [
        { text: "-", explanation: "Indicates a line removed from the original file" },
        { text: "old line", explanation: "The removed text" }
      ]
    },
    {
      line: "+new line",
      segments: [
        { text: "+", explanation: "Indicates a line added to the modified file" },
        { text: "new line", explanation: "The added text" }
      ]
    }
  ],
  echo: [
    {
      line: "Hello, World!",
      segments: [
        { text: "Hello, World!", explanation: "The text printed back to standard output" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // SYSTEM/PROCESS
  // ---------------------------------------------------------------------------
  uname: [
    {
      line: "Linux hostname 5.15.0-76-generic #83-Ubuntu SMP Wed Jun 21 20:23:31 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux",
      segments: [
        { text: "Linux ", explanation: "Kernel name" },
        { text: "hostname ", explanation: "Network node hostname" },
        { text: "5.15.0-76-generic ", explanation: "Kernel release version" },
        { text: "#83-Ubuntu SMP Wed Jun 21 20:23:31 UTC 2023 ", explanation: "Kernel build date and details" },
        { text: "x86_64 ", explanation: "Machine hardware name" },
        { text: "x86_64 ", explanation: "Processor architecture" },
        { text: "x86_64 ", explanation: "Hardware platform" },
        { text: "GNU/Linux", explanation: "Operating System" }
      ]
    }
  ],
  uptime: [
    {
      line: " 10:30:15 up 15 days,  2:45,  3 users,  load average: 0.05, 0.03, 0.01",
      segments: [
        { text: " 10:30:15 ", explanation: "Current system time" },
        { text: "up 15 days,  2:45,  ", explanation: "How long the system has been running since last boot" },
        { text: "3 users,  ", explanation: "Number of currently logged-in user sessions" },
        { text: "load average: ", explanation: "Label for CPU load averages" },
        { text: "0.05, ", explanation: "Average system load over the last 1 minute" },
        { text: "0.03, ", explanation: "Average system load over the last 5 minutes" },
        { text: "0.01", explanation: "Average system load over the last 15 minutes" }
      ]
    }
  ],
  whoami: [
    {
      line: "ubuntu",
      segments: [
        { text: "ubuntu", explanation: "The username of the currently logged-in user executing the command" }
      ]
    }
  ],
  ps: [
    {
      line: "  PID TTY          TIME CMD",
      segments: [
        { text: "  PID ", explanation: "Process ID, a unique number identifying the running program" },
        { text: "TTY          ", explanation: "Terminal type that the process is attached to" },
        { text: "TIME ", explanation: "Total accumulated CPU time used by the process" },
        { text: "CMD", explanation: "The command that started the process" }
      ]
    },
    {
      line: " 1234 pts/0    00:00:00 bash",
      segments: [
        { text: " 1234 ", explanation: "The Process ID for this shell" },
        { text: "pts/0    ", explanation: "Pseudo-terminal 0 (an SSH or terminal emulator window)" },
        { text: "00:00:00 ", explanation: "Less than 1 second of CPU time used" },
        { text: "bash", explanation: "The Bourne Again SHell" }
      ]
    }
  ],
  top: [
    {
      line: "top - 10:30:15 up 15 days,  2:45,  3 users,  load average: 0.05, 0.03, 0.01",
      segments: [
        { text: "top - ", explanation: "Command name" },
        { text: "10:30:15 up 15 days,  2:45,  3 users,  load average: 0.05, 0.03, 0.01", explanation: "Standard uptime information (time, uptime, users, load)" }
      ]
    },
    {
      line: "Tasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie",
      segments: [
        { text: "Tasks: 120 total,   ", explanation: "Total number of processes" },
        { text: "1 running, ", explanation: "Processes actively using the CPU" },
        { text: "119 sleeping,   ", explanation: "Processes waiting for an event (like I/O)" },
        { text: "0 stopped,   0 zombie", explanation: "Halted processes and child processes waiting for cleanup" }
      ]
    }
  ],
  free: [
    {
      line: "               total        used        free      shared  buff/cache   available",
      segments: [
        { text: "               ", explanation: "Padding" },
        { text: "total        ", explanation: "Total installed memory" },
        { text: "used        ", explanation: "Memory currently in use by processes" },
        { text: "free      ", explanation: "Completely unused memory" },
        { text: "shared  ", explanation: "Memory used by tmpfs (shared between processes)" },
        { text: "buff/cache   ", explanation: "Memory used by the kernel to cache disk data for speed" },
        { text: "available", explanation: "Estimate of how much memory is available for starting new applications" }
      ]
    },
    {
      line: "Mem:         8192000     2048000     1024000      256000     5120000     5800000",
      segments: [
        { text: "Mem:         ", explanation: "Physical RAM stats" },
        { text: "8192000     ", explanation: "Roughly 8GB total RAM" },
        { text: "2048000     ", explanation: "Roughly 2GB used" },
        { text: "1024000      ", explanation: "Roughly 1GB entirely free" },
        { text: "256000     ", explanation: "Shared memory" },
        { text: "5120000     ", explanation: "Roughly 5GB in buff/cache (can be freed if needed)" },
        { text: "5800000", explanation: "Roughly 5.8GB available for new processes" }
      ]
    }
  ],
  date: [
    {
      line: "Thu Oct 12 10:30:00 UTC 2023",
      segments: [
        { text: "Thu ", explanation: "Day of the week (Thursday)" },
        { text: "Oct 12 ", explanation: "Month and day" },
        { text: "10:30:00 ", explanation: "Time in HH:MM:SS" },
        { text: "UTC ", explanation: "Timezone (Coordinated Universal Time)" },
        { text: "2023", explanation: "Year" }
      ]
    }
  ],
  kill: [
    {
      line: "[1]+  Terminated              sleep 100",
      segments: [
        { text: "[1]+  ", explanation: "Job number indicator" },
        { text: "Terminated              ", explanation: "Status showing the process received a SIGTERM signal and closed" },
        { text: "sleep 100", explanation: "The original command that was killed" }
      ]
    }
  ],
  lsblk: [
    {
      line: "NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS",
      segments: [
        { text: "NAME   ", explanation: "Device name" },
        { text: "MAJ:MIN ", explanation: "Major and minor device numbers" },
        { text: "RM   ", explanation: "Removable device flag (1 if removable, 0 if not)" },
        { text: "SIZE ", explanation: "Total size of the device" },
        { text: "RO ", explanation: "Read-only flag" },
        { text: "TYPE ", explanation: "Device type (disk, part, rom)" },
        { text: "MOUNTPOINTS", explanation: "Where the device is mounted in the filesystem" }
      ]
    },
    {
      line: "sda      8:0    0   100G  0 disk ",
      segments: [
        { text: "sda      ", explanation: "First SCSI/SATA disk" },
        { text: "8:0    ", explanation: "Major:Minor number for sda" },
        { text: "0   ", explanation: "Not removable" },
        { text: "100G  ", explanation: "100 Gigabytes capacity" },
        { text: "0 ", explanation: "Not read-only (writable)" },
        { text: "disk ", explanation: "It is an entire disk, not a partition" }
      ]
    },
    {
      line: "├─sda1   8:1    0    99G  0 part /",
      segments: [
        { text: "├─sda1   ", explanation: "First partition on sda" },
        { text: "8:1    ", explanation: "Major:Minor number" },
        { text: "0    ", explanation: "Not removable" },
        { text: "99G  ", explanation: "99 Gigabytes capacity" },
        { text: "0 ", explanation: "Writable" },
        { text: "part ", explanation: "It is a partition" },
        { text: "/", explanation: "Mounted as the root filesystem" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // NETWORK
  // ---------------------------------------------------------------------------
  ping: [
    {
      line: "PING google.com (142.250.190.46) 56(84) bytes of data.",
      segments: [
        { text: "PING google.com ", explanation: "Target domain" },
        { text: "(142.250.190.46) ", explanation: "Resolved IP address of the target" },
        { text: "56(84) bytes of data.", explanation: "Size of the ICMP packet being sent" }
      ]
    },
    {
      line: "64 bytes from 142.250.190.46: icmp_seq=1 ttl=115 time=12.4 ms",
      segments: [
        { text: "64 bytes from 142.250.190.46: ", explanation: "Received reply from the IP" },
        { text: "icmp_seq=1 ", explanation: "Sequence number of this packet (first packet)" },
        { text: "ttl=115 ", explanation: "Time To Live (remaining network hops before packet is dropped)" },
        { text: "time=12.4 ms", explanation: "Round trip time for the packet" }
      ]
    }
  ],
  curl: [
    {
      line: "HTTP/1.1 200 OK",
      segments: [
        { text: "HTTP/1.1 ", explanation: "Protocol version" },
        { text: "200 OK", explanation: "Success status code indicating the request succeeded" }
      ]
    },
    {
      line: "Content-Type: text/html; charset=UTF-8",
      segments: [
        { text: "Content-Type: ", explanation: "HTTP header indicating the media type of the resource" },
        { text: "text/html; charset=UTF-8", explanation: "The resource is an HTML document encoded in UTF-8" }
      ]
    }
  ],
  ssh: [
    {
      line: "user@hostname's password: ",
      segments: [
        { text: "user@hostname", explanation: "The user and machine you are attempting to log into" },
        { text: "'s password: ", explanation: "Prompt waiting for your authentication password (typing will be hidden)" }
      ]
    },
    {
      line: "Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-76-generic x86_64)",
      segments: [
        { text: "Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-76-generic x86_64)", explanation: "Message of the day (MOTD) printed upon successful remote login" }
      ]
    }
  ],
  netstat: [
    {
      line: "Proto Recv-Q Send-Q Local Address           Foreign Address         State      ",
      segments: [
        { text: "Proto ", explanation: "Protocol used (TCP/UDP)" },
        { text: "Recv-Q Send-Q ", explanation: "Queued bytes waiting to be received/sent" },
        { text: "Local Address           ", explanation: "IP and port on this machine" },
        { text: "Foreign Address         ", explanation: "IP and port of the remote machine" },
        { text: "State      ", explanation: "Connection state (e.g., ESTABLISHED, LISTEN)" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        ", explanation: "TCP connection" },
        { text: "0      0 ", explanation: "No data queued" },
        { text: "0.0.0.0:22              ", explanation: "Local server listening on port 22 (SSH)" },
        { text: "0.0.0.0:*               ", explanation: "Accepting connections from anywhere" },
        { text: "LISTEN     ", explanation: "Waiting for incoming connections" }
      ]
    },
    {
      line: "tcp        0      0 10.0.0.5:22             10.0.0.10:49152         ESTABLISHED",
      segments: [
        { text: "tcp        ", explanation: "TCP connection" },
        { text: "0      0 ", explanation: "No data queued" },
        { text: "10.0.0.5:22             ", explanation: "Local server IP and port" },
        { text: "10.0.0.10:49152         ", explanation: "Remote client connected from port 49152" },
        { text: "ESTABLISHED", explanation: "Active connection in progress" }
      ]
    }
  ],
  dig: [
    {
      line: "; <<>> DiG 9.18.12-0ubuntu0.22.04.2 <<>> example.com",
      segments: [
        { text: "; <<>> DiG 9.18.12-0ubuntu0.22.04.2 <<>> ", explanation: "Version of the dig tool" },
        { text: "example.com", explanation: "The domain being queried" }
      ]
    },
    {
      line: ";; ANSWER SECTION:",
      segments: [
        { text: ";; ANSWER SECTION:", explanation: "Header indicating the resolved records follow" }
      ]
    },
    {
      line: "example.com.		86400	IN	A	93.184.216.34",
      segments: [
        { text: "example.com.		", explanation: "Queried domain" },
        { text: "86400	", explanation: "Time To Live (TTL) in seconds before cache expires" },
        { text: "IN	", explanation: "Internet class record" },
        { text: "A	", explanation: "A record (maps domain to IPv4 address)" },
        { text: "93.184.216.34", explanation: "The resolved IP address" }
      ]
    }
  ],
  ip: [
    {
      line: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000",
      segments: [
        { text: "1: ", explanation: "Interface index" },
        { text: "lo: ", explanation: "Interface name (loopback)" },
        { text: "<LOOPBACK,UP,LOWER_UP> ", explanation: "Flags indicating the interface is active and linked" },
        { text: "mtu 65536 ", explanation: "Maximum Transmission Unit (max packet size)" },
        { text: "qdisc noqueue state UNKNOWN group default qlen 1000", explanation: "Advanced queuing and state information" }
      ]
    },
    {
      line: "    inet 127.0.0.1/8 scope host lo",
      segments: [
        { text: "    inet ", explanation: "IPv4 protocol" },
        { text: "127.0.0.1/8 ", explanation: "The IP address and subnet mask (/8)" },
        { text: "scope host lo", explanation: "Scope of this address is restricted to the host itself on the 'lo' interface" }
      ]
    }
  ],
  nmap: [
    {
      line: "Starting Nmap 7.80 ( https://nmap.org ) at 2023-10-12 10:30 UTC",
      segments: [
        { text: "Starting Nmap 7.80 ", explanation: "Tool version" },
        { text: "( https://nmap.org ) at 2023-10-12 10:30 UTC", explanation: "Execution timestamp" }
      ]
    },
    {
      line: "PORT   STATE SERVICE",
      segments: [
        { text: "PORT   STATE SERVICE", explanation: "Table header for discovered ports" }
      ]
    },
    {
      line: "22/tcp open  ssh",
      segments: [
        { text: "22/tcp ", explanation: "Port 22 using TCP protocol" },
        { text: "open  ", explanation: "The port is accepting connections" },
        { text: "ssh", explanation: "The service typically running on this port" }
      ]
    }
  ],
  traceroute: [
    {
      line: "traceroute to example.com (93.184.216.34), 30 hops max, 60 byte packets",
      segments: [
        { text: "traceroute to example.com ", explanation: "Target domain" },
        { text: "(93.184.216.34), ", explanation: "Resolved IP of the target" },
        { text: "30 hops max, 60 byte packets", explanation: "Maximum routers to pass through and size of trace packets" }
      ]
    },
    {
      line: " 1  router (192.168.1.1)  1.123 ms  1.054 ms  1.021 ms",
      segments: [
        { text: " 1  ", explanation: "First hop (your local router)" },
        { text: "router (192.168.1.1)  ", explanation: "Hostname and IP of the router" },
        { text: "1.123 ms  1.054 ms  1.021 ms", explanation: "Latency for three distinct probe packets sent to this hop" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // ADMIN/SECURITY
  // ---------------------------------------------------------------------------
  chmod: [
    {
      line: "mode of 'script.sh' changed from 0644 (rw-r--r--) to 0755 (rwxr-xr-x)",
      segments: [
        { text: "mode of 'script.sh' changed ", explanation: "Confirmation that permissions were modified (shown when using -v flag)" },
        { text: "from 0644 (rw-r--r--) ", explanation: "The old permissions (read/write for owner, read-only for others)" },
        { text: "to 0755 (rwxr-xr-x)", explanation: "The new permissions (executable added for owner, group, and others)" }
      ]
    }
  ],
  sudo: [
    {
      line: "[sudo] password for user: ",
      segments: [
        { text: "[sudo] ", explanation: "Indicator that the sudo program is running" },
        { text: "password for user: ", explanation: "Prompt asking for your own user password to authenticate elevation of privileges" }
      ]
    }
  ],
  apt: [
    {
      line: "Reading package lists... Done",
      segments: [
        { text: "Reading package lists... Done", explanation: "APT successfully read the local database of available software" }
      ]
    },
    {
      line: "Building dependency tree... Done",
      segments: [
        { text: "Building dependency tree... Done", explanation: "APT calculated which additional packages are needed" }
      ]
    },
    {
      line: "The following NEW packages will be installed:",
      segments: [
        { text: "The following NEW packages will be installed:", explanation: "Summary header before asking for confirmation" }
      ]
    },
    {
      line: "  htop",
      segments: [
        { text: "  htop", explanation: "The specific package that will be installed" }
      ]
    }
  ],
  useradd: [
    {
      line: "useradd: user 'test' already exists",
      segments: [
        { text: "useradd: ", explanation: "The program generating the output" },
        { text: "user 'test' already exists", explanation: "Error message indicating the username is already taken" }
      ]
    }
  ],
  passwd: [
    {
      line: "Changing password for user test.",
      segments: [
        { text: "Changing password for user test.", explanation: "Confirmation of the target account" }
      ]
    },
    {
      line: "New password: ",
      segments: [
        { text: "New password: ", explanation: "Prompt to type the new password securely" }
      ]
    },
    {
      line: "Retype new password: ",
      segments: [
        { text: "Retype new password: ", explanation: "Prompt to confirm the exact same password" }
      ]
    },
    {
      line: "passwd: all authentication tokens updated successfully.",
      segments: [
        { text: "passwd: all authentication tokens updated successfully.", explanation: "Success message indicating the password is changed in /etc/shadow" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // MISC/SHELL
  // ---------------------------------------------------------------------------
  tar: [
    {
      line: "archive/",
      segments: [
        { text: "archive/", explanation: "The parent directory extracted from the tarball (visible with -v flag)" }
      ]
    },
    {
      line: "archive/file1.txt",
      segments: [
        { text: "archive/file1.txt", explanation: "A file extracted into the folder" }
      ]
    },
    {
      line: "archive/file2.txt",
      segments: [
        { text: "archive/file2.txt", explanation: "Another file extracted" }
      ]
    }
  ],
  git: [
    {
      line: "On branch main",
      segments: [
        { text: "On branch ", explanation: "Current active branch indicator" },
        { text: "main", explanation: "The name of the branch" }
      ]
    },
    {
      line: "Your branch is up to date with 'origin/main'.",
      segments: [
        { text: "Your branch is up to date with 'origin/main'.", explanation: "Status showing no commits are pending to be pushed or pulled from remote" }
      ]
    },
    {
      line: "nothing to commit, working tree clean",
      segments: [
        { text: "nothing to commit, working tree clean", explanation: "No modified tracked files or new untracked files exist" }
      ]
    }
  ],
  history: [
    {
      line: "  100  ls -la",
      segments: [
        { text: "  100  ", explanation: "The history event number" },
        { text: "ls -la", explanation: "The command previously executed" }
      ]
    },
    {
      line: "  101  cd src/",
      segments: [
        { text: "  101  ", explanation: "The history event number" },
        { text: "cd src/", explanation: "The command previously executed" }
      ]
    }
  ],
  which: [
    {
      line: "/usr/bin/python3",
      segments: [
        { text: "/usr/bin/", explanation: "Standard system binaries directory" },
        { text: "python3", explanation: "The exact executable that will run when you type 'python3'" }
      ]
    }
  ],
  man: [
    {
      line: "LS(1)                            User Commands                           LS(1)",
      segments: [
        { text: "LS(1)                            ", explanation: "Command name and section (1 = general commands)" },
        { text: "User Commands                           ", explanation: "The category of the manual" },
        { text: "LS(1)", explanation: "Command name and section" }
      ]
    },
    {
      line: "NAME",
      segments: [
        { text: "NAME", explanation: "Header for the summary section" }
      ]
    },
    {
      line: "       ls - list directory contents",
      segments: [
        { text: "       ls ", explanation: "The command" },
        { text: "- list directory contents", explanation: "A brief description of what it does" }
      ]
    }
  ],
  env: [
    {
      line: "SHELL=/bin/bash",
      segments: [
        { text: "SHELL", explanation: "Environment variable defining your default shell" },
        { text: "=", explanation: "Assignment operator" },
        { text: "/bin/bash", explanation: "The path to the bash executable" }
      ]
    },
    {
      line: "PWD=/home/user/projects",
      segments: [
        { text: "PWD", explanation: "Environment variable storing the Print Working Directory" },
        { text: "=", explanation: "Assignment operator" },
        { text: "/home/user/projects", explanation: "Your current path" }
      ]
    }
  ]
};