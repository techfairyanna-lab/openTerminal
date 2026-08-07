import { CommandDef } from "./CommandDef";

export const linuxCmdsFileManagement: CommandDef[] = [
  {
    name: "ls",
    description: "List directory contents.",
    useCases: ["View files in the current directory", "Check file permissions"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Long listing format" },
      "-a": { description: "Show hidden files" },
      "-h": { description: "Human-readable sizes" },
      "-A": { description: "Show almost all files (exclude . and .. only)" },
      "-R": { description: "List subdirectories recursively" },
      "-r": { description: "Reverse the order while sorting" },
      "-t": { description: "Sort by modification time, newest first" },
      "-S": { description: "Sort by file size, largest first" },
      "-X": { description: "Sort alphabetically by file extension" },
      "-1": { description: "List one file per line" },
      "-d": { description: "List directories themselves, not their contents" },
      "-F": { description: "Append indicator (one of */=>@|) to entries" },
      "-p": { description: "Append / indicator to directories" },
      "-i": { description: "Print the inode number of each file" },
      "-n": { description: "Like -l, but list numeric user and group IDs" },
      "-o": { description: "Long format without group information" },
      "-g": { description: "Long format without owner information" },
      "-s": { description: "Print the allocated size of each file, in blocks" },
      "-u": { description: "Sort by, and show, access time" },
      "-c": { description: "Sort by, and show, status change time (ctime)" },
      "-f": { description: "Do not sort, enable -aU, disable -ls --color" },
      "-m": { description: "Fill width with a comma-separated list of entries" },
      "-Q": { description: "Enclose entry names in double quotes" },
      "-b": { description: "Print C-style escapes for non-graphic characters" },
      "-N": { description: "Print entry names without quoting" },
      "-C": { description: "List entries by columns (default for terminal output)" },
      "-x": { description: "List entries by lines instead of by columns" },
      "-U": { description: "Do not sort; list entries in directory order" },
      "-v": { description: "Natural sort of (version) numbers within text" },
      "-k": { description: "Default to 1024-byte blocks for disk usage" },
      "-L": { description: "When showing file information for a symbolic link, show information for the file the link references" },
      "-H": { description: "Follow symbolic links listed on the command line" },
      "-P": { description: "Never follow symbolic links (default behavior)" },
      "-Z": { description: "Display SELinux security context for each file" },
      "-T": { description: "Display complete time information including seconds" },
      "-w": { description: "Set output width to NUM columns" },
      "--color=auto": { description: "Colorize output only when stdout is a terminal" },
      "--color=always": { description: "Always colorize output" },
      "--color=never": { description: "Never colorize output" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cd", "tree"],
    category: "file-management"
  },
  {
    name: "cd",
    description: "Change the shell working directory.",
    useCases: ["Navigate to a different folder"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-": { description: "Return to previous directory" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ls", "pwd"],
    category: "file-management"
  },
  {
    name: "pwd",
    description: "Print the absolute path of the current working directory.",
    useCases: ["Find out exactly where you are in the filesystem"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-P": { description: "Avoid all symlinks" },
      "-L": { description: "Use logical path (with symlinks, this is the default)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cd", "ls"],
    category: "file-management"
  },
  {
    name: "cp",
    description: "Copy files and directories.",
    useCases: ["Backup a file", "Duplicate a folder"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-r": { description: "Copy directories recursively" },
      "-i": { description: "Prompt before overwrite" },
      "-v": { description: "Explain what is being done (verbose)" },
      "-u": { description: "Copy only when source is newer than destination or destination is missing" },
      "--backup": { description: "Make a backup of each existing destination file" },
      "-p": { description: "Preserve file mode, ownership, and timestamps" },
      "-l": { description: "Create hard links instead of copying files" }
    },
    exampleOutputLines: [],
    relatedCommands: ["mv", "rm", "rsync"],
    category: "file-management"
  },
  {
    name: "mv",
    description: "Move or rename files and directories.",
    useCases: ["Rename a file", "Move a file to a different folder"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Prompt before overwrite" },
      "-v": { description: "Explain what is being done (verbose)" },
      "-u": { description: "Move only when the source file is newer than the destination file or when the destination file is missing" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cp", "rm"],
    category: "file-management"
  },
  {
    name: "rm",
    description: "Remove files or directories.",
    useCases: ["Delete a file", "Delete an entire directory tree"],
    isDangerous: true,
    dangerWarning: "Using rm permanently deletes files. There is no recycle bin by default.",
    safeAlternatives: ["trash-cli", "mv (move to a backup folder)"],
    flags: {
      "-r": { description: "Remove directories and their contents recursively" },
      "-f": { description: "Force deletion without prompting" },
      "-i": { description: "Prompt before every removal (safer alternative to -f)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rmdir", "unlink"],
    category: "file-management"
  },
  {
    name: "mkdir",
    description: "Create new directories.",
    useCases: ["Make a new folder", "Create a nested folder structure at once"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Create parent directories as needed" },
      "-v": { description: "Print a message for each created directory" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rmdir"],
    category: "file-management"
  },
  {
    name: "rmdir",
    description: "Remove empty directories.",
    useCases: ["Clean up unused empty folders"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Remove directory and its ancestors" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rm", "mkdir"],
    category: "file-management"
  },
  {
    name: "touch",
    description: "Change file timestamps or create empty files.",
    useCases: ["Create a quick empty file"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-m": { description: "Change only the modification time" },
      "-a": { description: "Change only the access time" }
    },
    exampleOutputLines: [],
    relatedCommands: ["mkdir"],
    category: "file-management"
  },
  {
    name: "ln",
    description: "Make links between files.",
    useCases: ["Create a shortcut (symlink) to a file or folder"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-s": { description: "Make symbolic links instead of hard links" },
      "-f": { description: "Remove existing destination files" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cp", "readlink"],
    category: "file-management"
  },
  {
    name: "find",
    description: "Search for files in a directory hierarchy.",
    useCases: ["Find files by name", "Find files by size or modification date"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-name": { description: "Search by file name" },
      "-type": { description: "Search by file type (f for file, d for directory)" },
      "-size": { description: "Match files by size (e.g. +10M for larger than 10MB)" },
      "-exec": { description: "Execute a command on each matched file" },
      "-mtime": { description: "Find files modified N days ago (use +N for more than, -N for less than)" },
      "-newer": { description: "Find files newer than the specified reference file" }
    },
    exampleOutputLines: [],
    relatedCommands: ["locate", "grep"],
    category: "file-management"
  },
  {
    name: "locate",
    description: "Find files by name extremely quickly using a pre-built database.",
    useCases: ["Quickly find a file anywhere on the system"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case distinctions" }
    },
    exampleOutputLines: [],
    relatedCommands: ["find", "updatedb"],
    category: "file-management"
  },
  {
    name: "tree",
    description: "List contents of directories in a tree-like format.",
    useCases: ["Visualize folder structures"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-L": { description: "Max display depth of the directory tree" },
      "-a": { description: "Print all files including hidden ones" },
      "-d": { description: "List directories only" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ls", "find"],
    category: "file-management"
  },
  {
    name: "stat",
    description: "Display file or file system status.",
    useCases: ["Check exactly when a file was created/modified", "View detailed permissions"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Use a specific output format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ls", "file"],
    category: "file-management"
  },
  {
    name: "file",
    description: "Determine file type based on contents rather than extension.",
    useCases: ["Find out what kind of data is inside an unknown file"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Output MIME type strings" },
      "-b": { description: "Brief mode, do not prepend filenames to output lines" }
    },
    exampleOutputLines: [],
    relatedCommands: ["stat"],
    category: "file-management"
  },
  {
    name: "basename",
    description: "Strip directory and suffix from filenames.",
    useCases: ["Extract just the filename from a full path in a script"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["dirname", "realpath"],
    category: "file-management"
  },
  {
    name: "dirname",
    description: "Strip non-directory suffix from a file name.",
    useCases: ["Extract just the folder path from a full file path"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["basename", "realpath"],
    category: "file-management"
  },
  {
    name: "realpath",
    description: "Print the resolved absolute file name.",
    useCases: ["Resolve symlinks to their actual target"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["readlink"],
    category: "file-management"
  },
  {
    name: "readlink",
    description: "Print resolved symbolic links or canonical file names.",
    useCases: ["Find out where a symlink points to"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Canonicalize by following every symlink" }
    },
    exampleOutputLines: [],
    relatedCommands: ["realpath", "ln"],
    category: "file-management"
  },
  {
    name: "mktemp",
    description: "Create a temporary file or directory.",
    useCases: ["Safely create a temporary file in a bash script"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Create a directory instead of a file" }
    },
    exampleOutputLines: [],
    relatedCommands: ["touch", "mkdir"],
    category: "file-management"
  },
  {
    name: "install",
    description: "Copy files and set attributes.",
    useCases: ["Copy a compiled binary to /usr/local/bin and set executable permissions"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-m": { description: "Set permission mode (as in chmod)" },
      "-d": { description: "Create all components of the specified directories" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cp", "chmod"],
    category: "file-management"
  },
  {
    name: "shred",
    description: "Overwrite a file to hide its contents, and optionally delete it.",
    useCases: ["Securely delete sensitive files so they cannot be recovered"],
    isDangerous: true,
    dangerWarning: "Shred securely destroys file contents, making them irrecoverable by normal means.",
    safeAlternatives: ["trash-cli", "mv (move to secure location)"],
    flags: {
      "-u": { description: "Deallocate and remove file after overwriting" },
      "-n": { description: "Overwrite N times instead of the default (3)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rm", "dd"],
    category: "file-management"
  },
  {
    name: "rename",
    description: "Rename multiple files.",
    useCases: ["Bulk rename files using regular expressions"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-v": { description: "Verbose: print names of files successfully renamed" },
      "-n": { description: "No action: show what files would have been renamed" }
    },
    exampleOutputLines: [],
    relatedCommands: ["mv", "mmv"],
    category: "file-management"
  },
  {
    name: "split",
    description: "Split a file into pieces.",
    useCases: ["Break a giant log file into smaller chunks for easier reading"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-b": { description: "Put SIZE bytes per output file" },
      "-l": { description: "Put NUMBER lines/records per output file" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cat", "csplit"],
    category: "file-management"
  },
  {
    name: "truncate",
    description: "Shrink or extend the size of a file to the specified size.",
    useCases: ["Empty a log file without deleting it (truncate -s 0)"],
    isDangerous: true,
    dangerWarning: "Truncating a file to 0 bytes destroys all data inside it permanently.",
    safeAlternatives: ["Backup the file before truncating"],
    flags: {
      "-s": { description: "Set or adjust the file size by SIZE bytes" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rm", "split"],
    category: "file-management"
  },
  {
    name: "sync",
    description: "Synchronize cached writes to persistent storage.",
    useCases: ["Ensure all data is written to a USB drive before removing it"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["umount"],
    category: "file-management"
  },
  {
    name: "rsync",
    description: "A fast, versatile, remote (and local) file-copying tool.",
    useCases: ["Sync a local folder to a remote server", "Make incremental backups"],
    isDangerous: false,
    dangerWarning: "Using the --delete flag will remove files in the destination that don't exist in the source.",
    safeAlternatives: ["Run with --dry-run first to see what will happen"],
    flags: {
      "-a": { description: "Archive mode (recursively copy and preserve permissions)" },
      "-v": { description: "Increase verbosity" },
      "--delete": { description: "Delete extraneous files from dest dirs" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cp", "scp"],
    category: "file-management"
  },
  {
    name: "mmv",
    description: "Move, copy, append or link multiple files by wildcard patterns.",
    useCases: ["Mass rename files easily with wildcards"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["rename", "mv"],
    category: "file-management"
  },
  {
    name: "lsof",
    description: "List open files.",
    useCases: ["Find out which process is locking a file", "See what network ports a program is using"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "List IP sockets" },
      "-p": { description: "List files opened by a specific PID" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fuser", "netstat"],
    category: "file-management"
  },
  {
    name: "fuser",
    description: "Identify processes using files or sockets.",
    useCases: ["Find and optionally kill a process that is keeping a drive from unmounting"],
    isDangerous: false,
    dangerWarning: "fuser -k will instantly kill processes accessing the file/mount.",
    safeAlternatives: ["Use fuser without -k first to investigate"],
    flags: {
      "-k": { description: "Kill processes accessing the file" },
      "-v": { description: "Verbose mode" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lsof", "kill"],
    category: "file-management"
  },
  {
    name: "chattr",
    description: "Change file attributes on a Linux file system.",
    useCases: ["Make a file immutable so even root cannot delete it"],
    isDangerous: true,
    dangerWarning: "Improperly locking system files can cause the OS to malfunction during updates.",
    safeAlternatives: [],
    flags: {
      "+i": { description: "Make file immutable" },
      "-i": { description: "Remove immutable flag" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lsattr", "chmod"],
    category: "file-management"
  },
  {
    name: "lsattr",
    description: "List file attributes on a Linux second extended file system.",
    useCases: ["Check if a file has the immutable flag set"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-R": { description: "Recursively list attributes of directories and their contents" }
    },
    exampleOutputLines: [],
    relatedCommands: ["chattr"],
    category: "file-management"
  },
  {
    name: "dd",
    description: "Convert and copy a file.",
    useCases: ["Create a bootable USB from an ISO file", "Clone an entire hard drive bit-by-bit"],
    isDangerous: true,
    dangerWarning: "dd is nicknamed 'disk destroyer'. Pointing 'of=' (output file) to the wrong drive will instantly and permanently wipe your data.",
    safeAlternatives: ["Double check your 'of=' target using lsblk before pressing enter."],
    flags: {
      "if=": { description: "Input file (read from)" },
      "of=": { description: "Output file (write to)" },
      "bs=": { description: "Block size (read/write up to BYTES bytes at a time)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cat", "cp"],
    category: "file-management"
  },
  {
    name: "mc",
    description: "Visual shell for Unix-like systems (Midnight Commander).",
    useCases: ["Manage files visually using a two-pane text interface"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ranger", "nautilus"],
    category: "file-management"
  },
  {
    name: "ranger",
    description: "Vim-inspired file manager for the console.",
    useCases: ["Navigate directories quickly using Vim keybindings"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["mc", "vifm"],
    category: "file-management"
  },
  {
    name: "ncdu",
    description: "NCurses Disk Usage.",
    useCases: ["Find out what is eating up disk space via an interactive terminal UI"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-x": { description: "Do not cross filesystem boundaries" }
    },
    exampleOutputLines: [],
    relatedCommands: ["du", "df"],
    category: "file-management"
  },
  {
    name: "trash-cli",
    description: "Command line trash utility.",
    useCases: ["Safely delete files by moving them to the trash bin instead of destroying them"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["rm"],
    category: "file-management"
  },
  {
    name: "xdg-open",
    description: "Opens a file or URL in the user's preferred application.",
    useCases: ["Open a PDF or image from the terminal into a GUI app"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["open", "mimeopen"],
    category: "file-management"
  },
  {
    name: "open",
    description: "Open files and directories (often linked to xdg-open on Linux or macOS's native tool).",
    useCases: ["Open a directory in the default GUI file manager"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["xdg-open"],
    category: "file-management"
  },
  {
    name: "nautilus",
    description: "File manager for GNOME.",
    useCases: ["Open the GNOME graphical file manager from the terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["nemo", "dolphin"],
    category: "file-management"
  },
  {
    name: "nemo",
    description: "File manager for Cinnamon.",
    useCases: ["Open the Cinnamon graphical file manager"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["nautilus"],
    category: "file-management"
  },
  {
    name: "dolphin",
    description: "File manager for KDE.",
    useCases: ["Open the KDE graphical file manager"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["nautilus"],
    category: "file-management"
  },
  {
    name: "pathchk",
    description: "Check whether file names are valid or portable.",
    useCases: ["Validate if a generated filename will work across POSIX systems"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Check for most POSIX systems" }
    },
    exampleOutputLines: [],
    relatedCommands: ["basename"],
    category: "file-management"
  },
  {
    name: "mkfifo",
    description: "Make FIFOs (named pipes).",
    useCases: ["Create a pipe file to allow inter-process communication"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["mknod"],
    category: "file-management"
  },
  {
    name: "mknod",
    description: "Make block or character special files.",
    useCases: ["Create device nodes for drivers manually"],
    isDangerous: true,
    dangerWarning: "Creating arbitrary device nodes can allow malicious access to raw hardware.",
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["mkfifo"],
    category: "file-management"
  },
  {
    name: "tac",
    description: "Concatenate and print files in reverse.",
    useCases: ["Read a log file from the newest entry to the oldest"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["cat", "rev"],
    category: "file-management"
  },
  {
    name: "rev",
    description: "Reverse lines characterwise.",
    useCases: ["Reverse strings for text processing tasks"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["tac", "cat"],
    category: "file-management"
  },
  {
    name: "nl",
    description: "Number lines of files.",
    useCases: ["Add line numbers to a text document"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-b": { description: "Specify which lines to number" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cat", "sed"],
    category: "file-management"
  }
];