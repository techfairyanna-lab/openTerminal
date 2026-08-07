import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs5: Record<string, ExampleOutputLine[]> = {
  // ---------------------------------------------------------------------------
  // ARCHIVE / COMPRESSION (Network/Transfer)
  // ---------------------------------------------------------------------------
  gzip: [
    {
      line: "file.txt:\t 65.0% -- replaced with file.txt.gz",
      segments: [
        { text: "file.txt:\t ", explanation: "The original file being compressed" },
        { text: "65.0% ", explanation: "The compression ratio achieved" },
        { text: "-- replaced with file.txt.gz", explanation: "Confirmation that the original file was replaced by the compressed version" }
      ]
    }
  ],
  gunzip: [
    {
      line: "(no output on success - decompresses the file silently)",
      segments: [
        { text: "(no output on success - decompresses the file silently)", explanation: "Standard behavior for successful decompression; the .gz file is replaced by the original file" }
      ]
    }
  ],
  bzip2: [
    {
      line: "  file.txt:  5.000:1,  1.600 bits/byte, 80.00% saved, 10240 in, 2048 out.",
      segments: [
        { text: "  file.txt:  ", explanation: "The file being processed" },
        { text: "5.000:1,  ", explanation: "Compression ratio" },
        { text: "1.600 bits/byte, ", explanation: "Average bits per byte in the compressed file" },
        { text: "80.00% saved", explanation: "Percentage of space saved by compressing the file" },
        { text: ", 10240 in, 2048 out.", explanation: "Exact bytes in and bytes out" }
      ]
    }
  ],
  zip: [
    {
      line: "  adding: file.txt (deflated 65%)",
      segments: [
        { text: "  adding: ", explanation: "Action being performed" },
        { text: "file.txt ", explanation: "The file being added to the zip archive" },
        { text: "(deflated 65%)", explanation: "The compression method used and amount of space saved" }
      ]
    },
    {
      line: "  adding: src/ (stored 0%)",
      segments: [
        { text: "  adding: ", explanation: "Action being performed" },
        { text: "src/ ", explanation: "A directory being added to the zip archive" },
        { text: "(stored 0%)", explanation: "Directories are just stored without compression" }
      ]
    }
  ],
  unzip: [
    {
      line: "Archive:  archive.zip",
      segments: [
        { text: "Archive:  ", explanation: "Indicates the target zip file" },
        { text: "archive.zip", explanation: "The name of the archive being extracted" }
      ]
    },
    {
      line: "  inflating: file.txt",
      segments: [
        { text: "  inflating: ", explanation: "The action of decompressing and extracting a file" },
        { text: "file.txt", explanation: "The extracted file" }
      ]
    },
    {
      line: "  inflating: src/index.js",
      segments: [
        { text: "  inflating: ", explanation: "The action of decompressing and extracting a file" },
        { text: "src/index.js", explanation: "A file extracted within a directory structure" }
      ]
    }
  ],
  cpio: [
    {
      line: "file.txt",
      segments: [
        { text: "file.txt", explanation: "A file being processed or extracted from the archive" }
      ]
    },
    {
      line: "src/index.js",
      segments: [
        { text: "src/index.js", explanation: "Another file being processed" }
      ]
    },
    {
      line: "2 blocks",
      segments: [
        { text: "2 blocks", explanation: "Summary indicating the total size of the archive in 512-byte blocks" }
      ]
    }
  ],
  
  // ---------------------------------------------------------------------------
  // NETWORK / FILE TRANSFER
  // ---------------------------------------------------------------------------
  rsync: [
    {
      line: "sending incremental file list",
      segments: [
        { text: "sending incremental file list", explanation: "Initial phase where rsync determines which files need updating" }
      ]
    },
    {
      line: "src/",
      segments: [
        { text: "src/", explanation: "A directory being synchronized" }
      ]
    },
    {
      line: "src/index.js",
      segments: [
        { text: "src/index.js", explanation: "A specific file being transferred because it changed" }
      ]
    },
    {
      line: "sent 1,234 bytes  received 35 bytes  2,538.00 bytes/sec",
      segments: [
        { text: "sent 1,234 bytes  ", explanation: "Total data sent to the remote destination" },
        { text: "received 35 bytes  ", explanation: "Data received back (usually protocol overhead/acknowledgments)" },
        { text: "2,538.00 bytes/sec", explanation: "The average transfer speed" }
      ]
    },
    {
      line: "total size is 10,240  speedup is 8.07",
      segments: [
        { text: "total size is 10,240  ", explanation: "Total size of all files in the sync scope" },
        { text: "speedup is 8.07", explanation: "Efficiency gain compared to transferring all files from scratch" }
      ]
    }
  ],
  ftp: [
    {
      line: "Connected to ftp.example.com.",
      segments: [
        { text: "Connected to ", explanation: "Connection status" },
        { text: "ftp.example.com.", explanation: "The target FTP server host" }
      ]
    },
    {
      line: "220 Welcome to FTP server.",
      segments: [
        { text: "220 ", explanation: "FTP status code indicating service is ready for new user" },
        { text: "Welcome to FTP server.", explanation: "The server's greeting message" }
      ]
    },
    {
      line: "Name (ftp.example.com:user): ",
      segments: [
        { text: "Name ", explanation: "Prompt for the username" },
        { text: "(ftp.example.com:user): ", explanation: "The default user to attempt login with if left blank" }
      ]
    }
  ],
  wget: [
    {
      line: "Resolving example.com... 93.184.216.34",
      segments: [
        { text: "Resolving example.com... ", explanation: "Looking up the IP address for the domain name via DNS" },
        { text: "93.184.216.34", explanation: "The resolved IP address" }
      ]
    },
    {
      line: "Connecting to example.com... connected.",
      segments: [
        { text: "Connecting to example.com... ", explanation: "Attempting to establish a TCP connection" },
        { text: "connected.", explanation: "Connection was successful" }
      ]
    },
    {
      line: "HTTP request sent, awaiting response... 200 OK",
      segments: [
        { text: "HTTP request sent, awaiting response... ", explanation: "Requesting the file from the web server" },
        { text: "200 OK", explanation: "The server responded indicating success" }
      ]
    },
    {
      line: "Length: 1256 (1.2K) [text/html]",
      segments: [
        { text: "Length: 1256 (1.2K) ", explanation: "The size of the file being downloaded" },
        { text: "[text/html]", explanation: "The MIME type of the file" }
      ]
    },
    {
      line: "Saving to: 'index.html'",
      segments: [
        { text: "Saving to: ", explanation: "Action being performed" },
        { text: "'index.html'", explanation: "The local filename where the download will be stored" }
      ]
    },
    {
      line: "index.html         100%[===================>]   1.23K  --.-KB/s    in 0s",
      segments: [
        { text: "index.html         ", explanation: "The file being downloaded" },
        { text: "100%", explanation: "Progress percentage" },
        { text: "[===================>]   ", explanation: "Visual progress bar" },
        { text: "1.23K  --.-KB/s    in 0s", explanation: "Final downloaded size, speed, and time taken" }
      ]
    }
  ],
  telnet: [
    {
      line: "Trying 192.168.1.1...",
      segments: [
        { text: "Trying 192.168.1.1...", explanation: "Attempting to establish a connection to the IP address" }
      ]
    },
    {
      line: "Connected to 192.168.1.1.",
      segments: [
        { text: "Connected to 192.168.1.1.", explanation: "The connection has been successfully established" }
      ]
    },
    {
      line: "Escape character is '^]'.",
      segments: [
        { text: "Escape character is ", explanation: "Info about how to break out of the telnet session" },
        { text: "'^]'.", explanation: "The key combination (Ctrl + ]) to drop back to the telnet prompt" }
      ]
    }
  ],
  scp: [
    {
      line: "file.txt                                      100% 1024     1.0KB/s   00:01",
      segments: [
        { text: "file.txt                                      ", explanation: "The file being transferred" },
        { text: "100% ", explanation: "Transfer progress" },
        { text: "1024     ", explanation: "Total bytes transferred" },
        { text: "1.0KB/s   ", explanation: "Transfer speed" },
        { text: "00:01", explanation: "Time elapsed" }
      ]
    }
  ],
  sftp: [
    {
      line: "Connected to user@hostname.",
      segments: [
        { text: "Connected to ", explanation: "Connection status" },
        { text: "user@hostname.", explanation: "The remote target for the secure file transfer session" }
      ]
    },
    {
      line: "sftp> ",
      segments: [
        { text: "sftp> ", explanation: "The interactive prompt waiting for SFTP commands (like get, put, ls)" }
      ]
    }
  ],
  lftp: [
    {
      line: "lftp user@ftp.example.com:~> ",
      segments: [
        { text: "lftp ", explanation: "The program name" },
        { text: "user@ftp.example.com", explanation: "The connection endpoint" },
        { text: ":~> ", explanation: "The prompt indicating you are in the remote home directory" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // PACKAGE MANAGEMENT
  // ---------------------------------------------------------------------------
  rpm: [
    {
      line: "Name        : httpd",
      segments: [
        { text: "Name        : ", explanation: "Field label" },
        { text: "httpd", explanation: "The name of the package (Apache HTTP Server)" }
      ]
    },
    {
      line: "Version     : 2.4.54",
      segments: [
        { text: "Version     : ", explanation: "Field label" },
        { text: "2.4.54", explanation: "The version of the package installed or queried" }
      ]
    },
    {
      line: "Release     : 1.el8",
      segments: [
        { text: "Release     : ", explanation: "Field label" },
        { text: "1.el8", explanation: "The specific release build, usually indicating the target OS (Enterprise Linux 8)" }
      ]
    },
    {
      line: "Architecture: x86_64",
      segments: [
        { text: "Architecture: ", explanation: "Field label" },
        { text: "x86_64", explanation: "The CPU architecture the package was built for (64-bit)" }
      ]
    },
    {
      line: "Size        : 4.5M",
      segments: [
        { text: "Size        : ", explanation: "Field label" },
        { text: "4.5M", explanation: "The installed size of the package" }
      ]
    }
  ],
  yum: [
    {
      line: "Loaded plugins: fastestmirror",
      segments: [
        { text: "Loaded plugins: ", explanation: "Information about extensions loaded" },
        { text: "fastestmirror", explanation: "A plugin that tests repository speeds to use the fastest one" }
      ]
    },
    {
      line: "Determining fastest mirrors",
      segments: [
        { text: "Determining fastest mirrors", explanation: "The process of pinging repository servers" }
      ]
    },
    {
      line: "... Complete!",
      segments: [
        { text: "... Complete!", explanation: "Indicates the operation finished and yum is proceeding with package tasks" }
      ]
    }
  ],
  dnf: [
    {
      line: "Last metadata expiration check: 0:45:12 ago on Thu Oct 12 10:00:00 2023.",
      segments: [
        { text: "Last metadata expiration check: ", explanation: "When DNF last downloaded repository index files" },
        { text: "0:45:12 ago ", explanation: "Time elapsed since the check" },
        { text: "on Thu Oct 12 10:00:00 2023.", explanation: "Timestamp of the last check" }
      ]
    },
    {
      line: "Dependencies resolved.",
      segments: [
        { text: "Dependencies resolved.", explanation: "DNF has figured out what additional packages are needed to fulfill the request" }
      ]
    },
    {
      line: "================================================================================",
      segments: [
        { text: "================================================================================", explanation: "Separator line before printing the package installation summary table" }
      ]
    }
  ],
  "apt-get": [
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
        { text: "The following NEW packages will be installed:", explanation: "Summary header before executing the installation" }
      ]
    },
    {
      line: "  htop",
      segments: [
        { text: "  htop", explanation: "The specific package that will be installed" }
      ]
    }
  ],
  dpkg: [
    {
      line: "ii  htop           3.0.5-1      x86_64       interactive processes viewer",
      segments: [
        { text: "ii  ", explanation: "Status indicator: 'i' for desired (install), 'i' for status (installed)" },
        { text: "htop           ", explanation: "Package name" },
        { text: "3.0.5-1      ", explanation: "Installed version" },
        { text: "x86_64       ", explanation: "Architecture" },
        { text: "interactive processes viewer", explanation: "Short description of the package" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // SCHEDULING / CRON
  // ---------------------------------------------------------------------------
  crontab: [
    {
      line: "# m h  dom mon dow   command",
      segments: [
        { text: "# m h  dom mon dow   command", explanation: "Comment line showing the standard cron format (minute, hour, day of month, month, day of week, command)" }
      ]
    },
    {
      line: "*/5 * * * * /usr/local/bin/backup.sh",
      segments: [
        { text: "*/5 * * * * ", explanation: "Cron schedule expression meaning 'every 5 minutes'" },
        { text: "/usr/local/bin/backup.sh", explanation: "The script that will be executed at that interval" }
      ]
    },
    {
      line: "0 2 * * 0 /usr/local/bin/weekly-report.sh",
      segments: [
        { text: "0 2 * * 0 ", explanation: "Cron schedule expression meaning 'at 2:00 AM every Sunday'" },
        { text: "/usr/local/bin/weekly-report.sh", explanation: "The script being executed" }
      ]
    }
  ],
  at: [
    {
      line: "warning: commands will be executed using /bin/sh",
      segments: [
        { text: "warning: commands will be executed using /bin/sh", explanation: "Notice informing you which shell will run your scheduled commands" }
      ]
    },
    {
      line: "job 3 at Thu Oct 12 15:00:00 2023",
      segments: [
        { text: "job 3 ", explanation: "The internal ID assigned to this scheduled task" },
        { text: "at Thu Oct 12 15:00:00 2023", explanation: "The specific time when the job will be executed once" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // EDITORS
  // ---------------------------------------------------------------------------
  vi: [
    {
      line: "~",
      segments: [
        { text: "~", explanation: "Indicates a line past the end of the file (an empty line)" }
      ]
    },
    {
      line: "~",
      segments: [
        { text: "~", explanation: "Indicates a line past the end of the file" }
      ]
    },
    {
      line: "\"file.txt\" [New File]",
      segments: [
        { text: "\"file.txt\" [New File]", explanation: "The status bar at the bottom showing the file name and indicating it does not exist yet on disk" }
      ]
    }
  ],
  vim: [
    {
      line: "~",
      segments: [
        { text: "~", explanation: "Indicates a line past the end of the file (an empty line)" }
      ]
    },
    {
      line: "~",
      segments: [
        { text: "~", explanation: "Indicates a line past the end of the file" }
      ]
    },
    {
      line: "\"file.txt\" [New File]",
      segments: [
        { text: "\"file.txt\" [New File]", explanation: "The status bar at the bottom showing the file name and indicating it does not exist yet on disk" }
      ]
    }
  ],
  emacs: [
    {
      line: "Welcome to GNU Emacs, one component of the GNU/Linux operating system.",
      segments: [
        { text: "Welcome to GNU Emacs, one component of the GNU/Linux operating system.", explanation: "The default splash screen text displayed in the scratch buffer when starting emacs without a file" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // DEVELOPMENT
  // ---------------------------------------------------------------------------
  make: [
    {
      line: "gcc -c -o main.o main.c",
      segments: [
        { text: "gcc -c -o main.o main.c", explanation: "The first command executed by make, compiling a C file into an object file" }
      ]
    },
    {
      line: "gcc -o myapp main.o utils.o",
      segments: [
        { text: "gcc -o myapp main.o utils.o", explanation: "The final linking command executed by make to build the executable" }
      ]
    }
  ],
  gcc: [
    {
      line: "main.c:5:3: warning: implicit declaration of function 'printf'",
      segments: [
        { text: "main.c:5:3: ", explanation: "File name, line 5, column 3" },
        { text: "warning: ", explanation: "Diagnostic level indicating a potential issue that doesn't stop compilation" },
        { text: "implicit declaration of function 'printf'", explanation: "The specific issue (usually missing an include for stdio.h)" }
      ]
    }
  ],
  dump: [
    {
      line: "  DUMP: Date of this level 0 dump: Thu Oct 12 15:00:00 2023",
      segments: [
        { text: "  DUMP: ", explanation: "Program log prefix" },
        { text: "Date of this level 0 dump: Thu Oct 12 15:00:00 2023", explanation: "Indicates this is a full backup (level 0) and when it started" }
      ]
    },
    {
      line: "  DUMP: Dumping /dev/sda2 to /backup/sda2.dump",
      segments: [
        { text: "  DUMP: Dumping ", explanation: "Action being performed" },
        { text: "/dev/sda2 ", explanation: "The source filesystem or partition" },
        { text: "to /backup/sda2.dump", explanation: "The destination backup file" }
      ]
    },
    {
      line: "  DUMP: DUMP IS DONE",
      segments: [
        { text: "  DUMP: DUMP IS DONE", explanation: "Success message indicating the backup completed" }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // PRINTING
  // ---------------------------------------------------------------------------
  lp: [
    {
      line: "request id is printer-123 (1 file(s))",
      segments: [
        { text: "request id is printer-123 ", explanation: "The unique tracking ID assigned to this print job" },
        { text: "(1 file(s))", explanation: "The number of files sent to the printer" }
      ]
    }
  ],
  lpr: [
    {
      line: "(no output - job sent to print queue silently)",
      segments: [
        { text: "(no output - job sent to print queue silently)", explanation: "Standard behavior for successful submission to the print daemon" }
      ]
    }
  ]
};