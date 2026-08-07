import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs4: Record<string, ExampleOutputLine[]> = {
  cd: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "cd produces no output on success. Use pwd to verify your new location",
        },
      ],
    },
  ],
  touch: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "touch silently creates the file or updates its timestamp",
        },
      ],
    },
  ],
  mkdir: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "mkdir silently creates the directory on success",
        },
      ],
    },
  ],
  rmdir: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "rmdir silently removes empty directories on success",
        },
      ],
    },
  ],
  mv: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "mv produces no output on success. Use -v for verbose output",
        },
      ],
    },
  ],
  rm: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "rm silently removes files or directories on success",
        },
      ],
    },
  ],
  ln: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "ln silently creates the link on success",
        },
      ],
    },
  ],
  export: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "The variable is now set in the current shell environment",
        },
      ],
    },
  ],
  alias: [
    {
      line: "alias ll='ls -la'",
      segments: [
        { text: "alias ", explanation: "Command defining the shortcut" },
        { text: "ll", explanation: "The name of the shortcut" },
        { text: "=", explanation: "Assignment operator" },
        { text: "'ls -la'", explanation: "The actual command being mapped to the shortcut" },
      ],
    },
  ],
  umask: [
    {
      line: "0022",
      segments: [
        {
          text: "0022",
          explanation:
            "The default umask value, which removes write permissions for group and others",
        },
      ],
    },
  ],
  bg: [
    {
      line: "[1]+ command &",
      segments: [
        { text: "[1]+ ", explanation: "Job number and status indicator" },
        { text: "command ", explanation: "The command being executed" },
        { text: "&", explanation: "Indicates the process is running in the background" },
      ],
    },
  ],
  fg: [
    {
      line: "command",
      segments: [
        {
          text: "command",
          explanation: "The command brought to the foreground, taking over terminal input/output",
        },
      ],
    },
  ],
  su: [
    {
      line: "Password: ",
      segments: [
        {
          text: "Password: ",
          explanation: "Prompt asking for the target user's password to switch accounts",
        },
      ],
    },
  ],
  mkfs: [
    {
      line: "mke2fs 1.46.5 (30-Dec-2021)",
      segments: [
        { text: "mke2fs 1.46.5 (30-Dec-2021)", explanation: "The underlying utility and its version" },
      ],
    },
    {
      line: "Creating filesystem with 262144 4k blocks and 65536 inodes",
      segments: [
        { text: "Creating filesystem ", explanation: "Action being performed" },
        {
          text: "with 262144 4k blocks and 65536 inodes",
          explanation: "Details of the filesystem structure being created",
        },
      ],
    },
  ],
  cron: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation:
            "cron is a background daemon and runs silently. Check syslog or cron logs for its activity",
        },
      ],
    },
  ],
  file: [
    {
      line: "file.txt: ASCII text",
      segments: [
        { text: "file.txt", explanation: "The name of the analyzed file" },
        { text: ": ", explanation: "Separator" },
        { text: "ASCII text", explanation: "The determined file type based on its contents" },
      ],
    },
  ],
  more: [
    {
      line: "This is the first line of the file.",
      segments: [
        { text: "This is the first line of the file.", explanation: "Content from the top of the file" },
      ],
    },
    {
      line: "--More--(50%)",
      segments: [
        {
          text: "--More--(50%)",
          explanation:
            "Indicator showing progress and pausing for user input to scroll further",
        },
      ],
    },
  ],
  less: [
    {
      line: "This is the first line of the file.",
      segments: [
        { text: "This is the first line of the file.", explanation: "Content from the top of the file" },
      ],
    },
    {
      line: ":",
      segments: [
        {
          text: ":",
          explanation: "Interactive prompt waiting for user commands to navigate the file",
        },
      ],
    },
  ],
  nl: [
    {
      line: "     1	Hello World",
      segments: [
        { text: "     1	", explanation: "The automatically generated line number" },
        { text: "Hello World", explanation: "The original line content" },
      ],
    },
  ],
  type: [
    {
      line: "ls is aliased to `ls --color=auto'",
      segments: [
        { text: "ls is aliased to ", explanation: "Indicates that the command is an alias" },
        {
          text: "`ls --color=auto'",
          explanation: "The underlying command that runs when the alias is called",
        },
      ],
    },
  ],
  help: [
    {
      line: "GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)",
      segments: [
        { text: "GNU bash, version 5.1.16(1)-release ", explanation: "Shell version information" },
        { text: "(x86_64-pc-linux-gnu)", explanation: "Architecture details" },
      ],
    },
    {
      line: "These shell commands are defined internally.  Type `help' to see this list.",
      segments: [
        {
          text: "These shell commands are defined internally.",
          explanation: "Description of shell built-in commands",
        },
      ],
    },
  ],
  info: [
    {
      line: "File: coreutils.info,  Node: Top,  Next: Introduction,  Up: (dir)",
      segments: [
        { text: "File: coreutils.info,  ", explanation: "The currently viewed info file" },
        { text: "Node: Top,  ", explanation: "Current position within the documentation" },
        { text: "Next: Introduction,  Up: (dir)", explanation: "Navigation links to other nodes" },
      ],
    },
  ],
  whereis: [
    {
      line: "python3: /usr/bin/python3 /usr/lib/python3 /usr/share/man/man1/python3.1.gz",
      segments: [
        { text: "python3: ", explanation: "The command being searched" },
        { text: "/usr/bin/python3 ", explanation: "Path to the binary executable" },
        { text: "/usr/lib/python3 ", explanation: "Path to associated libraries/source files" },
        { text: "/usr/share/man/man1/python3.1.gz", explanation: "Path to the manual page" },
      ],
    },
  ],
  locate: [
    {
      line: "/etc/hostname",
      segments: [
        {
          text: "/etc/hostname",
          explanation: "A file path matching the search pattern from the database",
        },
      ],
    },
    {
      line: "/usr/share/doc/hostname",
      segments: [
        { text: "/usr/share/doc/hostname", explanation: "Another matched file path" },
      ],
    },
  ],
  xargs: [
    {
      line: "file1.txt file2.txt file3.txt",
      segments: [
        {
          text: "file1.txt file2.txt file3.txt",
          explanation: "Arguments passed dynamically to the target command by xargs",
        },
      ],
    },
  ],
  uniq: [
    {
      line: "apple",
      segments: [
        {
          text: "apple",
          explanation: "A unique line output after consecutive duplicates were removed",
        },
      ],
    },
    {
      line: "banana",
      segments: [{ text: "banana", explanation: "The next unique line" }],
    },
  ],
  cut: [
    {
      line: "root:0",
      segments: [
        { text: "root", explanation: "First extracted field (e.g. username)" },
        { text: ":", explanation: "The defined delimiter" },
        { text: "0", explanation: "Second extracted field (e.g. user ID)" },
      ],
    },
  ],
  paste: [
    {
      line: "apple	red",
      segments: [
        { text: "apple", explanation: "Line from the first file" },
        { text: "	", explanation: "Tab character separating the files" },
        { text: "red", explanation: "Corresponding line from the second file" },
      ],
    },
  ],
  join: [
    {
      line: "1 Alice Engineering",
      segments: [
        { text: "1 ", explanation: "The common join field" },
        { text: "Alice ", explanation: "Data from the first file" },
        { text: "Engineering", explanation: "Data from the second file" },
      ],
    },
  ],
  comm: [
    {
      line: "		apple",
      segments: [
        {
          text: "		",
          explanation: "Two tabs indicating this line exists in both files (column 3)",
        },
        { text: "apple", explanation: "The shared line" },
      ],
    },
    {
      line: "banana",
      segments: [
        {
          text: "banana",
          explanation: "No tabs indicating this line is only in the first file (column 1)",
        },
      ],
    },
  ],
  patch: [
    {
      line: "patching file index.js",
      segments: [
        { text: "patching file ", explanation: "Action being performed" },
        { text: "index.js", explanation: "The file being modified by the patch" },
      ],
    },
  ],
  tr: [
    {
      line: "HELLO WORLD",
      segments: [
        {
          text: "HELLO WORLD",
          explanation:
            "The text after translation (e.g., converted from lowercase to uppercase)",
        },
      ],
    },
  ],
  fmt: [
    {
      line: "This is a reformatted paragraph that now",
      segments: [
        {
          text: "This is a reformatted paragraph that now",
          explanation: "Line automatically wrapped to fit a specific width",
        },
      ],
    },
    {
      line: "fits within the specified column limit.",
      segments: [
        { text: "fits within the specified column limit.", explanation: "Wrapped continuation of the paragraph" },
      ],
    },
  ],
  pr: [
    {
      line: "2023-10-12 12:00      file.txt      Page 1",
      segments: [
        { text: "2023-10-12 12:00      ", explanation: "Timestamp of formatting" },
        { text: "file.txt      ", explanation: "Name of the printed file" },
        { text: "Page 1", explanation: "Current page number" },
      ],
    },
  ],
  tee: [
    {
      line: "Hello World",
      segments: [
        {
          text: "Hello World",
          explanation: "Output mirrored to standard output while also being saved to a file",
        },
      ],
    },
  ],
  printf: [
    {
      line: "Name: Alice, Age: 30",
      segments: [
        { text: "Name: Alice, Age: 30", explanation: "Text generated using formatted placeholders" },
      ],
    },
  ],
  aspell: [
    {
      line: "1) apple  2) apply  3) ample",
      segments: [
        {
          text: "1) apple  2) apply  3) ample",
          explanation: "Suggested spelling corrections for a misspelled word",
        },
      ],
    },
    {
      line: "? ",
      segments: [
        {
          text: "? ",
          explanation: "Interactive prompt waiting for your choice of correction",
        },
      ],
    },
  ],
  chown: [
    {
      line: "changed ownership of 'file.txt' from user to root",
      segments: [
        { text: "changed ownership of 'file.txt' ", explanation: "Verbose output confirming the action" },
        { text: "from user to root", explanation: "Shows the old owner and the newly assigned owner" },
      ],
    },
  ],
  chgrp: [
    {
      line: "changed group of 'file.txt' from staff to admin",
      segments: [
        { text: "changed group of 'file.txt' ", explanation: "Verbose output confirming the action" },
        { text: "from staff to admin", explanation: "Shows the old group and the newly assigned group" },
      ],
    },
  ],
  userdel: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation:
            "userdel produces no output on success. The user is silently removed from the system.",
        },
      ],
    },
  ],
  usermod: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation:
            "usermod produces no output on success. The user account is silently updated.",
        },
      ],
    },
  ],
  killall: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation:
            "killall silently sends the termination signal to matching processes on success.",
        },
      ],
    },
  ],
  nice: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation:
            "nice itself produces no output on success; it transparently runs the specified command with modified scheduling priority.",
        },
      ],
    },
  ],
  umount: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "umount successfully unmounted the filesystem without output.",
        },
      ],
    },
  ],
  fsck: [
    {
      line: "fsck from util-linux 2.37.2",
      segments: [
        { text: "fsck from util-linux 2.37.2", explanation: "The fsck utility version" },
      ],
    },
    {
      line: "/dev/sda2: clean, 125000/5000000 files, 1500000/20000000 blocks",
      segments: [
        { text: "/dev/sda2: ", explanation: "The partition being checked" },
        { text: "clean, ", explanation: "Status indicating no filesystem errors were found" },
        {
          text: "125000/5000000 files, 1500000/20000000 blocks",
          explanation: "Usage statistics for inodes and data blocks",
        },
      ],
    },
  ],
  dd: [
    {
      line: "1024+0 records in",
      segments: [
        { text: "1024+0 records in", explanation: "Number of full and partial blocks successfully read" },
      ],
    },
    {
      line: "1024+0 records out",
      segments: [
        {
          text: "1024+0 records out",
          explanation: "Number of full and partial blocks successfully written",
        },
      ],
    },
    {
      line: "1048576 bytes (1.0 MB) copied, 0.005 s, 210 MB/s",
      segments: [
        { text: "1048576 bytes (1.0 MB) copied, ", explanation: "Total data transferred" },
        { text: "0.005 s, ", explanation: "Time taken for the operation" },
        { text: "210 MB/s", explanation: "Transfer speed" },
      ],
    },
  ],
  dmesg: [
    {
      line: "[    0.000000] Linux version 5.15.0-76-generic",
      segments: [
        { text: "[    0.000000] ", explanation: "Seconds since kernel boot" },
        { text: "Linux version 5.15.0-76-generic", explanation: "Kernel initialization message" },
      ],
    },
    {
      line: "[    2.145678] eth0: link up, 1000Mbps, full-duplex",
      segments: [
        { text: "[    2.145678] ", explanation: "Timestamp of event" },
        {
          text: "eth0: link up, 1000Mbps, full-duplex",
          explanation: "Hardware/driver event log (e.g., network interface initialized)",
        },
      ],
    },
  ],
  groupadd: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "groupadd silently creates the new group on success. Verify with 'getent group groupname'",
        },
      ],
    },
  ],
  groupdel: [
    {
      line: "(no output)",
      segments: [
        {
          text: "(no output)",
          explanation: "groupdel silently removes the group on success. Verify with 'getent group groupname'",
        },
      ],
    },
  ],
};