import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs3B: Record<string, ExampleOutputLine[]> = {
  mount: [
    {
      line: "/dev/sda2 on / type ext4 (rw,relatime)",
      segments: [
        { text: "/dev/sda2 ", explanation: "Block device" },
        { text: "on / ", explanation: "Mounted as the root filesystem" },
        { text: "type ext4 ", explanation: "Filesystem type" },
        { text: "(rw,relatime)", explanation: "Mount options: read-write, update inode access times only if earlier than modification time (performance optimization)" }
      ]
    },
    {
      line: "/dev/sda1 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077)",
      segments: [
        { text: "/dev/sda1 on /boot/efi type vfat ", explanation: "FAT32 formatted EFI system boot partition" },
        { text: "(rw,relatime,fmask=0077,dmask=0077)", explanation: "Mount options enforcing strict file/directory permissions for security" }
      ]
    },
    {
      line: "/dev/sda3 on /home type ext4 (rw,relatime)",
      segments: [{ text: "/dev/sda3 on /home type ext4 (rw,relatime)", explanation: "User data partition" }]
    },
    {
      line: "tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=1638400k,mode=755)",
      segments: [
        { text: "tmpfs on /run type tmpfs ", explanation: "RAM-based volatile filesystem" },
        { text: "(rw,nosuid,nodev,noexec,relatime,size=1638400k,mode=755)", explanation: "Security-hardened mount options preventing execution or device creation within this temp folder" }
      ]
    },
    {
      line: "proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)",
      segments: [
        { text: "proc on /proc type proc ", explanation: "Virtual pseudo-filesystem providing a window into kernel processes" },
        { text: "(rw,nosuid,nodev,noexec,relatime)", explanation: "Options" }
      ]
    },
    {
      line: "sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)",
      segments: [
        { text: "sysfs on /sys type sysfs ", explanation: "Virtual pseudo-filesystem providing access to kernel hardware abstractions" },
        { text: "(rw,nosuid,nodev,noexec,relatime)", explanation: "Options" }
      ]
    }
  ],
  fdisk: [
    {
      line: "Disk /dev/sda: 500 GiB, 536870912000 bytes, 1048576000 sectors",
      segments: [
        { text: "Disk /dev/sda: ", explanation: "The device being analyzed" },
        { text: "500 GiB, 536870912000 bytes, ", explanation: "Capacity in human-readable and exact byte forms" },
        { text: "1048576000 sectors", explanation: "Total number of logical sectors on the disk" }
      ]
    },
    {
      line: "Disk model: VBOX HARDDISK",
      segments: [{ text: "Disk model: VBOX HARDDISK", explanation: "Hardware or virtual hypervisor identifier" }]
    },
    {
      line: "Units: sectors of 1 * 512 = 512 bytes",
      segments: [{ text: "Units: sectors of 1 * 512 = 512 bytes", explanation: "Defines the base unit used in the partition table (1 sector = 512 bytes)" }]
    },
    {
      line: "Sector size (logical/physical): 512 bytes / 512 bytes",
      segments: [{ text: "Sector size (logical/physical): 512 bytes / 512 bytes", explanation: "Hardware sector sizes. Advanced drives might use 4096 physical." }]
    },
    {
      line: "I/O size (minimum/optimal): 512 bytes / 512 bytes",
      segments: [{ text: "I/O size (minimum/optimal): 512 bytes / 512 bytes", explanation: "Alignment hints for filesystem creation" }]
    },
    {
      line: "Disklabel type: gpt",
      segments: [
        { text: "Disklabel type: ", explanation: "Partition table format" },
        { text: "gpt", explanation: "GUID Partition Table (modern standard replacing legacy DOS/MBR)" }
      ]
    },
    {
      line: "Disk identifier: A1B2C3D4-E5F6-7890-1234-567890ABCDEF",
      segments: [{ text: "Disk identifier: A1B2C3D4-E5F6-7890-1234-567890ABCDEF", explanation: "Unique GUID generated for this entire disk" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "Device         Start        End   Sectors  Size Type",
      segments: [{ text: "Device         Start        End   Sectors  Size Type", explanation: "Partition table headers" }]
    },
    {
      line: "/dev/sda1       2048    1050623   1048576  512M EFI System",
      segments: [
        { text: "/dev/sda1       ", explanation: "Partition 1" },
        { text: "2048    1050623   ", explanation: "Sector range. Notice it starts at 2048 to leave 1MB of empty space for alignment/bootloaders." },
        { text: "1048576  512M ", explanation: "Length in sectors and bytes" },
        { text: "EFI System", explanation: "Partition type code mapped to human-readable string" }
      ]
    },
    {
      line: "/dev/sda2    1050624  105906175 104855552   50G Linux filesystem",
      segments: [
        { text: "/dev/sda2    1050624  105906175 104855552   50G ", explanation: "Partition 2 geometry" },
        { text: "Linux filesystem", explanation: "Standard Linux data partition" }
      ]
    },
    {
      line: "/dev/sda3  105906176  525336575 419430400  200G Linux filesystem",
      segments: [{ text: "/dev/sda3  105906176  525336575 419430400  200G Linux filesystem", explanation: "Partition 3 geometry" }]
    },
    {
      line: "/dev/sda4  525336576  542113791  16777216    8G Linux swap",
      segments: [
        { text: "/dev/sda4  525336576  542113791  16777216    8G ", explanation: "Partition 4 geometry" },
        { text: "Linux swap", explanation: "Dedicated virtual memory partition" }
      ]
    }
  ],
  who: [
    {
      line: "admin    pts/0        2023-10-12 10:00 (192.168.1.50)",
      segments: [
        { text: "admin    ", explanation: "Logged in user" },
        { text: "pts/0        ", explanation: "Attached to a pseudo-terminal (likely SSH)" },
        { text: "2023-10-12 10:00 ", explanation: "Login timestamp" },
        { text: "(192.168.1.50)", explanation: "Remote IP address the user connected from" }
      ]
    },
    {
      line: "user     pts/1        2023-10-12 10:15 (192.168.1.51)",
      segments: [{ text: "user     pts/1        2023-10-12 10:15 (192.168.1.51)", explanation: "A second user logged in remotely" }]
    },
    {
      line: "dev      pts/2        2023-10-12 11:30 (192.168.1.52)",
      segments: [{ text: "dev      pts/2        2023-10-12 11:30 (192.168.1.52)", explanation: "A third user logged in remotely" }]
    },
    {
      line: "deploy   pts/3        2023-10-12 12:45 (10.0.0.15)",
      segments: [{ text: "deploy   pts/3        2023-10-12 12:45 (10.0.0.15)", explanation: "A service account logged in remotely" }]
    },
    {
      line: "root     tty1         2023-10-12 08:00",
      segments: [
        { text: "root     ", explanation: "The system administrator" },
        { text: "tty1         ", explanation: "Logged in directly at the physical console keyboard/monitor (Teletype 1)" },
        { text: "2023-10-12 08:00", explanation: "No IP is shown because it is a local login" }
      ]
    }
  ],
  w: [
    {
      line: " 14:32:05 up 12 days,  3:15,  5 users,  load average: 0.15, 0.22, 0.18",
      segments: [{ text: " 14:32:05 up 12 days,  3:15,  5 users,  load average: 0.15, 0.22, 0.18", explanation: "Standard uptime summary header" }]
    },
    {
      line: "USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT",
      segments: [
        { text: "USER     TTY      FROM             LOGIN@   ", explanation: "Basic login details" },
        { text: "IDLE   ", explanation: "Time since the user last typed anything" },
        { text: "JCPU   ", explanation: "Total CPU time used by all processes attached to this TTY" },
        { text: "PCPU ", explanation: "CPU time used by the currently active process" },
        { text: "WHAT", explanation: "The user's current foreground process" }
      ]
    },
    {
      line: "admin    pts/0    192.168.1.50     10:00    1:20m  0.45s  0.10s bash",
      segments: [
        { text: "admin    pts/0    192.168.1.50     10:00    ", explanation: "User details" },
        { text: "1:20m  ", explanation: "This user has been idle for 1 hour and 20 minutes" },
        { text: "0.45s  0.10s ", explanation: "Low CPU usage" },
        { text: "bash", explanation: "Just sitting at a bash shell prompt" }
      ]
    },
    {
      line: "user     pts/1    192.168.1.51     10:15    4:00   0.12s  0.05s vim index.js",
      segments: [
        { text: "user     pts/1    192.168.1.51     10:15    ", explanation: "User details" },
        { text: "4:00   ", explanation: "Idle for 4 minutes" },
        { text: "0.12s  0.05s ", explanation: "Metrics" },
        { text: "vim index.js", explanation: "Left a text editor open" }
      ]
    },
    {
      line: "dev      pts/2    192.168.1.52     11:30    0.00s  1.25s  0.50s top",
      segments: [
        { text: "dev      pts/2    192.168.1.52     11:30    ", explanation: "User details" },
        { text: "0.00s  ", explanation: "Actively typing or interacting right now" },
        { text: "1.25s  0.50s ", explanation: "Metrics" },
        { text: "top", explanation: "Actively monitoring system processes" }
      ]
    },
    {
      line: "deploy   pts/3    10.0.0.15        12:45    15:00  0.05s  0.01s tail -f /var/log/syslog",
      segments: [{ text: "deploy   pts/3    10.0.0.15        12:45    15:00  0.05s  0.01s tail -f /var/log/syslog", explanation: "User passively watching a log file stream" }]
    },
    {
      line: "root     tty1     -                08:00    6:32m  0.02s  0.02s -bash",
      segments: [
        { text: "root     tty1     ", explanation: "Local console login" },
        { text: "-                ", explanation: "No 'FROM' IP because it's a physical login" },
        { text: "08:00    6:32m  0.02s  0.02s -bash", explanation: "Logged in early, abandoned the terminal (idle over 6 hours)" }
      ]
    }
  ],
  last: [
    {
      line: "admin    pts/0        192.168.1.50     Thu Oct 12 10:00   still logged in",
      segments: [
        { text: "admin    pts/0        192.168.1.50     ", explanation: "User, terminal, and source IP" },
        { text: "Thu Oct 12 10:00   ", explanation: "Login time" },
        { text: "still logged in", explanation: "The session is currently active" }
      ]
    },
    {
      line: "user     pts/1        192.168.1.51     Thu Oct 12 10:15   still logged in",
      segments: [{ text: "user     pts/1        192.168.1.51     Thu Oct 12 10:15   still logged in", explanation: "Active remote session" }]
    },
    {
      line: "dev      pts/2        192.168.1.52     Thu Oct 12 11:30   still logged in",
      segments: [{ text: "dev      pts/2        192.168.1.52     Thu Oct 12 11:30   still logged in", explanation: "Active remote session" }]
    },
    {
      line: "deploy   pts/3        10.0.0.15        Thu Oct 12 12:45   still logged in",
      segments: [{ text: "deploy   pts/3        10.0.0.15        Thu Oct 12 12:45   still logged in", explanation: "Active remote session" }]
    },
    {
      line: "root     tty1                          Thu Oct 12 08:00   still logged in",
      segments: [{ text: "root     tty1                          Thu Oct 12 08:00   still logged in", explanation: "Active physical console session (blank IP)" }]
    },
    {
      line: "admin    pts/0        192.168.1.50     Wed Oct 11 09:00 - 17:00  (08:00)",
      segments: [
        { text: "admin    pts/0        192.168.1.50     Wed Oct 11 09:00 ", explanation: "A historical login event" },
        { text: "- 17:00  ", explanation: "Logout time" },
        { text: "(08:00)", explanation: "Total duration of the session (8 hours)" }
      ]
    },
    {
      line: "user     pts/1        192.168.1.51     Wed Oct 11 09:30 - 18:15  (08:45)",
      segments: [{ text: "user     pts/1        192.168.1.51     Wed Oct 11 09:30 - 18:15  (08:45)", explanation: "Historical session duration" }]
    },
    {
      line: "reboot   system boot  5.15.0-76-generi Tue Oct 01 11:17   still running",
      segments: [
        { text: "reboot   ", explanation: "Special pseudo-user indicating a system restart" },
        { text: "system boot  ", explanation: "Terminal shows 'system boot'" },
        { text: "5.15.0-76-generi ", explanation: "Kernel version logged instead of an IP" },
        { text: "Tue Oct 01 11:17   still running", explanation: "The system has not been shut down since this boot" }
      ]
    }
  ],
  lsof: [
    {
      line: "COMMAND     PID     USER   FD      TYPE             DEVICE SIZE/OFF       NODE NAME",
      segments: [
        { text: "COMMAND     PID     USER   ", explanation: "Process execution context" },
        { text: "FD      ", explanation: "File Descriptor (cwd=Current Working Dir, txt=Program Code, 1u/2u/3u=Numbered descriptors with u=read/write)" },
        { text: "TYPE             ", explanation: "Node type (DIR, REG file, IPv4 socket, etc)" },
        { text: "DEVICE SIZE/OFF       NODE ", explanation: "Disk block/size metrics" },
        { text: "NAME", explanation: "File path or socket address" }
      ]
    },
    {
      line: "systemd       1     root  cwd       DIR                8,2     4096          2 /",
      segments: [
        { text: "systemd       1     root  ", explanation: "Process context" },
        { text: "cwd       ", explanation: "Current Working Directory descriptor" },
        { text: "DIR                8,2     4096          2 ", explanation: "Directory metrics" },
        { text: "/", explanation: "PID 1 operates out of the root directory" }
      ]
    },
    {
      line: "nginx       912 www-data  cwd       DIR                8,2     4096          2 /",
      segments: [{ text: "nginx       912 www-data  cwd       DIR                8,2     4096          2 /", explanation: "Nginx working directory" }]
    },
    {
      line: "nginx       912 www-data    3u     IPv4              14500      0t0        TCP *:http (LISTEN)",
      segments: [
        { text: "nginx       912 www-data    ", explanation: "Process context" },
        { text: "3u     ", explanation: "File descriptor 3, open for reading and writing (u)" },
        { text: "IPv4              14500      0t0        TCP ", explanation: "Network socket metrics" },
        { text: "*:http (LISTEN)", explanation: "Socket bound to all IPs (*) on the http port (80) waiting for connections" }
      ]
    },
    {
      line: "postgres   1105 postgres  cwd       DIR                8,2     4096     154000 /var/lib/postgresql/14/main",
      segments: [
        { text: "postgres   1105 postgres  cwd       DIR                8,2     4096     154000 ", explanation: "Metrics" },
        { text: "/var/lib/postgresql/14/main", explanation: "Database cluster directory kept open by postgres" }
      ]
    },
    {
      line: "postgres   1105 postgres    3u     IPv4              18500      0t0        TCP localhost:postgresql (LISTEN)",
      segments: [{ text: "postgres   1105 postgres    3u     IPv4              18500      0t0        TCP localhost:postgresql (LISTEN)", explanation: "Postgres listening on local socket" }]
    },
    {
      line: "sshd        890     root    3u     IPv4              11200      0t0        TCP *:ssh (LISTEN)",
      segments: [{ text: "sshd        890     root    3u     IPv4              11200      0t0        TCP *:ssh (LISTEN)", explanation: "SSH daemon bound to all interfaces on port 22" }]
    },
    {
      line: "node       1540 nodeuser  cwd       DIR                8,2     4096     245000 /app",
      segments: [{ text: "node       1540 nodeuser  cwd       DIR                8,2     4096     245000 /app", explanation: "Node application's working directory" }]
    },
    {
      line: "chrome     3145     user   45r      REG                8,3 15400000     542000 /home/user/.cache/google-chrome/Default/Cache/data_1",
      segments: [
        { text: "chrome     3145     user   ", explanation: "Process context" },
        { text: "45r      ", explanation: "File descriptor 45, open for reading only (r)" },
        { text: "REG                8,3 15400000     542000 ", explanation: "A regular (REG) file of size 15.4MB" },
        { text: "/home/user/.cache/google-chrome/Default/Cache/data_1", explanation: "Browser cache file held open on disk" }
      ]
    }
  ],
  uptime: [
    {
      line: " 14:32:05 up 12 days,  3:15,  5 users,  load average: 0.15, 0.22, 0.18",
      segments: [
        { text: " 14:32:05 ", explanation: "Current system clock time" },
        { text: "up 12 days,  3:15,  ", explanation: "Duration since the system was last booted" },
        { text: "5 users,  ", explanation: "Count of currently logged-in interactive user terminal sessions" },
        { text: "load average: ", explanation: "System load representing the number of processes waiting for CPU or disk IO" },
        { text: "0.15, ", explanation: "1-minute rolling average" },
        { text: "0.22, ", explanation: "5-minute rolling average" },
        { text: "0.18", explanation: "15-minute rolling average" }
      ]
    }
  ],
  id: [
    {
      line: "uid=1000(developer) gid=1000(developer) groups=1000(developer),4(adm),27(sudo),44(video),100(users),999(docker)",
      segments: [
        { text: "uid=1000", explanation: "User ID number assigned by the OS" },
        { text: "(developer) ", explanation: "Human-readable username mapped in /etc/passwd" },
        { text: "gid=1000(developer) ", explanation: "Primary Group ID and name mapped in /etc/group" },
        { text: "groups=", explanation: "Supplementary groups this user is a member of, granting additional privileges" },
        { text: "1000(developer),4(adm),", explanation: "Standard groups" },
        { text: "27(sudo),", explanation: "Membership grants the ability to elevate privileges to root via the sudo command" },
        { text: "44(video),100(users),", explanation: "Device access and general groups" },
        { text: "999(docker)", explanation: "Membership grants full access to the docker socket (equivalent to root access)" }
      ]
    }
  ],
  blkid: [
    {
      line: "/dev/sda1: UUID=\"A1B2-C3D4\" BLOCK_SIZE=\"512\" TYPE=\"vfat\" PARTLABEL=\"EFI System Partition\" PARTUUID=\"1234abcd-1234-abcd-1234-abcd1234abcd\"",
      segments: [
        { text: "/dev/sda1: ", explanation: "Block device path" },
        { text: "UUID=\"A1B2-C3D4\" ", explanation: "Universally Unique Identifier for the filesystem (used in /etc/fstab)" },
        { text: "BLOCK_SIZE=\"512\" ", explanation: "Filesystem block size" },
        { text: "TYPE=\"vfat\" ", explanation: "Detected filesystem format" },
        { text: "PARTLABEL=\"EFI System Partition\" PARTUUID=\"1234abcd-1234-abcd-1234-abcd1234abcd\"", explanation: "GPT partition label and partition-specific UUID" }
      ]
    },
    {
      line: "/dev/sda2: UUID=\"f4a3b2c1-d5e6-f7a8-b9c0-d1e2f3a4b5c6\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"abcdef12-3456-7890-abcd-ef1234567890\"",
      segments: [{ text: "/dev/sda2: UUID=\"f4a3b2c1-d5e6-f7a8-b9c0-d1e2f3a4b5c6\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"abcdef12-3456-7890-abcd-ef1234567890\"", explanation: "Standard Linux ext4 root partition data" }]
    },
    {
      line: "/dev/sda3: UUID=\"1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"98765432-10ab-cdef-9876-543210abcdef\"",
      segments: [{ text: "/dev/sda3: UUID=\"1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"98765432-10ab-cdef-9876-543210abcdef\"", explanation: "Secondary ext4 partition data" }]
    },
    {
      line: "/dev/sda4: UUID=\"d6c5b4a3-f2e1-d0c9-b8a7-f6e5d4c3b2a1\" TYPE=\"swap\" PARTUUID=\"11223344-5566-7788-9900-aabbccddeeff\"",
      segments: [{ text: "/dev/sda4: UUID=\"d6c5b4a3-f2e1-d0c9-b8a7-f6e5d4c3b2a1\" TYPE=\"swap\" PARTUUID=\"11223344-5566-7788-9900-aabbccddeeff\"", explanation: "Swap partition signature detected" }]
    },
    {
      line: "/dev/nvme0n1p1: UUID=\"99887766-5544-3322-1100-ffeeddccbbaa\" BLOCK_SIZE=\"4096\" TYPE=\"xfs\" PARTUUID=\"ffeeddcc-bbaa-9988-7766-554433221100\"",
      segments: [{ text: "/dev/nvme0n1p1: UUID=\"99887766-5544-3322-1100-ffeeddccbbaa\" BLOCK_SIZE=\"4096\" TYPE=\"xfs\" PARTUUID=\"ffeeddcc-bbaa-9988-7766-554433221100\"", explanation: "High-performance XFS filesystem signature on an NVMe drive" }]
    }
  ],
  route: [
    {
      line: "Kernel IP routing table",
      segments: [{ text: "Kernel IP routing table", explanation: "Header indicating these rules control how the OS directs outbound network packets" }]
    },
    {
      line: "Destination     Gateway         Genmask         Flags Metric Ref    Use Iface",
      segments: [
        { text: "Destination     Gateway         Genmask         ", explanation: "Target network, router IP, and subnet mask" },
        { text: "Flags ", explanation: "U=Up, G=Gateway, H=Host" },
        { text: "Metric Ref    Use ", explanation: "Routing priority (lower is better) and usage stats" },
        { text: "Iface", explanation: "Network interface bound to this route" }
      ]
    },
    {
      line: "default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0",
      segments: [
        { text: "default         ", explanation: "The catch-all route for any packet not matching a more specific rule below" },
        { text: "192.168.1.1     ", explanation: "Your local router IP address" },
        { text: "0.0.0.0         ", explanation: "Mask covering all addresses" },
        { text: "UG    ", explanation: "Route is Up and uses a Gateway" },
        { text: "100    0        0 eth0", explanation: "Priority 100 on the eth0 interface" }
      ]
    },
    {
      line: "192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0",
      segments: [
        { text: "192.168.1.0     ", explanation: "Local subnet traffic" },
        { text: "0.0.0.0         ", explanation: "No gateway needed; devices communicate directly on switch" },
        { text: "255.255.255.0   U     100    0        0 eth0", explanation: "Standard /24 subnet route is Up" }
      ]
    },
    {
      line: "172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0",
      segments: [
        { text: "172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 ", explanation: "Metrics" },
        { text: "docker0", explanation: "Virtual bridge routing traffic for Docker containers" }
      ]
    },
    {
      line: "169.254.0.0     0.0.0.0         255.255.0.0     U     1000   0        0 eth0",
      segments: [{ text: "169.254.0.0     0.0.0.0         255.255.0.0     U     1000   0        0 eth0", explanation: "Link-local auto-configuration route (APIPA fallback)" }]
    }
  ],
  arp: [
    {
      line: "Address                  HWtype  HWaddress           Flags Mask            Iface",
      segments: [
        { text: "Address                  ", explanation: "Cached IPv4 address" },
        { text: "HWtype  HWaddress           ", explanation: "Hardware link type (usually ether) and MAC address" },
        { text: "Flags Mask            Iface", explanation: "Status flags (C=Completed/Cached, M=Permanent) and interface" }
      ]
    },
    {
      line: "192.168.1.1              ether   00:14:22:01:23:45   C                     eth0",
      segments: [
        { text: "192.168.1.1              ", explanation: "The IP of the local router" },
        { text: "ether   00:14:22:01:23:45   ", explanation: "The physical MAC address of the router discovered via ARP request" },
        { text: "C                     eth0", explanation: "Cached entry on eth0" }
      ]
    },
    {
      line: "192.168.1.50             ether   08:00:27:11:22:33   C                     eth0",
      segments: [{ text: "192.168.1.50             ether   08:00:27:11:22:33   C                     eth0", explanation: "Cached MAC for another local device (e.g. an admin PC)" }]
    },
    {
      line: "192.168.1.51             ether   52:54:00:aa:bb:cc   C                     eth0",
      segments: [{ text: "192.168.1.51             ether   52:54:00:aa:bb:cc   C                     eth0", explanation: "Cached MAC for a local virtual machine" }]
    },
    {
      line: "192.168.1.52             ether   b8:27:eb:dd:ee:ff   C                     eth0",
      segments: [{ text: "192.168.1.52             ether   b8:27:eb:dd:ee:ff   C                     eth0", explanation: "Cached MAC for an IoT device (e.g. Raspberry Pi)" }]
    }
  ],
  jobs: [
    {
      line: "[1]+  Running                 npm start &",
      segments: [
        { text: "[1]", explanation: "Job ID 1" },
        { text: "+  ", explanation: "The most recently foregrounded or backgrounded job (default target for 'fg')" },
        { text: "Running                 ", explanation: "Status indicating it is actively executing in the background" },
        { text: "npm start &", explanation: "The command line that launched the job" }
      ]
    },
    {
      line: "[2]-  Stopped                 vim config.json",
      segments: [
        { text: "[2]", explanation: "Job ID 2" },
        { text: "-  ", explanation: "The previous default job" },
        { text: "Stopped                 ", explanation: "Suspended (usually by pressing Ctrl+Z) and holding no CPU time" },
        { text: "vim config.json", explanation: "An interactive text editor waiting to be brought back to foreground" }
      ]
    },
    {
      line: "[3]   Running                 tail -f /var/log/syslog &",
      segments: [{ text: "[3]   Running                 tail -f /var/log/syslog &", explanation: "A backgrounded task monitoring logs" }]
    },
    {
      line: "[4]   Running                 python3 server.py &",
      segments: [{ text: "[4]   Running                 python3 server.py &", explanation: "A backgrounded Python server" }]
    }
  ],
  nmap: [
    {
      line: "Starting Nmap 7.80 ( https://nmap.org ) at 2023-10-12 14:32 UTC",
      segments: [
        { text: "Starting Nmap 7.80 ", explanation: "Tool version" },
        { text: "( https://nmap.org ) at 2023-10-12 14:32 UTC", explanation: "Scan timestamp" }
      ]
    },
    {
      line: "Nmap scan report for target.local (192.168.1.100)",
      segments: [
        { text: "Nmap scan report for ", explanation: "Scan results block" },
        { text: "target.local ", explanation: "Resolved hostname" },
        { text: "(192.168.1.100)", explanation: "Target IP address" }
      ]
    },
    {
      line: "Host is up (0.0012s latency).",
      segments: [
        { text: "Host is up ", explanation: "Indicates the target responded to ICMP echo or port probes" },
        { text: "(0.0012s latency).", explanation: "Extremely low ping response time indicating a local network target" }
      ]
    },
    {
      line: "Not shown: 994 closed ports",
      segments: [{ text: "Not shown: 994 closed ports", explanation: "Nmap scanned 1000 common ports by default; 994 immediately rejected connections" }]
    },
    {
      line: "PORT     STATE SERVICE",
      segments: [{ text: "PORT     STATE SERVICE", explanation: "Table header for discovered listening ports" }]
    },
    {
      line: "22/tcp   open  ssh",
      segments: [
        { text: "22/tcp   ", explanation: "TCP port 22" },
        { text: "open  ", explanation: "Successfully completed a TCP handshake" },
        { text: "ssh", explanation: "Assumed service based on /etc/services mapping" }
      ]
    },
    {
      line: "80/tcp   open  http",
      segments: [{ text: "80/tcp   open  http", explanation: "Unencrypted web server port" }]
    },
    {
      line: "443/tcp  open  https",
      segments: [{ text: "443/tcp  open  https", explanation: "Encrypted web server port" }]
    },
    {
      line: "3306/tcp open  mysql",
      segments: [{ text: "3306/tcp open  mysql", explanation: "MySQL database port exposed to network" }]
    },
    {
      line: "5432/tcp open  postgresql",
      segments: [{ text: "5432/tcp open  postgresql", explanation: "PostgreSQL database port exposed to network" }]
    },
    {
      line: "8080/tcp open  http-proxy",
      segments: [{ text: "8080/tcp open  http-proxy", explanation: "Alternate HTTP port (often used for Tomcat, Node, or proxies)" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "Nmap done: 1 IP address (1 host up) scanned in 1.25 seconds",
      segments: [
        { text: "Nmap done: ", explanation: "Completion footer" },
        { text: "1 IP address (1 host up) scanned ", explanation: "Summary of targets" },
        { text: "in 1.25 seconds", explanation: "Total time taken for the scan" }
      ]
    }
  ]
};