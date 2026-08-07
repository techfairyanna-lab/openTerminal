import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const lsVariants: Record<string, ExampleOutputLine[]> = {
  "-l": [
    {
      line: "total 32",
      segments: [
        { text: "total 32", explanation: "Total number of file system blocks used by the listed files" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src",
      segments: [
        { text: "d", explanation: "Indicates a directory" },
        { text: "rwxr-xr-x", explanation: "Owner has read/write/execute, group and others have read/execute permissions" },
        { text: "  5 ", explanation: "Number of hard links" },
        { text: "user ", explanation: "Owner" },
        { text: "group  ", explanation: "Group" },
        { text: "4096 ", explanation: "Size in bytes (size of the directory block)" },
        { text: "Jun 01 10:30 ", explanation: "Last modified date and time" },
        { text: "src", explanation: "Directory name" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt",
      segments: [
        { text: "-", explanation: "Indicates a regular file" },
        { text: "rw-r--r--", explanation: "Owner has read/write, group and others have read-only permissions" },
        { text: "  1 ", explanation: "Number of hard links" },
        { text: "user group  ", explanation: "Owner and group" },
        { text: "1024 ", explanation: "File size in bytes (1 KB)" },
        { text: "Jun 01 10:25 ", explanation: "Last modified date and time" },
        { text: "file.txt", explanation: "File name" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md",
      segments: [
        { text: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md", explanation: "Regular text file listing" }
      ]
    }
  ],
  "-lh": [
    {
      line: "total 32K",
      segments: [
        { text: "total 32K", explanation: "Total number of file system blocks used by the listed files in human-readable format" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4.0K Jun 01 10:30 src",
      segments: [
        { text: "d", explanation: "Indicates a directory" },
        { text: "rwxr-xr-x", explanation: "Owner has read/write/execute, group and others have read/execute permissions" },
        { text: "  5 ", explanation: "Number of hard links" },
        { text: "user ", explanation: "Owner" },
        { text: "group  ", explanation: "Group" },
        { text: "4.0K ", explanation: "Size in human-readable format (Kilobytes)" },
        { text: "Jun 01 10:30 ", explanation: "Last modified date and time" },
        { text: "src", explanation: "Directory name" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  1.0K Jun 01 10:25 file.txt",
      segments: [
        { text: "-", explanation: "Indicates a regular file" },
        { text: "rw-r--r--", explanation: "Owner has read/write, group and others have read-only permissions" },
        { text: "  1 ", explanation: "Number of hard links" },
        { text: "user group  ", explanation: "Owner and group" },
        { text: "1.0K ", explanation: "File size in human-readable format (1 KB)" },
        { text: "Jun 01 10:25 ", explanation: "Last modified date and time" },
        { text: "file.txt", explanation: "File name" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  2.0K Jun 01 10:26 README.md",
      segments: [
        { text: "-rw-r--r--  1 user group  2.0K Jun 01 10:26 README.md", explanation: "Regular text file with human-readable size" }
      ]
    }
  ],
  "-lah": [
    {
      line: "total 48K",
      segments: [
        { text: "total 48K", explanation: "Total file blocks in human-readable format, including hidden files" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4.0K Jun 01 10:30 .",
      segments: [
        { text: "drwxr-xr-x  5 user group  4.0K Jun 01 10:30 ", explanation: "Directory metadata with human-readable size" },
        { text: ".", explanation: "The current directory" }
      ]
    },
    {
      line: "drwxr-xr-x  3 user group  4.0K Jun 01 10:00 ..",
      segments: [
        { text: "drwxr-xr-x  3 user group  4.0K Jun 01 10:00 ", explanation: "Directory metadata with human-readable size" },
        { text: "..", explanation: "The parent directory" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group   220 Jun 01 10:05 .bashrc",
      segments: [
        { text: "-rw-r--r--  1 user group   220 Jun 01 10:05 ", explanation: "File metadata" },
        { text: ".bashrc", explanation: "Hidden shell configuration file" }
      ]
    },
    {
      line: "drwx------  2 user group  4.0K Jun 01 10:05 .ssh",
      segments: [
        { text: "drwx------  2 user group  4.0K Jun 01 10:05 ", explanation: "Directory metadata with human-readable size" },
        { text: ".ssh", explanation: "Hidden folder" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group    65 Jun 01 10:05 .gitconfig",
      segments: [
        { text: "-rw-r--r--  1 user group    65 Jun 01 10:05 ", explanation: "File metadata" },
        { text: ".gitconfig", explanation: "Hidden Git configuration file" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4.0K Jun 01 10:30 src",
      segments: [
        { text: "drwxr-xr-x  5 user group  4.0K Jun 01 10:30 src", explanation: "Visible directory" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  1.0K Jun 01 10:25 file.txt",
      segments: [
        { text: "-rw-r--r--  1 user group  1.0K Jun 01 10:25 file.txt", explanation: "Visible regular file" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  2.0K Jun 01 10:26 README.md",
      segments: [
        { text: "-rw-r--r--  1 user group  2.0K Jun 01 10:26 README.md", explanation: "Visible regular file" }
      ]
    }
  ],
  "-la": [
    {
      line: "total 48",
      segments: [
        { text: "total 48", explanation: "Total file blocks, higher than without -a because hidden files are included" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 .",
      segments: [
        { text: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 ", explanation: "Directory metadata" },
        { text: ".", explanation: "The current directory" }
      ]
    },
    {
      line: "drwxr-xr-x  3 user group  4096 Jun 01 10:00 ..",
      segments: [
        { text: "drwxr-xr-x  3 user group  4096 Jun 01 10:00 ", explanation: "Directory metadata" },
        { text: "..", explanation: "The parent directory" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group   220 Jun 01 10:05 .bashrc",
      segments: [
        { text: "-rw-r--r--  1 user group   220 Jun 01 10:05 ", explanation: "File metadata" },
        { text: ".bashrc", explanation: "Hidden shell configuration file (starts with a dot)" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group    65 Jun 01 10:05 .gitconfig",
      segments: [
        { text: "-rw-r--r--  1 user group    65 Jun 01 10:05 ", explanation: "File metadata" },
        { text: ".gitconfig", explanation: "Hidden Git configuration file" }
      ]
    },
    {
      line: "drwx------  2 user group  4096 Jun 01 10:05 .ssh",
      segments: [
        { text: "drwx------", explanation: "Directory with restrictive permissions (only owner can read/write/execute)" },
        { text: "  2 user group  4096 Jun 01 10:05 ", explanation: "Directory metadata" },
        { text: ".ssh", explanation: "Hidden folder for SSH keys" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src",
      segments: [
        { text: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src", explanation: "Visible directory" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt",
      segments: [
        { text: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt", explanation: "Visible regular file" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md",
      segments: [
        { text: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md", explanation: "Visible regular file" }
      ]
    }
  ],
  "-lt": [
    {
      line: "total 32",
      segments: [
        { text: "total 32", explanation: "Total number of file system blocks used by the listed files" }
      ]
    },
    {
      line: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src",
      segments: [
        { text: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src", explanation: "Most recently modified item, sorted by modification time, newest first" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md",
      segments: [
        { text: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md", explanation: "Second most recently modified file" }
      ]
    },
    {
      line: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt",
      segments: [
        { text: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt", explanation: "Oldest modified file in the directory" }
      ]
    }
  ],
  "-li": [
    {
      line: "total 32",
      segments: [
        { text: "total 32", explanation: "Total number of file system blocks" }
      ]
    },
    {
      line: "1234567 drwxr-xr-x  5 user group  4096 Jun 01 10:30 src",
      segments: [
        { text: "1234567 ", explanation: "Inode number uniquely identifying the file in the filesystem" },
        { text: "drwxr-xr-x  5 user group  4096 Jun 01 10:30 src", explanation: "Standard long format details" }
      ]
    },
    {
      line: "1234568 -rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt",
      segments: [
        { text: "1234568 ", explanation: "Inode number" },
        { text: "-rw-r--r--  1 user group  1024 Jun 01 10:25 file.txt", explanation: "Standard long format details" }
      ]
    },
    {
      line: "1234569 -rw-r--r--  1 user group  2048 Jun 01 10:26 README.md",
      segments: [
        { text: "1234569 ", explanation: "Inode number" },
        { text: "-rw-r--r--  1 user group  2048 Jun 01 10:26 README.md", explanation: "Standard long format details" }
      ]
    }
  ],
  "-R": [
    {
      line: ".:",
      segments: [
        { text: ".:", explanation: "Listing contents of the current directory" }
      ]
    },
    {
      line: "src  file.txt  README.md",
      segments: [
        { text: "src  file.txt  README.md", explanation: "Items in the current directory" }
      ]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "./src:",
      segments: [
        { text: "./src:", explanation: "Listing contents of the 'src' subdirectory" }
      ]
    },
    {
      line: "utils  components  index.js",
      segments: [
        { text: "utils  components  index.js", explanation: "Items inside the 'src' folder" }
      ]
    },
    {
      line: " ",
      segments: [{ text: " ", explanation: "Separator" }]
    },
    {
      line: "./src/utils:",
      segments: [
        { text: "./src/utils:", explanation: "Listing contents of the deeply nested 'utils' subdirectory" }
      ]
    },
    {
      line: "helpers.js",
      segments: [
        { text: "helpers.js", explanation: "File inside 'src/utils'" }
      ]
    }
  ]
};