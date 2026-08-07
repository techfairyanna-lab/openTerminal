import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs2: Record<string, ExampleOutputLine[]> = {
  // ---------------------------------------------------------------------------
  // FILE / NAVIGATION
  // ---------------------------------------------------------------------------
  exa: [
    {
      line: ".rw-r--r--@ 1.2k user 12 Oct 10:00 index.js",
      segments: [
        { text: ".rw-r--r--", explanation: "File permissions: read/write for owner, read for others" },
        { text: "@", explanation: "Indicates extended attributes (like macOS quarantine or ACLs) are present" },
        { text: " 1.2k ", explanation: "Human-readable file size" },
        { text: "user ", explanation: "Owner of the file" },
        { text: "12 Oct 10:00 ", explanation: "Timestamp of last modification" },
        { text: "index.js", explanation: "The file name" }
      ]
    },
    {
      line: "drwxr-xr-x     - user 12 Oct 10:00 src",
      segments: [
        { text: "drwxr-xr-x", explanation: "Directory permissions: read/write/execute for owner, read/execute for others" },
        { text: "     - ", explanation: "Size is typically hidden for directories by default in exa" },
        { text: "user ", explanation: "Owner of the directory" },
        { text: "12 Oct 10:00 ", explanation: "Timestamp of last modification" },
        { text: "src", explanation: "The directory name" }
      ]
    }
  ],
  bat: [
    {
      line: "───────┬───────────────────────────────────────────────────",
      segments: [{ text: "───────┬───────────────────────────────────────────────────", explanation: "Top border of the bat header" }]
    },
    {
      line: "       │ File: src/main.rs",
      segments: [
        { text: "       │ ", explanation: "Gutter separator" },
        { text: "File: src/main.rs", explanation: "The name of the file being displayed" }
      ]
    },
    {
      line: "───────┼───────────────────────────────────────────────────",
      segments: [{ text: "───────┼───────────────────────────────────────────────────", explanation: "Separator between header and file content" }]
    },
    {
      line: "   1   │ fn main() {",
      segments: [
        { text: "   1   ", explanation: "Line number" },
        { text: "│ ", explanation: "Gutter separator" },
        { text: "fn main() {", explanation: "Syntax highlighted source code" }
      ]
    }
  ],
  duf: [
    {
      line: "╭────────────────────────────────────────────────────────────────────╮",
      segments: [{ text: "╭────────────────────────────────────────────────────────────────────╮", explanation: "Table top border" }]
    },
    {
      line: "│ 1 local device                                                     │",
      segments: [
        { text: "│ ", explanation: "Border" },
        { text: "1 local device                                                     ", explanation: "Summary of devices shown in this table block" },
        { text: "│", explanation: "Border" }
      ]
    },
    {
      line: "│ MOUNT      │ SIZE   │ USED   │ AVAIL │ USE%                        │",
      segments: [
        { text: "│ MOUNT      ", explanation: "Mount point column" },
        { text: "│ SIZE   ", explanation: "Total size column" },
        { text: "│ USED   ", explanation: "Used space column" },
        { text: "│ AVAIL ", explanation: "Available space column" },
        { text: "│ USE%                        │", explanation: "Percentage used column and right border" }
      ]
    },
    {
      line: "│ /          │ 250.0G │ 150.0G │ 100.0G│ [#######.............]  60.0% │",
      segments: [
        { text: "│ /          ", explanation: "Root mount point" },
        { text: "│ 250.0G ", explanation: "Total partition size" },
        { text: "│ 150.0G ", explanation: "Amount of space used" },
        { text: "│ 100.0G", explanation: "Amount of space free" },
        { text: "│ ", explanation: "Separator" },
        { text: "[#######.............]  60.0%", explanation: "Visual progress bar of usage" },
        { text: " │", explanation: "Border" }
      ]
    }
  ],
  dust: [
    {
      line: " 5.0M   ┌── src",
      segments: [
        { text: " 5.0M   ", explanation: "Total disk usage of the 'src' directory tree" },
        { text: "┌── ", explanation: "Tree branch indicator" },
        { text: "src", explanation: "Directory name" }
      ]
    },
    {
      line: " 2.0M   ├── public",
      segments: [
        { text: " 2.0M   ", explanation: "Total disk usage of the 'public' directory tree" },
        { text: "├── ", explanation: "Tree branch indicator" },
        { text: "public", explanation: "Directory name" }
      ]
    },
    {
      line: " 8.0M ┌─┴ .",
      segments: [
        { text: " 8.0M ", explanation: "Total size of the current directory (including contents)" },
        { text: "┌─┴ ", explanation: "Root tree branch indicator combining subdirectories" },
        { text: ".", explanation: "Current directory" }
      ]
    }
  ],
  pushd: [
    {
      line: "~/projects/src ~/projects",
      segments: [
        { text: "~/projects/src ", explanation: "The new current working directory" },
        { text: "~/projects", explanation: "The previously saved directory, now pushed onto the stack" }
      ]
    }
  ],
  popd: [
    {
      line: "~/projects",
      segments: [
        { text: "~/projects", explanation: "The directory popped from the stack, which is now the current working directory" }
      ]
    }
  ],
  inotifywait: [
    {
      line: "Setting up watches.  Watches established.",
      segments: [
        { text: "Setting up watches.  Watches established.", explanation: "Indicates the tool has successfully started monitoring the filesystem" }
      ]
    },
    {
      line: "src/index.js MODIFY",
      segments: [
        { text: "src/index.js ", explanation: "The specific file that triggered the event" },
        { text: "MODIFY", explanation: "The type of filesystem event (the file was changed/saved)" }
      ]
    }
  ],
  flock: [
    {
      line: "flock: getting lock took 0.000001 seconds",
      segments: [
        { text: "flock: getting lock took 0.000001 seconds", explanation: "Verbose output showing how quickly the exclusive file lock was acquired before running the wrapped command" }
      ]
    }
  ],
  pv: [
    {
      line: " 150MiB 0:00:05 [ 30MiB/s] [=======>             ]  40% ETA 0:00:07",
      segments: [
        { text: " 150MiB ", explanation: "Data transferred so far" },
        { text: "0:00:05 ", explanation: "Time elapsed" },
        { text: "[ 30MiB/s] ", explanation: "Current data transfer rate" },
        { text: "[=======>             ] ", explanation: "Visual progress bar" },
        { text: " 40% ", explanation: "Percentage completed" },
        { text: "ETA 0:00:07", explanation: "Estimated time remaining until completion" }
      ]
    }
  ],
  iotop: [
    {
      line: "Total DISK READ: 0.00 B/s | Total DISK WRITE: 25.50 K/s",
      segments: [
        { text: "Total DISK READ: 0.00 B/s | Total DISK WRITE: 25.50 K/s", explanation: "Global summary of current disk I/O throughput" }
      ]
    },
    {
      line: "  TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN     IO>    COMMAND",
      segments: [
        { text: "  TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN     IO>    COMMAND", explanation: "Header row showing Thread ID, Priority, User, I/O rates, Swap usage, I/O wait percentage, and the process name" }
      ]
    },
    {
      line: " 1234  be/4  root      0.00 B/s   25.50 K/s  0.00 %  1.23 %    mysqld",
      segments: [
        { text: " 1234  ", explanation: "Thread ID" },
        { text: "be/4  ", explanation: "Best-effort scheduling priority" },
        { text: "root      ", explanation: "User running the process" },
        { text: "0.00 B/s   25.50 K/s  ", explanation: "Read and write bandwidth" },
        { text: "0.00 %  1.23 %    ", explanation: "Swap-in wait and I/O wait percentages" },
        { text: "mysqld", explanation: "The command generating the I/O" }
      ]
    }
  ],
  pvdisplay: [
    {
      line: "  --- Physical volume ---",
      segments: [{ text: "  --- Physical volume ---", explanation: "Section header for LVM physical volume details" }]
    },
    {
      line: "  PV Name               /dev/sda1",
      segments: [
        { text: "  PV Name               ", explanation: "Label" },
        { text: "/dev/sda1", explanation: "The block device initialized for LVM" }
      ]
    },
    {
      line: "  VG Name               vg00",
      segments: [
        { text: "  VG Name               ", explanation: "Label" },
        { text: "vg00", explanation: "The Volume Group this physical volume belongs to" }
      ]
    }
  ],
  vgdisplay: [
    {
      line: "  --- Volume group ---",
      segments: [{ text: "  --- Volume group ---", explanation: "Section header for LVM volume group details" }]
    },
    {
      line: "  VG Name               vg00",
      segments: [
        { text: "  VG Name               ", explanation: "Label" },
        { text: "vg00", explanation: "The name of the volume group" }
      ]
    },
    {
      line: "  VG Size               99.99 GiB",
      segments: [
        { text: "  VG Size               ", explanation: "Label" },
        { text: "99.99 GiB", explanation: "Total storage capacity pooled in this volume group" }
      ]
    }
  ],
  lvdisplay: [
    {
      line: "  --- Logical volume ---",
      segments: [{ text: "  --- Logical volume ---", explanation: "Section header for LVM logical volume details" }]
    },
    {
      line: "  LV Path                /dev/vg00/root",
      segments: [
        { text: "  LV Path                ", explanation: "Label" },
        { text: "/dev/vg00/root", explanation: "The device path used to mount this logical volume" }
      ]
    },
    {
      line: "  LV Size                50.00 GiB",
      segments: [
        { text: "  LV Size                ", explanation: "Label" },
        { text: "50.00 GiB", explanation: "The allocated size of this specific volume" }
      ]
    }
  ],
  swapon: [
    {
      line: "NAME      TYPE      SIZE USED PRIO",
      segments: [{ text: "NAME      TYPE      SIZE USED PRIO", explanation: "Header detailing active swap spaces" }]
    },
    {
      line: "/swapfile file        2G   0B   -2",
      segments: [
        { text: "/swapfile ", explanation: "Path to the swap area" },
        { text: "file        ", explanation: "Indicates it is a swap file, not a partition" },
        { text: "2G   ", explanation: "Total swap size" },
        { text: "0B   ", explanation: "Currently used swap" },
        { text: "-2", explanation: "Priority (higher priority swaps are used first)" }
      ]
    }
  ],
  cryptsetup: [
    {
      line: "Enter passphrase for /dev/sda2: ",
      segments: [
        { text: "Enter passphrase for ", explanation: "Prompt for decryption key" },
        { text: "/dev/sda2", explanation: "The LUKS-encrypted block device" },
        { text: ": ", explanation: "Waiting for user input (input is hidden)" }
      ]
    },
    {
      line: "Key slot 0 unlocked.",
      segments: [
        { text: "Key slot 0 unlocked.", explanation: "Success message indicating the password matched and the mapped device is now readable" }
      ]
    }
  ],
  lvm: [
    {
      line: "lvm> ",
      segments: [
        { text: "lvm> ", explanation: "The interactive prompt for the Logical Volume Manager shell" }
      ]
    }
  ],
  fdupes: [
    {
      line: "./docs/copy.txt",
      segments: [{ text: "./docs/copy.txt", explanation: "First instance of a duplicated file" }]
    },
    {
      line: "./docs/original.txt",
      segments: [{ text: "./docs/original.txt", explanation: "Second instance of the identical file" }]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Blank line separating different duplicate sets" }]
    },
    {
      line: "./img/1.png",
      segments: [{ text: "./img/1.png", explanation: "First file in a new set of duplicates" }]
    }
  ],
  dircolors: [
    {
      line: "LS_COLORS='rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:';",
      segments: [
        { text: "LS_COLORS=", explanation: "The environment variable that configures 'ls' coloring" },
        { text: "'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:';", explanation: "A string of ANSI color codes mapped to file types (e.g., di=01;34 is bold blue for directories)" }
      ]
    },
    {
      line: "export LS_COLORS",
      segments: [
        { text: "export LS_COLORS", explanation: "Shell command generated by dircolors to export the variable to the environment" }
      ]
    }
  ],
  sgdisk: [
    {
      line: "Creating new GPT entries in memory.",
      segments: [{ text: "Creating new GPT entries in memory.", explanation: "Indicates a new GUID Partition Table structure is being built" }]
    },
    {
      line: "Setting name!",
      segments: [{ text: "Setting name!", explanation: "Confirmation that a partition label was applied" }]
    },
    {
      line: "partNum is 1",
      segments: [{ text: "partNum is 1", explanation: "Refers to the partition index number that was just created or modified" }]
    }
  ],
  fallocate: [
    {
      line: "fallocate: fallocate failed: No space left on device",
      segments: [
        { text: "fallocate: ", explanation: "The command generating the message" },
        { text: "fallocate failed: No space left on device", explanation: "Error indicating the requested immediate file allocation exceeds physical disk capacity" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // SEARCHING
  // ---------------------------------------------------------------------------
  ag: [
    {
      line: "src/main.js",
      segments: [
        { text: "src/main.js", explanation: "The file where the pattern was found" }
      ]
    },
    {
      line: "12:  console.log(\"Found error\");",
      segments: [
        { text: "12", explanation: "Line number" },
        { text: ":  ", explanation: "Separator" },
        { text: "console.log(\"", explanation: "Surrounding code context" },
        { text: "Found error", explanation: "The string that matched the search query" },
        { text: "\");", explanation: "Trailing code context" }
      ]
    }
  ],
  rg: [
    {
      line: "src/components/Button.tsx",
      segments: [
        { text: "src/components/Button.tsx", explanation: "File path containing the match (ripgrep highlights this in magenta by default)" }
      ]
    },
    {
      line: "15:  return <button className={styles.btn}>{text}</button>;",
      segments: [
        { text: "15", explanation: "Line number (ripgrep highlights this in green)" },
        { text: ":  ", explanation: "Separator" },
        { text: "return <button className={styles.btn}>{", explanation: "Code context" },
        { text: "text", explanation: "The matched regex or string (ripgrep highlights this in red/bold)" },
        { text: "}</button>;", explanation: "Code context" }
      ]
    }
  ],
  fd: [
    {
      line: "src/utils/helpers.js",
      segments: [
        { text: "src/", explanation: "Directory path" },
        { text: "utils/", explanation: "Subdirectory" },
        { text: "helpers.js", explanation: "File matching the pattern or extension" }
      ]
    }
  ],
  fzf: [
    {
      line: "  src/utils/",
      segments: [
        { text: "  ", explanation: "An unselected item in the fuzzy finder list" },
        { text: "src/utils/", explanation: "A matching path" }
      ]
    },
    {
      line: "> src/utils/helpers.js",
      segments: [
        { text: "> ", explanation: "The cursor indicating the currently highlighted selection" },
        { text: "src/utils/helpers.js", explanation: "The selected path that will be returned if Enter is pressed" }
      ]
    },
    {
      line: "  3/120",
      segments: [
        { text: "  3", explanation: "Number of matches found" },
        { text: "/", explanation: "Separator" },
        { text: "120", explanation: "Total number of items fed into fzf" }
      ]
    },
    {
      line: "> helper",
      segments: [
        { text: "> ", explanation: "Prompt symbol" },
        { text: "helper", explanation: "The fuzzy search string currently typed by the user" }
      ]
    }
  ],
  ack: [
    {
      line: "src/main.js",
      segments: [
        { text: "src/main.js", explanation: "File containing the match" }
      ]
    },
    {
      line: "12:  console.log(\"Found error\");",
      segments: [
        { text: "12", explanation: "Line number" },
        { text: ":  console.log(\"Found error\");", explanation: "Matching line content" }
      ]
    }
  ],
  apropos: [
    {
      line: "printf (3)           - formatted output conversion",
      segments: [
        { text: "printf ", explanation: "The name of the command or function" },
        { text: "(3)           ", explanation: "The manual section (3 indicates library functions)" },
        { text: "- formatted output conversion", explanation: "A brief description containing the keyword searched for" }
      ]
    }
  ],
  whatis: [
    {
      line: "ls (1)               - list directory contents",
      segments: [
        { text: "ls ", explanation: "The command name" },
        { text: "(1)               ", explanation: "Manual section (1 indicates user commands)" },
        { text: "- list directory contents", explanation: "A one-line description from the man page database" }
      ]
    }
  ],
  objdump: [
    {
      line: "0000000000401000 <main>:",
      segments: [
        { text: "0000000000401000 ", explanation: "Memory address of the function" },
        { text: "<main>:", explanation: "The symbol name (the C main function)" }
      ]
    },
    {
      line: "  401000:	55                   	push   %rbp",
      segments: [
        { text: "  401000:	", explanation: "Instruction address" },
        { text: "55                   	", explanation: "Raw hex machine code" },
        { text: "push   %rbp", explanation: "Human-readable assembly instruction" }
      ]
    }
  ],
  readelf: [
    {
      line: "ELF Header:",
      segments: [{ text: "ELF Header:", explanation: "Section header for the Executable and Linkable Format information" }]
    },
    {
      line: "  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00",
      segments: [
        { text: "  Magic:   ", explanation: "Label for the file signature" },
        { text: "7f 45 4c 46 ", explanation: "The hex values representing DEL, 'E', 'L', 'F'" },
        { text: "02 01 01 00 00 00 00 00 00 00 00 00", explanation: "Architecture and ABI flags" }
      ]
    },
    {
      line: "  Class:                             ELF64",
      segments: [
        { text: "  Class:                             ", explanation: "Label for the binary architecture" },
        { text: "ELF64", explanation: "Indicates it is a 64-bit binary" }
      ]
    }
  ],
  nm: [
    {
      line: "0000000000402000 D __data_start",
      segments: [
        { text: "0000000000402000 ", explanation: "Symbol memory address" },
        { text: "D ", explanation: "Symbol type ('D' means initialized data section)" },
        { text: "__data_start", explanation: "Symbol name" }
      ]
    },
    {
      line: "                 U printf@@GLIBC_2.2.5",
      segments: [
        { text: "                 ", explanation: "No address because the symbol is undefined in this file" },
        { text: "U ", explanation: "Symbol type ('U' means undefined, expected to be linked later)" },
        { text: "printf@@GLIBC_2.2.5", explanation: "Symbol name and required library version" }
      ]
    }
  ],
  ldd: [
    {
      line: "	linux-vdso.so.1 (0x00007ffe343e3000)",
      segments: [
        { text: "	linux-vdso.so.1 ", explanation: "Virtual dynamic shared object (injected by the kernel)" },
        { text: "(0x00007ffe343e3000)", explanation: "Memory address where the library is mapped" }
      ]
    },
    {
      line: "	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f3521a00000)",
      segments: [
        { text: "	libc.so.6 ", explanation: "The required shared library name" },
        { text: "=> ", explanation: "Points to the resolved file path" },
        { text: "/lib/x86_64-linux-gnu/libc.so.6 ", explanation: "The absolute path of the loaded library" },
        { text: "(0x00007f3521a00000)", explanation: "Memory address" }
      ]
    }
  ],
  cscope: [
    {
      line: "Cscope version 15.9",
      segments: [{ text: "Cscope version 15.9", explanation: "Tool version banner" }]
    },
    {
      line: "Find this C symbol:",
      segments: [{ text: "Find this C symbol:", explanation: "Interactive prompt to enter a variable or function name" }]
    },
    {
      line: "Find this global definition:",
      segments: [{ text: "Find this global definition:", explanation: "Interactive prompt to jump directly to where a symbol is defined" }]
    }
  ],
  zgrep: [
    {
      line: "var/log/syslog.2.gz:Oct 12 10:00:00 server sshd[123]: Accepted publickey for user",
      segments: [
        { text: "var/log/syslog.2.gz", explanation: "The compressed archive containing the match" },
        { text: ":", explanation: "Separator" },
        { text: "Oct 12 10:00:00 server sshd[123]: Accepted publickey for user", explanation: "The uncompressed matching text line" }
      ]
    }
  ],
  pcregrep: [
    {
      line: "match: 123-456-7890",
      segments: [
        { text: "match: ", explanation: "Text in the file" },
        { text: "123-456-7890", explanation: "A string successfully matched using an advanced Perl-compatible regular expression" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // TEXT PROCESSING
  // ---------------------------------------------------------------------------
  figlet: [
    {
      line: "  _   _      _ _       ",
      segments: [{ text: "  _   _      _ _       ", explanation: "ASCII art representation of the top of the characters" }]
    },
    {
      line: " | | | | ___| | | ___  ",
      segments: [{ text: " | | | | ___| | | ___  ", explanation: "ASCII art representation of the middle of the characters" }]
    },
    {
      line: " | |_| |/ _ \\ | |/ _ \\ ",
      segments: [{ text: " | |_| |/ _ \\ | |/ _ \\ ", explanation: "ASCII art representation of the bottom of the characters" }]
    }
  ],
  cowsay: [
    {
      line: " ___________ ",
      segments: [{ text: " ___________ ", explanation: "Top speech bubble border" }]
    },
    {
      line: "< Hello cow >",
      segments: [
        { text: "< ", explanation: "Left speech bubble border" },
        { text: "Hello cow", explanation: "The message input by the user" },
        { text: " >", explanation: "Right speech bubble border" }
      ]
    },
    {
      line: " ----------- ",
      segments: [{ text: " ----------- ", explanation: "Bottom speech bubble border" }]
    },
    {
      line: "        \\   ^__^",
      segments: [{ text: "        \\   ^__^", explanation: "ASCII cow illustration" }]
    }
  ],
  colordiff: [
    {
      line: "--- old.txt	2023-10-12",
      segments: [
        { text: "--- old.txt", explanation: "The original file name (usually colored red)" },
        { text: "	2023-10-12", explanation: "Timestamp" }
      ]
    },
    {
      line: "+++ new.txt	2023-10-13",
      segments: [
        { text: "+++ new.txt", explanation: "The modified file name (usually colored green)" },
        { text: "	2023-10-13", explanation: "Timestamp" }
      ]
    },
    {
      line: "-old line",
      segments: [
        { text: "-", explanation: "Deletion indicator" },
        { text: "old line", explanation: "The removed text" }
      ]
    },
    {
      line: "+new line",
      segments: [
        { text: "+", explanation: "Addition indicator" },
        { text: "new line", explanation: "The added text" }
      ]
    }
  ],
  pandoc: [
    {
      line: "<h1 id=\"title\">Title</h1>",
      segments: [
        { text: "<h1 id=\"title\">", explanation: "HTML header tag generated from markdown '# Title'" },
        { text: "Title", explanation: "The text content" },
        { text: "</h1>", explanation: "Closing tag" }
      ]
    },
    {
      line: "<p>Paragraph text.</p>",
      segments: [
        { text: "<p>Paragraph text.</p>", explanation: "HTML paragraph generated from standard markdown text" }
      ]
    }
  ],
  numfmt: [
    {
      line: "1.5G",
      segments: [
        { text: "1.5G", explanation: "The human-readable string converted from raw bytes (e.g., 1500000000)" }
      ]
    }
  ],
  shuf: [
    {
      line: "cherry",
      segments: [{ text: "cherry", explanation: "A randomly selected line from the input" }]
    },
    {
      line: "apple",
      segments: [{ text: "apple", explanation: "Another randomly ordered line" }]
    },
    {
      line: "banana",
      segments: [{ text: "banana", explanation: "The last randomized line" }]
    }
  ],
  tput: [
    {
      line: "80",
      segments: [
        { text: "80", explanation: "Output of 'tput cols', indicating the terminal is currently 80 characters wide" }
      ]
    }
  ],
  dialog: [
    {
      line: "+-----------------------+",
      segments: [{ text: "+-----------------------+", explanation: "Top border of the text-based UI box" }]
    },
    {
      line: "|   Hello World         |",
      segments: [
        { text: "|   ", explanation: "Left border and padding" },
        { text: "Hello World", explanation: "The message displayed in the dialog" },
        { text: "         |", explanation: "Padding and right border" }
      ]
    },
    {
      line: "|        [ OK ]         |",
      segments: [
        { text: "|        ", explanation: "Border and padding" },
        { text: "[ OK ]", explanation: "An interactive button the user can select" },
        { text: "         |", explanation: "Padding and right border" }
      ]
    }
  ],
  datamash: [
    {
      line: "Group1	150",
      segments: [
        { text: "Group1", explanation: "The key that rows were grouped by" },
        { text: "	", explanation: "Tab separator" },
        { text: "150", explanation: "The calculated sum or mean for this group" }
      ]
    },
    {
      line: "Group2	300",
      segments: [
        { text: "Group2", explanation: "The second group key" },
        { text: "	300", explanation: "The aggregated result" }
      ]
    }
  ],
  envsubst: [
    {
      line: "User: admin",
      segments: [
        { text: "User: ", explanation: "Static template text" },
        { text: "admin", explanation: "The string substituted in place of the $USER environment variable" }
      ]
    },
    {
      line: "Home: /home/admin",
      segments: [
        { text: "Home: ", explanation: "Static template text" },
        { text: "/home/admin", explanation: "The string substituted in place of the $HOME environment variable" }
      ]
    }
  ],
  hexdump: [
    {
      line: "0000000 48 65 6c 6c 6f 20 57 6f 72 6c 64 21 0a      |Hello World!.|",
      segments: [
        { text: "0000000 ", explanation: "Hexadecimal byte offset" },
        { text: "48 65 6c 6c 6f 20 57 6f 72 6c 64 21 0a      ", explanation: "Hexadecimal representation of the file's bytes" },
        { text: "|Hello World!.|", explanation: "ASCII representation of those same bytes (dots for non-printable chars)" }
      ]
    },
    {
      line: "000000d",
      segments: [
        { text: "000000d", explanation: "Total length of the file in hex (13 bytes)" }
      ]
    }
  ],
  b2sum: [
    {
      line: "a1b2c3d4e5f6... file.txt",
      segments: [
        { text: "a1b2c3d4e5f6...", explanation: "The generated BLAKE2 cryptographic hash" },
        { text: " file.txt", explanation: "The file that was hashed" }
      ]
    }
  ],
  cmp: [
    {
      line: "file1.txt file2.txt differ: byte 15, line 2",
      segments: [
        { text: "file1.txt file2.txt ", explanation: "The two files being compared" },
        { text: "differ: byte 15, line 2", explanation: "The exact location of the first discrepancy" }
      ]
    }
  ],
  sponge: [
    {
      line: "",
      segments: [
        { text: "", explanation: "Sponge is typically silent; it silently absorbs all standard input into memory before opening and writing to the target file." }
      ]
    }
  ],
  vidir: [
    {
      line: "1	./file1.txt",
      segments: [
        { text: "1", explanation: "Internal item ID" },
        { text: "	", explanation: "Separator" },
        { text: "./file1.txt", explanation: "The current file path. Modifying this path in the editor will rename the file upon saving." }
      ]
    },
    {
      line: "2	./file2.txt",
      segments: [
        { text: "2	./file2.txt", explanation: "Deleting this entire line in the editor will permanently delete the file upon saving." }
      ]
    }
  ],
  gawk: [
    {
      line: "root",
      segments: [
        { text: "root", explanation: "Output string processed by the gawk script (e.g., printing the first column of /etc/passwd)" }
      ]
    }
  ],
  stty: [
    {
      line: "speed 38400 baud; line = 0;",
      segments: [
        { text: "speed 38400 baud;", explanation: "The current terminal communication speed" },
        { text: " line = 0;", explanation: "Line discipline number" }
      ]
    },
    {
      line: "-brkint -imaxbel",
      segments: [
        { text: "-brkint ", explanation: "A terminal setting flag (the minus indicates the flag is disabled)" },
        { text: "-imaxbel", explanation: "Another terminal behavior flag" }
      ]
    }
  ],
  chardet: [
    {
      line: "file.txt: utf-8 with confidence 0.99",
      segments: [
        { text: "file.txt: ", explanation: "The analyzed file" },
        { text: "utf-8 ", explanation: "The guessed character encoding" },
        { text: "with confidence 0.99", explanation: "The statistical certainty of the guess (99%)" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // COMPRESSION
  // ---------------------------------------------------------------------------
  pigz: [
    {
      line: "file.txt to file.txt.gz ",
      segments: [
        { text: "file.txt ", explanation: "The original input file" },
        { text: "to ", explanation: "Direction of operation" },
        { text: "file.txt.gz ", explanation: "The parallel-compressed gzip output file" }
      ]
    }
  ],
  lz4: [
    {
      line: "Compressed filename will be : file.txt.lz4 ",
      segments: [
        { text: "Compressed filename will be : ", explanation: "Status message" },
        { text: "file.txt.lz4 ", explanation: "The generated output file name" }
      ]
    },
    {
      line: "Compressed 10000 bytes into 4000 bytes ==> 40.00%",
      segments: [
        { text: "Compressed 10000 bytes into 4000 bytes ", explanation: "Original vs compressed sizes" },
        { text: "==> 40.00%", explanation: "The resulting file is 40% the size of the original" }
      ]
    }
  ],
  brotli: [
    {
      line: "brotli: file.txt: File exists",
      segments: [
        { text: "brotli: ", explanation: "The executing command" },
        { text: "file.txt: File exists", explanation: "Standard error output if attempting to decompress over an existing file without the force flag" }
      ]
    }
  ],
  zipinfo: [
    {
      line: "Archive:  archive.zip",
      segments: [
        { text: "Archive:  archive.zip", explanation: "The name of the inspected archive" }
      ]
    },
    {
      line: "Zip file size: 10240 bytes, number of entries: 2",
      segments: [
        { text: "Zip file size: 10240 bytes, ", explanation: "Total footprint of the zip file on disk" },
        { text: "number of entries: 2", explanation: "Total number of files/folders contained inside" }
      ]
    },
    {
      line: "-rw-r--r--  3.0 unx     1000 tx defN 23-Oct-12 10:00 file.txt",
      segments: [
        { text: "-rw-r--r--  ", explanation: "File permissions stored in the archive" },
        { text: "3.0 unx     ", explanation: "ZIP specification version and operating system origin" },
        { text: "1000 ", explanation: "Uncompressed file size in bytes" },
        { text: "tx ", explanation: "Text file format indicator" },
        { text: "defN ", explanation: "Compression method used (Deflate)" },
        { text: "23-Oct-12 10:00 ", explanation: "Modification timestamp" },
        { text: "file.txt", explanation: "Name of the file" }
      ]
    }
  ],
  atool: [
    {
      line: "archive.tar.gz: extracted to archive/",
      segments: [
        { text: "archive.tar.gz: ", explanation: "The source archive" },
        { text: "extracted to ", explanation: "Action performed by atool wrapper" },
        { text: "archive/", explanation: "The destination directory safely created to contain the files" }
      ]
    }
  ],
  mksquashfs: [
    {
      line: "Parallel mksquashfs, using 4 processors",
      segments: [
        { text: "Parallel mksquashfs, ", explanation: "Indicates the tool is running in multi-threaded mode" },
        { text: "using 4 processors", explanation: "Number of CPU cores utilized for compression" }
      ]
    },
    {
      line: "Creating 4.0 filesystem on image.sqfs, block size 131072.",
      segments: [
        { text: "Creating 4.0 filesystem ", explanation: "The version of the squashfs format being created" },
        { text: "on image.sqfs, ", explanation: "The output read-only archive file" },
        { text: "block size 131072.", explanation: "The compression block size (128KB), which affects compression ratio and read performance" }
      ]
    },
    {
      line: "[=================================================-] 100/100 100%",
      segments: [
        { text: "[=================================================-] ", explanation: "Visual progress bar" },
        { text: "100/100 100%", explanation: "Completion status" }
      ]
    }
  ],
  lzop: [
    {
      line: "file.txt.lzo: 40.0%",
      segments: [
        { text: "file.txt.lzo: ", explanation: "The compressed output file" },
        { text: "40.0%", explanation: "Compression ratio achieved (shown with verbose flag)" }
      ]
    }
  ],
  jar: [
    {
      line: "added manifest",
      segments: [
        { text: "added manifest", explanation: "Indicates the META-INF/MANIFEST.MF file was automatically generated and added" }
      ]
    },
    {
      line: "adding: com/example/Main.class(in = 1000) (out= 500)(deflated 50%)",
      segments: [
        { text: "adding: com/example/Main.class", explanation: "A compiled Java class file added to the archive" },
        { text: "(in = 1000) ", explanation: "Original size in bytes" },
        { text: "(out= 500)", explanation: "Compressed size" },
        { text: "(deflated 50%)", explanation: "Space saved" }
      ]
    }
  ],
  makeself: [
    {
      line: "Header is 400 lines long",
      segments: [
        { text: "Header is 400 lines long", explanation: "The size of the bash script preamble attached to the binary payload" }
      ]
    },
    {
      line: "About to compress 10240 KB of data...",
      segments: [
        { text: "About to compress 10240 KB of data...", explanation: "Status message before archiving the directory contents" }
      ]
    },
    {
      line: "Adding checksums and padding...",
      segments: [
        { text: "Adding checksums and padding...", explanation: "Finalizing the self-extracting executable to ensure integrity" }
      ]
    }
  ],
  zpaq: [
    {
      line: "zpaq v7.15 journaling archiver, compiled Oct 12 2023",
      segments: [
        { text: "zpaq v7.15 journaling archiver, compiled Oct 12 2023", explanation: "Version and build information banner" }
      ]
    },
    {
      line: "Creating archive.zpaq at offset 0",
      segments: [
        { text: "Creating archive.zpaq ", explanation: "The new archive file being created" },
        { text: "at offset 0", explanation: "Indicates this is the first journaled version inside the archive" }
      ]
    },
    {
      line: "Adding 10.000000 MB in 2 files - 4 threads.",
      segments: [
        { text: "Adding 10.000000 MB in 2 files ", explanation: "Summary of data to be compressed" },
        { text: "- 4 threads.", explanation: "Number of CPU threads dedicated to the task" }
      ]
    }
  ],
  lrzip: [
    {
      line: "Output filename is: archive.lrz",
      segments: [
        { text: "Output filename is: archive.lrz", explanation: "The resulting Long Range ZIP file" }
      ]
    },
    {
      line: "Compression ratio: 5.000. 20% size.",
      segments: [
        { text: "Compression ratio: 5.000. ", explanation: "Indicates the original file was 5 times larger" },
        { text: "20% size.", explanation: "The compressed file is only 20% of the original size" }
      ]
    }
  ],
  cabextract: [
    {
      line: "Extracting cabinet: archive.cab",
      segments: [
        { text: "Extracting cabinet: archive.cab", explanation: "Identifying the Microsoft Cabinet file being processed" }
      ]
    },
    {
      line: "  extracting file.dll",
      segments: [
        { text: "  extracting ", explanation: "Action being performed" },
        { text: "file.dll", explanation: "A file successfully extracted from the cabinet" }
      ]
    },
    {
      line: "All done, no errors.",
      segments: [
        { text: "All done, no errors.", explanation: "Success message" }
      ]
    }
  ],
  pax: [
    {
      line: "drwxr-xr-x  2 user group 0 Oct 12 10:00 src",
      segments: [
        { text: "drwxr-xr-x  ", explanation: "Directory permissions" },
        { text: "2 ", explanation: "Link count" },
        { text: "user group ", explanation: "Owner and group" },
        { text: "0 ", explanation: "Size" },
        { text: "Oct 12 10:00 ", explanation: "Timestamp" },
        { text: "src", explanation: "Directory name listed from the archive" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group 100 Oct 12 10:00 src/main.c",
      segments: [
        { text: "-rw-r--r--  1 user group 100 Oct 12 10:00 ", explanation: "Standard file metadata" },
        { text: "src/main.c", explanation: "File path listed from the archive" }
      ]
    }
  ]
};