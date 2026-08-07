import { CommandDef } from "./CommandDef";

export const linuxCmdsSystemProcess: CommandDef[] = [
  {
    name: "uname",
    description: "Print system information.",
    useCases: ["Check kernel version", "Identify operating system"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Print all information" },
      "-r": { description: "Print the kernel release" }
    },
    exampleOutputLines: [],
    relatedCommands: ["hostname", "top"],
    category: "system-info"
  },
  {
    name: "hostname",
    description: "Show or set the system's host name.",
    useCases: ["Find out the name of your machine on the network"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-I": { description: "Display all network addresses of the host" }
    },
    exampleOutputLines: [],
    relatedCommands: ["uname"],
    category: "system-info"
  },
  {
    name: "uptime",
    description: "Tell how long the system has been running.",
    useCases: ["Check if a server rebooted recently", "Check system load averages"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Show uptime in a pretty format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["w", "top"],
    category: "system-info"
  },
  {
    name: "whoami",
    description: "Print effective userid.",
    useCases: ["Check which user you are currently logged in as"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["id", "who"],
    category: "system-info"
  },
  {
    name: "id",
    description: "Print real and effective user and group IDs.",
    useCases: ["Check which groups your user belongs to"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-u": { description: "Print only the effective user ID" },
      "-G": { description: "Print all group IDs" }
    },
    exampleOutputLines: [],
    relatedCommands: ["whoami", "groups"],
    category: "system-info"
  },
  {
    name: "date",
    description: "Print or set the system date and time.",
    useCases: ["Check current time", "Format time for log files in a script"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-u": { description: "Print or set Coordinated Universal Time (UTC)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cal"],
    category: "system-info"
  },
  {
    name: "cal",
    description: "Display a calendar.",
    useCases: ["View a quick calendar for the current month"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-3": { description: "Display the previous, current and next month" }
    },
    exampleOutputLines: [],
    relatedCommands: ["date"],
    category: "system-info"
  },
  {
    name: "df",
    description: "Report file system disk space usage.",
    useCases: ["Check how much hard drive space is left"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-h": { description: "Print sizes in human readable format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["du", "lsblk"],
    category: "system-info"
  },
  {
    name: "du",
    description: "Estimate file space usage.",
    useCases: ["Find out which folders are taking up the most space"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-h": { description: "Print sizes in human readable format" },
      "-s": { description: "Display only a total for each argument" }
    },
    exampleOutputLines: [],
    relatedCommands: ["df"],
    category: "system-info"
  },
  {
    name: "free",
    description: "Display amount of free and used memory in the system.",
    useCases: ["Check if server is running out of RAM"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-h": { description: "Show output in human-readable format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["top", "vmstat"],
    category: "system-info"
  },
  {
    name: "top",
    description: "Display Linux processes dynamically.",
    useCases: ["Monitor system resources in real-time", "Find CPU-hungry processes"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-u": { description: "Monitor only processes for a specific user" }
    },
    exampleOutputLines: [],
    relatedCommands: ["htop", "ps", "kill"],
    category: "process"
  },
  {
    name: "htop",
    description: "Interactive process viewer.",
    useCases: ["Visually manage processes, monitor CPU/RAM in a colored interface"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["top", "ps"],
    category: "process"
  },
  {
    name: "lscpu",
    description: "Display information about the CPU architecture.",
    useCases: ["Check CPU cores, threads, and architecture type"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["lsblk"],
    category: "system-info"
  },
  {
    name: "lsblk",
    description: "List block devices (disks and partitions).",
    useCases: ["View hard drives and their partitions", "Check mount points"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Output info about filesystems (UUID, type)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["df", "fdisk"],
    category: "system-info"
  },
  {
    name: "ps",
    description: "Report a snapshot of the current processes.",
    useCases: ["Find the process ID (PID) of a running app"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "aux": { description: "View all running processes in BSD format" },
      "-ef": { description: "Display every process in full-format listing" }
    },
    exampleOutputLines: [],
    relatedCommands: ["top", "kill", "pgrep"],
    category: "process"
  },
  {
    name: "kill",
    description: "Send a signal to a process.",
    useCases: ["Terminate a frozen application"],
    isDangerous: true,
    dangerWarning: "Using kill -9 immediately halts a process without allowing it to clean up or save data.",
    safeAlternatives: ["Try standard kill (SIGTERM) first before using -9"],
    flags: {
      "-9": { description: "Send SIGKILL (force terminate)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["killall", "pkill"],
    category: "process"
  },
  {
    name: "killall",
    description: "Kill processes by name.",
    useCases: ["Close all instances of a browser or application quickly"],
    isDangerous: true,
    dangerWarning: "Kills all processes matching a given name, which can disrupt multiple users or services.",
    safeAlternatives: ["kill (to terminate a specific PID instead)"],
    flags: {
      "-9": { description: "Force kill" }
    },
    exampleOutputLines: [],
    relatedCommands: ["kill", "pkill"],
    category: "process"
  },
  {
    name: "bg",
    description: "Put a suspended job in the background.",
    useCases: ["Resume a stopped script so it runs silently"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["fg", "jobs"],
    category: "process"
  },
  {
    name: "fg",
    description: "Bring a background job to the foreground.",
    useCases: ["Return to an editor or program you previously sent to the background"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["bg", "jobs"],
    category: "process"
  },
  {
    name: "jobs",
    description: "List active jobs.",
    useCases: ["See programs suspended or running in the background of your current shell"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["bg", "fg"],
    category: "process"
  },
  {
    name: "nohup",
    description: "Run a command immune to hangups, with output to a non-tty.",
    useCases: ["Keep a long script running even if you close the SSH session"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["screen", "tmux"],
    category: "process"
  },
  {
    name: "nice",
    description: "Run a program with modified scheduling priority.",
    useCases: ["Start a heavy backup script with low priority so it doesn't freeze the PC"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Add integer to the niceness (priority)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["renice", "top"],
    category: "process"
  },
  {
    name: "renice",
    description: "Alter priority of running processes.",
    useCases: ["Lower the priority of a runaway process to regain system control"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Specify the scheduling priority" },
      "-p": { description: "Interpret arguments as process IDs" }
    },
    exampleOutputLines: [],
    relatedCommands: ["nice", "top"],
    category: "process"
  },
  {
    name: "xargs",
    description: "Build and execute command lines from standard input.",
    useCases: ["Delete a list of files found by the 'find' command", "Run a command in parallel"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-I": { description: "Replace a string in the initial command with names read from standard input" },
      "-P": { description: "Run commands in parallel" }
    },
    exampleOutputLines: [],
    relatedCommands: ["find"],
    category: "process"
  },
  {
    name: "at",
    description: "Queue, examine, or delete jobs for later execution.",
    useCases: ["Schedule a one-off script to run at midnight"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Alias for atq (list jobs)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["batch", "crontab"],
    category: "process"
  },
  {
    name: "batch",
    description: "Execute commands when system load levels permit.",
    useCases: ["Run a heavy job only when the CPU is mostly idle"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["at", "crontab"],
    category: "process"
  },
  {
    name: "crontab",
    description: "Maintain crontab files for individual users.",
    useCases: ["Schedule recurring backups or scripts"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-e": { description: "Edit current crontab using the editor specified by the VISUAL or EDITOR environment variable" },
      "-l": { description: "Display the current crontab on standard output" }
    },
    exampleOutputLines: [],
    relatedCommands: ["at", "systemctl"],
    category: "process"
  },
  {
    name: "systemctl",
    description: "Control the systemd system and service manager.",
    useCases: ["Start, stop, enable, or disable a background service like NGINX"],
    isDangerous: true,
    dangerWarning: "Stopping or disabling crucial system services (e.g., networking, sshd) can lock you out of a remote server.",
    safeAlternatives: ["Only modify services you have installed or understand"],
    flags: {
      "start": { description: "Start one or more units" },
      "stop": { description: "Stop one or more units" },
      "enable": { description: "Enable one or more units or unit instances" },
      "status": { description: "Show terse runtime status information about one or more units" }
    },
    exampleOutputLines: [],
    relatedCommands: ["service", "journalctl"],
    category: "process"
  },
  {
    name: "service",
    description: "Run a System V init script.",
    useCases: ["Restart an older service that does not use systemd"],
    isDangerous: true,
    dangerWarning: "Similarly to systemctl, stopping crucial networking services can cause outages.",
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["systemctl"],
    category: "process"
  },
  {
    name: "dmesg",
    description: "Print or control the kernel ring buffer.",
    useCases: ["View hardware driver errors", "Check if a newly inserted USB was detected"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-T": { description: "Print human-readable timestamps" },
      "-H": { description: "Enable human-readable output (colorized)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["journalctl"],
    category: "system-info"
  },
  {
    name: "journalctl",
    description: "Query the systemd journal.",
    useCases: ["Read logs for a specific systemd service", "View boot logs"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-u": { description: "Show messages for the specified systemd unit" },
      "-f": { description: "Follow the journal (like tail -f)" },
      "-e": { description: "Jump to the end of the journal" }
    },
    exampleOutputLines: [],
    relatedCommands: ["systemctl", "dmesg"],
    category: "system-info"
  },
  {
    name: "vmstat",
    description: "Report virtual memory statistics.",
    useCases: ["Monitor system performance, RAM, and CPU swaps"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-s": { description: "Display a table of various event counters and memory statistics" }
    },
    exampleOutputLines: [],
    relatedCommands: ["iostat", "free", "sar"],
    category: "system-info"
  },
  {
    name: "iostat",
    description: "Report Central Processing Unit (CPU) statistics and input/output statistics for devices and partitions.",
    useCases: ["Check hard drive read/write performance and bottlenecks"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-x": { description: "Display extended statistics" }
    },
    exampleOutputLines: [],
    relatedCommands: ["vmstat", "mpstat"],
    category: "system-info"
  },
  {
    name: "sar",
    description: "Collect, report, or save system activity information.",
    useCases: ["View historical CPU, memory, and network usage data"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Report network statistics" },
      "-r": { description: "Report memory utilization statistics" }
    },
    exampleOutputLines: [],
    relatedCommands: ["vmstat", "iostat"],
    category: "system-info"
  },
  {
    name: "mpstat",
    description: "Report processors related statistics.",
    useCases: ["Analyze per-core CPU usage"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-P": { description: "Indicate the processor number for which statistics are to be reported (ALL for all)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["iostat", "sar"],
    category: "system-info"
  },
  {
    name: "pidof",
    description: "Find the process ID of a running program.",
    useCases: ["Quickly get the PID of 'nginx' or 'apache2'"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["pgrep", "ps"],
    category: "process"
  },
  {
    name: "pgrep",
    description: "Look up or signal processes based on name and other attributes.",
    useCases: ["Find all PIDs of a process matching a regex"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Include process ancestors in the match" },
      "-l": { description: "List the process name as well as the process ID" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pidof", "pkill"],
    category: "process"
  },
  {
    name: "pkill",
    description: "Signal processes based on name and other attributes.",
    useCases: ["Kill all processes matching a specific name pattern"],
    isDangerous: true,
    dangerWarning: "pkill can accidentally match and terminate system-critical processes if the pattern is too broad.",
    safeAlternatives: ["Use pgrep first to verify which processes will be killed"],
    flags: {
      "-9": { description: "Force kill" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pgrep", "killall"],
    category: "process"
  },
  {
    name: "timeout",
    description: "Run a command with a time limit.",
    useCases: ["Run a command and abort it if it takes longer than 10 seconds"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["kill"],
    category: "process"
  },
  {
    name: "watch",
    description: "Execute a program periodically, showing output fullscreen.",
    useCases: ["Continuously monitor the output of 'free -m' or 'ls'"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Specify update interval in seconds" }
    },
    exampleOutputLines: [],
    relatedCommands: ["top"],
    category: "process"
  },
  {
    name: "time",
    description: "Time a simple command or give resource usage.",
    useCases: ["Measure how long a script takes to execute"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["timeout"],
    category: "process"
  },
  {
    name: "strace",
    description: "Trace system calls and signals.",
    useCases: ["Debug a failing program by seeing exactly which files it tries to open"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Attach to the process with the given PID" },
      "-c": { description: "Count time, calls, and errors for each system call and report a summary" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ltrace", "dmesg"],
    category: "process"
  },
  {
    name: "ltrace",
    description: "A library call tracer.",
    useCases: ["Debug which dynamic library functions a program is calling"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Attach to the process with the process ID pid" }
    },
    exampleOutputLines: [],
    relatedCommands: ["strace"],
    category: "process"
  },
  {
    name: "lsmod",
    description: "Show the status of modules in the Linux Kernel.",
    useCases: ["Check if a specific hardware driver is loaded into the kernel"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["modprobe", "insmod"],
    category: "system-info"
  },
  {
    name: "modprobe",
    description: "Add and remove modules from the Linux Kernel.",
    useCases: ["Safely load a kernel module along with its dependencies"],
    isDangerous: true,
    dangerWarning: "Adding incorrect kernel modules can cause kernel panics or hardware malfunctions.",
    safeAlternatives: [],
    flags: {
      "-r": { description: "Remove modules (equivalent to rmmod)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lsmod", "insmod"],
    category: "system-info"
  },
  {
    name: "insmod",
    description: "Simple program to insert a module into the Linux Kernel.",
    useCases: ["Force load a kernel module (does not resolve dependencies)"],
    isDangerous: true,
    dangerWarning: "Manually inserting kernel modules bypassing dependency checks can instantly crash the system.",
    safeAlternatives: ["modprobe"],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["modprobe", "lsmod"],
    category: "system-info"
  },
  {
    name: "rmmod",
    description: "Simple program to remove a module from the Linux Kernel.",
    useCases: ["Unload a buggy hardware driver module"],
    isDangerous: true,
    dangerWarning: "Removing a kernel module currently in use will break system functions or crash the kernel.",
    safeAlternatives: ["modprobe -r"],
    flags: {
      "-f": { description: "Force the removal (extremely dangerous)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["modprobe", "lsmod"],
    category: "system-info"
  },
  {
    name: "sysctl",
    description: "Configure kernel parameters at runtime.",
    useCases: ["Change networking limits or swapiness values on the fly"],
    isDangerous: true,
    dangerWarning: "Modifying core kernel parameters incorrectly can result in severe network loss or unresponsiveness.",
    safeAlternatives: ["Always test values in a safe environment before applying permanently."],
    flags: {
      "-a": { description: "Display all values currently available" },
      "-w": { description: "Write/change a sysctl setting" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ulimit"],
    category: "system-info"
  },
  {
    name: "ulimit",
    description: "Get and set user limits.",
    useCases: ["Increase the maximum number of open files allowed for a process"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Report all current limits" },
      "-n": { description: "Maximum number of open file descriptors" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sysctl"],
    category: "system-info"
  },
  {
    name: "chrt",
    description: "Manipulate the real-time attributes of a process.",
    useCases: ["Set a process to use a real-time scheduling policy"],
    isDangerous: true,
    dangerWarning: "Setting a process to real-time priority can starve the system kernel of CPU time, freezing the machine entirely.",
    safeAlternatives: ["nice / renice"],
    flags: {
      "-p": { description: "Operate on an existing PID" }
    },
    exampleOutputLines: [],
    relatedCommands: ["nice", "taskset"],
    category: "process"
  },
  {
    name: "taskset",
    description: "Set or retrieve a process's CPU affinity.",
    useCases: ["Bind a high-performance process to specific CPU cores"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Specify a numerical list of processors" },
      "-p": { description: "Operate on an existing PID" }
    },
    exampleOutputLines: [],
    relatedCommands: ["chrt", "nice"],
    category: "process"
  },
  {
    name: "tload",
    description: "Graphic representation of system load average.",
    useCases: ["Monitor system load visually in a terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["uptime", "top"],
    category: "system-info"
  },
  {
    name: "nproc",
    description: "Print the number of processing units available.",
    useCases: ["Determine how many threads to use when running 'make -j'"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "--all": { description: "Print the number of installed processors" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lscpu"],
    category: "system-info"
  },
  {
    name: "shutdown",
    description: "Halt, power-off or reboot the machine.",
    useCases: ["Safely turn off a server", "Schedule a reboot"],
    isDangerous: true,
    dangerWarning: "Running this on a remote server will disconnect you and take it offline. Ensure this is intentional.",
    safeAlternatives: ["Schedule it with a delay, e.g. 'shutdown +10' so others have warning."],
    flags: {
      "-r": { description: "Reboot the machine" },
      "-c": { description: "Cancel a pending shutdown" },
      "now": { description: "Execute immediately" }
    },
    exampleOutputLines: [],
    relatedCommands: ["reboot", "halt", "poweroff"],
    category: "system-info"
  },
  {
    name: "reboot",
    description: "Reboot the system.",
    useCases: ["Restart the computer to apply kernel updates"],
    isDangerous: true,
    dangerWarning: "Rebooting will abruptly end all user sessions and processes.",
    safeAlternatives: ["Use 'shutdown -r +5' to give users notice."],
    flags: {
      "-f": { description: "Force immediate reboot" }
    },
    exampleOutputLines: [],
    relatedCommands: ["shutdown"],
    category: "system-info"
  }
];