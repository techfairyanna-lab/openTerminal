import { CommandDef } from "./CommandDef";

export const linuxCmdsFileNavExtra: CommandDef[] = [
  {
    name: "pushd",
    description: "Save and then change the current directory.",
    useCases: ["Temporarily switch to another directory while remembering where you were"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["popd", "dirs", "cd"],
    category: "navigation"
  },
  {
    name: "popd",
    description: "Restore the previous value of the current directory.",
    useCases: ["Return to the directory saved by pushd"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["pushd", "dirs"],
    category: "navigation"
  },
  {
    name: "dirs",
    description: "Display the list of currently remembered directories.",
    useCases: ["Check the directory stack saved by pushd"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Clear the directory stack" },
      "-v": { description: "Display stack with entries numbered" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pushd", "popd"],
    category: "navigation"
  },
  {
    name: "exa",
    description: "A modern replacement for ls.",
    useCases: ["List directory contents with colors and git integration"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Display extended details and attributes" },
      "--tree": { description: "List files as a tree" }
    },
    exampleOutputLines: [],
    relatedCommands: ["eza", "ls", "tree"],
    category: "file-management"
  },
  {
    name: "eza",
    description: "A modern, maintained replacement for ls (fork of exa).",
    useCases: ["List directory contents with icons and git integration"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Display extended details" },
      "--icons": { description: "Display icons next to files" }
    },
    exampleOutputLines: [],
    relatedCommands: ["exa", "ls"],
    category: "file-management"
  },
  {
    name: "bat",
    description: "A cat clone with syntax highlighting and Git integration.",
    useCases: ["Read source code files with syntax highlighting"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Print without decorations" },
      "-n": { description: "Show line numbers" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cat", "less"],
    category: "file-management"
  },
  {
    name: "duf",
    description: "Disk Usage/Free Utility - a better 'df' alternative.",
    useCases: ["Check disk space usage in a modern, readable format"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "--hide": { description: "Hide specific devices or mount points" }
    },
    exampleOutputLines: [],
    relatedCommands: ["df", "lsblk"],
    category: "disk"
  },
  {
    name: "dust",
    description: "A more intuitive version of du in rust.",
    useCases: ["Visualize directory tree and disk usage"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Depth to show" },
      "-r": { description: "Reverse order" }
    },
    exampleOutputLines: [],
    relatedCommands: ["du", "ncdu"],
    category: "disk"
  },
  {
    name: "broot",
    description: "A new way to see and navigate directory trees.",
    useCases: ["Explore large directories without losing overview"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-h": { description: "Show hidden files" },
      "-s": { description: "Show file sizes" }
    },
    exampleOutputLines: [],
    relatedCommands: ["tree", "nnn"],
    category: "navigation"
  },
  {
    name: "lf",
    description: "Terminal file manager written in Go, heavily inspired by ranger.",
    useCases: ["Manage files quickly in the terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ranger", "vifm"],
    category: "file-management"
  },
  {
    name: "vifm",
    description: "A file manager with curses interface, which provides Vi[m]-like environment.",
    useCases: ["Navigate file system using vim keybindings"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ranger", "lf"],
    category: "file-management"
  },
  {
    name: "nnn",
    description: "A full-featured terminal file manager. It's tiny and nearly 0-config.",
    useCases: ["Browse files blazingly fast"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Use access time" },
      "-d": { description: "Detail mode" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lf", "ranger", "mc"],
    category: "file-management"
  },
  {
    name: "fff",
    description: "A simple file manager written in bash.",
    useCases: ["Lightweight file management for bash users"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["nnn"],
    category: "file-management"
  },
  {
    name: "entr",
    description: "Run arbitrary commands when files change.",
    useCases: ["Automatically rebuild a project when source files change"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Clear the screen before running" },
      "-r": { description: "Reload a persistent child process" }
    },
    exampleOutputLines: [],
    relatedCommands: ["watchman", "inotifywait"],
    category: "file-management"
  },
  {
    name: "inotifywait",
    description: "Wait for changes to files using inotify.",
    useCases: ["Block a script until a file is written or modified"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-m": { description: "Monitor continuously" },
      "-r": { description: "Watch directories recursively" }
    },
    exampleOutputLines: [],
    relatedCommands: ["inotifywatch", "entr"],
    category: "file-management"
  },
  {
    name: "inotifywatch",
    description: "Gather and output statistics about inotify events.",
    useCases: ["Analyze which files are being accessed the most"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-v": { description: "Verbose output" }
    },
    exampleOutputLines: [],
    relatedCommands: ["inotifywait"],
    category: "file-management"
  },
  {
    name: "fswatch",
    description: "A cross-platform file change monitor.",
    useCases: ["Trigger a script on file modifications across multiple OS types"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-o": { description: "Batch marker (numeric format)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["entr", "watchman"],
    category: "file-management"
  },
  {
    name: "watchman",
    description: "A file watching service by Meta.",
    useCases: ["Trigger complex build pipelines on large mono-repos when files change"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["entr", "fswatch"],
    category: "file-management"
  },
  {
    name: "flock",
    description: "Manage locks from shell scripts.",
    useCases: ["Prevent a cron job from running concurrently with itself"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Fail rather than wait if the lock is held" },
      "-u": { description: "Unlock a file descriptor" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lslocks"],
    category: "file-management"
  },
  {
    name: "fallocate",
    description: "Preallocate or deallocate space to a file.",
    useCases: ["Instantly create a large placeholder file without writing zeroes (like dd)"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Length of the allocation" },
      "-d": { description: "Detect and dig holes (sparse)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["truncate", "dd"],
    category: "file-management"
  },
  {
    name: "xfs_repair",
    description: "Repair an XFS filesystem.",
    useCases: ["Fix corruption on an unmounted XFS drive"],
    isDangerous: true,
    dangerWarning: "Running xfs_repair on a mounted filesystem can cause severe data corruption.",
    safeAlternatives: ["Unmount the drive first"],
    flags: {
      "-n": { description: "No modify mode (check only)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fsck", "xfs_info"],
    category: "disk"
  },
  {
    name: "xfs_info",
    description: "Display XFS filesystem geometry information.",
    useCases: ["Check block size and geometry of an XFS partition"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["xfs_repair"],
    category: "disk"
  },
  {
    name: "resize2fs",
    description: "Ext2/ext3/ext4 file system resizer.",
    useCases: ["Expand an ext4 filesystem after enlarging its partition"],
    isDangerous: true,
    dangerWarning: "Shrinking a filesystem incorrectly or without shrinking the partition first can destroy data.",
    safeAlternatives: ["Always backup data before resizing filesystems"],
    flags: {
      "-p": { description: "Print progress bars" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fdisk", "parted"],
    category: "disk"
  },
  {
    name: "dumpe2fs",
    description: "Dump ext2/ext3/ext4 filesystem information.",
    useCases: ["View superblock and block group information for an ext4 drive"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-h": { description: "Only display the superblock information" }
    },
    exampleOutputLines: [],
    relatedCommands: ["tune2fs"],
    category: "disk"
  },
  {
    name: "debugfs",
    description: "ext2/ext3/ext4 file system debugger.",
    useCases: ["Examine or manually modify the state of an ext filesystem"],
    isDangerous: true,
    dangerWarning: "Modifying filesystem structures directly can render the disk unreadable.",
    safeAlternatives: [],
    flags: {
      "-w": { description: "Open the filesystem in read-write mode" }
    },
    exampleOutputLines: [],
    relatedCommands: ["dumpe2fs", "fsck"],
    category: "disk"
  },
  {
    name: "filefrag",
    description: "Report on file fragmentation.",
    useCases: ["Check how fragmented a large video or database file is"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-v": { description: "Verbose mode" }
    },
    exampleOutputLines: [],
    relatedCommands: ["e4defrag"],
    category: "disk"
  },
  {
    name: "wipefs",
    description: "Wipe a signature from a device.",
    useCases: ["Remove filesystem, raid, or partition table signatures from a disk"],
    isDangerous: true,
    dangerWarning: "wipefs removes signatures, making the filesystem or partition invisible and effectively erasing access to data.",
    safeAlternatives: ["Double check your target device using lsblk"],
    flags: {
      "-a": { description: "Wipe all available signatures" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fdisk", "dd"],
    category: "disk"
  },
  {
    name: "sgdisk",
    description: "Command-line GUID partition table (GPT) manipulator.",
    useCases: ["Scripted creation or backup of GPT partition tables"],
    isDangerous: true,
    dangerWarning: "Modifying partition tables can destroy access to all data on the disk.",
    safeAlternatives: [],
    flags: {
      "-p": { description: "Print the partition table" },
      "-b": { description: "Backup partition table to a file" }
    },
    exampleOutputLines: [],
    relatedCommands: ["gdisk", "parted"],
    category: "disk"
  },
  {
    name: "gdisk",
    description: "Interactive GUID partition table (GPT) manipulator.",
    useCases: ["Manually create or edit GPT partitions"],
    isDangerous: true,
    dangerWarning: "Writing an incorrect partition table will make existing data unreadable.",
    safeAlternatives: [],
    flags: {
      "-l": { description: "List partitions" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sgdisk", "fdisk"],
    category: "disk"
  },
  {
    name: "sfdisk",
    description: "Script-oriented tool for partitioning any block device.",
    useCases: ["Dump or restore partition tables from scripts"],
    isDangerous: true,
    dangerWarning: "Re-partitioning a drive destructively modifies layout.",
    safeAlternatives: [],
    flags: {
      "-d": { description: "Dump the partitions of a device" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fdisk", "parted"],
    category: "disk"
  },
  {
    name: "partprobe",
    description: "Inform the OS of partition table changes.",
    useCases: ["Make the kernel aware of a newly created partition without rebooting"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["fdisk", "lsblk"],
    category: "disk"
  },
  {
    name: "blockdev",
    description: "Call block device ioctls from the command line.",
    useCases: ["Get the size of a block device or flush its buffers"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "--getsize64": { description: "Get size in bytes" },
      "--flushbufs": { description: "Flush buffers" }
    },
    exampleOutputLines: [],
    relatedCommands: ["lsblk"],
    category: "disk"
  },
  {
    name: "lvm",
    description: "LVM2 tools.",
    useCases: ["Access Logical Volume Manager (LVM) interactive shell"],
    isDangerous: true,
    dangerWarning: "Using LVM tools to modify logical volumes can result in data loss if volumes are shrunk or removed incorrectly.",
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["lvdisplay", "vgdisplay"],
    category: "disk"
  },
  {
    name: "pvdisplay",
    description: "Display attributes of a physical volume.",
    useCases: ["View details about disks initialized for LVM"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-s": { description: "Short listing format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["vgdisplay", "lvdisplay"],
    category: "disk"
  },
  {
    name: "vgdisplay",
    description: "Display attributes of volume groups.",
    useCases: ["View available space inside an LVM volume group"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-s": { description: "Short listing format" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pvdisplay", "lvdisplay"],
    category: "disk"
  },
  {
    name: "lvdisplay",
    description: "Display attributes of a logical volume.",
    useCases: ["Check the size and path of an LVM logical volume"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-m": { description: "Display mapping of logical extents to physical extents" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pvdisplay", "vgdisplay"],
    category: "disk"
  },
  {
    name: "pvcreate",
    description: "Initialize a disk or partition for use by LVM.",
    useCases: ["Prepare a new hard drive to be added to an LVM group"],
    isDangerous: true,
    dangerWarning: "Wipes LVM headers and effectively reinitializes the partition, destroying any existing non-LVM filesystem there.",
    safeAlternatives: ["Ensure the drive is empty before running"],
    flags: {
      "-f": { description: "Force the creation without any confirmation" }
    },
    exampleOutputLines: [],
    relatedCommands: ["vgcreate"],
    category: "disk"
  },
  {
    name: "vgcreate",
    description: "Create a volume group.",
    useCases: ["Group multiple physical volumes into one large storage pool"],
    isDangerous: true,
    dangerWarning: "Creating a volume group with a name that conflicts or using in-use disks can lead to issues.",
    safeAlternatives: [],
    flags: {
      "-s": { description: "Physical extent size" }
    },
    exampleOutputLines: [],
    relatedCommands: ["pvcreate", "lvcreate"],
    category: "disk"
  },
  {
    name: "lvcreate",
    description: "Create a logical volume in an existing volume group.",
    useCases: ["Carve out a new usable partition from an LVM storage pool"],
    isDangerous: true,
    dangerWarning: "While creating is generally safe, overwriting existing volumes (with same name) destroys data.",
    safeAlternatives: [],
    flags: {
      "-L": { description: "Size of the logical volume" },
      "-n": { description: "Name of the logical volume" }
    },
    exampleOutputLines: [],
    relatedCommands: ["vgcreate", "mkfs"],
    category: "disk"
  },
  {
    name: "swapon",
    description: "Enable devices and files for paging and swapping.",
    useCases: ["Activate a new swap partition or swap file"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Enable all swaps from /etc/fstab" },
      "--show": { description: "Show a summary of active swap devices" }
    },
    exampleOutputLines: [],
    relatedCommands: ["swapoff", "mkswap"],
    category: "disk"
  },
  {
    name: "swapoff",
    description: "Disable devices and files for paging and swapping.",
    useCases: ["Safely disable a swap file before deleting it"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Disable all swaps" }
    },
    exampleOutputLines: [],
    relatedCommands: ["swapon"],
    category: "disk"
  },
  {
    name: "mkswap",
    description: "Set up a Linux swap area.",
    useCases: ["Format a partition or file to be used as swap memory"],
    isDangerous: true,
    dangerWarning: "mkswap will overwrite any existing filesystem and data on the specified device or file.",
    safeAlternatives: [],
    flags: {
      "-f": { description: "Force mkswap even if it's considered dangerous" }
    },
    exampleOutputLines: [],
    relatedCommands: ["swapon", "fallocate"],
    category: "disk"
  },
  {
    name: "cryptsetup",
    description: "Manage plain dm-crypt and LUKS encrypted volumes.",
    useCases: ["Format, open, or close an encrypted LUKS partition"],
    isDangerous: true,
    dangerWarning: "Formatting a device with luksFormat permanently wipes existing data. Losing the LUKS password means permanent data loss.",
    safeAlternatives: [],
    flags: {
      "luksFormat": { description: "Format a partition for LUKS encryption" },
      "luksOpen": { description: "Open a LUKS encrypted partition" }
    },
    exampleOutputLines: [],
    relatedCommands: ["dmsetup", "losetup"],
    category: "disk"
  },
  {
    name: "dmsetup",
    description: "Low level logical volume management.",
    useCases: ["Inspect device-mapper tables used by LVM or LUKS"],
    isDangerous: true,
    dangerWarning: "Removing or reloading device-mapper tables for active drives can cause data corruption.",
    safeAlternatives: [],
    flags: {
      "ls": { description: "List all mapped devices" },
      "remove": { description: "Remove a device-mapper device" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cryptsetup", "lvm"],
    category: "disk"
  },
  {
    name: "losetup",
    description: "Set up and control loop devices.",
    useCases: ["Mount an ISO or raw disk image file as a block device"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Find the first unused loop device" },
      "-d": { description: "Detach the file or device associated with the specified loop device" }
    },
    exampleOutputLines: [],
    relatedCommands: ["mount"],
    category: "disk"
  },
  {
    name: "updatedb",
    description: "Update a database for mlocate.",
    useCases: ["Update the search index used by the 'locate' command"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-U": { description: "Update only the specified directory" }
    },
    exampleOutputLines: [],
    relatedCommands: ["locate", "find"],
    category: "file-management"
  },
  {
    name: "pv",
    description: "Monitor the progress of data through a pipe.",
    useCases: ["See a progress bar when piping a large file using dd or gzip"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Turn the progress bar on" },
      "-e": { description: "Turn the ETA timer on" }
    },
    exampleOutputLines: [],
    relatedCommands: ["dd", "cat"],
    category: "file-management"
  },
  {
    name: "iotop",
    description: "Simple top-like I/O monitor.",
    useCases: ["Find out which processes are doing the most disk reading/writing"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-o": { description: "Only show processes or threads actually doing I/O" }
    },
    exampleOutputLines: [],
    relatedCommands: ["top", "htop"],
    category: "system-info"
  },
  {
    name: "dir",
    description: "List directory contents (equivalent to ls -C -b).",
    useCases: ["List files in columns (legacy DOS-like command)"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ls", "vdir"],
    category: "file-management"
  },
  {
    name: "vdir",
    description: "List directory contents (equivalent to ls -l -b).",
    useCases: ["List files in long format by default"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ls", "dir"],
    category: "file-management"
  },
  {
    name: "dircolors",
    description: "Color setup for ls.",
    useCases: ["Generate commands to set the LS_COLORS environment variable"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Print default color configuration database" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ls"],
    category: "file-management"
  },
  {
    name: "fatrace",
    description: "Report system wide file access events.",
    useCases: ["See which programs are accessing files in real time across the system"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Current mount only" },
      "-f": { description: "Filter by event types" }
    },
    exampleOutputLines: [],
    relatedCommands: ["inotifywait", "strace"],
    category: "file-management"
  },
  {
    name: "rdfind",
    description: "Finds duplicate files.",
    useCases: ["Find identical files by checksum to save space"],
    isDangerous: false,
    dangerWarning: "Using flags to delete duplicates removes them permanently.",
    safeAlternatives: ["Run without destructive flags first to review output."],
    flags: {
      "-deleteduplicates": { description: "Delete all but the first instance of a duplicate file" },
      "-makehardlinks": { description: "Replace duplicates with hard links" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fdupes", "jdupes"],
    category: "file-management"
  },
  {
    name: "fdupes",
    description: "Finds duplicate files in a given set of directories.",
    useCases: ["Locate duplicate photos or documents recursively"],
    isDangerous: false,
    dangerWarning: "Using the -d flag prompts for deletion; using -dN deletes automatically.",
    safeAlternatives: ["Run without -d first"],
    flags: {
      "-r": { description: "Recursive search" },
      "-d": { description: "Prompt user for files to preserve and delete all others" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rdfind", "jdupes"],
    category: "file-management"
  },
  {
    name: "jdupes",
    description: "A significantly faster alternative to fdupes.",
    useCases: ["Quickly identify duplicate files in massive directories"],
    isDangerous: false,
    dangerWarning: "The delete flag permanently removes files.",
    safeAlternatives: [],
    flags: {
      "-r": { description: "Recursive" },
      "-d": { description: "Delete duplicates" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fdupes", "duperemove"],
    category: "file-management"
  },
  {
    name: "duperemove",
    description: "Tools for deduplicating file systems like Btrfs and XFS.",
    useCases: ["Perform block-level deduplication on a supported filesystem to save space"],
    isDangerous: true,
    dangerWarning: "Can cause high IO load; if interrupted or run on unsupported filesystems without testing, it might be unsafe.",
    safeAlternatives: [],
    flags: {
      "-d": { description: "Submit duplicate extents for deduplication" },
      "-r": { description: "Recursive" }
    },
    exampleOutputLines: [],
    relatedCommands: ["jdupes"],
    category: "disk"
  }
];