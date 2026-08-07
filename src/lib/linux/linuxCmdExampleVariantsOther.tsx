import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const dfVariants: Record<string, ExampleOutputLine[]> = {
  "-h": [
    {
      line: "Filesystem      Size  Used Avail Use% Mounted on",
      segments: [
        { text: "Filesystem      ", explanation: "Storage device, partition, or virtual filesystem" },
        { text: "Size  ", explanation: "Total capacity" },
        { text: "Used ", explanation: "Space currently occupied" },
        { text: "Avail ", explanation: "Free space available for normal users (often 5% is reserved for root)" },
        { text: "Use% ", explanation: "Percentage of space utilized" },
        { text: "Mounted on", explanation: "Directory where this filesystem is attached in the tree" }
      ]
    },
    {
      line: "/dev/sda1        50G   25G   23G  53% /",
      segments: [
        { text: "/dev/sda1        ", explanation: "First partition on the first SCSI/SATA drive" },
        { text: "50G   25G   23G  53% ", explanation: "Usage metrics. Note that 25+23=48G; the missing 2G is reserved for root." },
        { text: "/", explanation: "The root filesystem" }
      ]
    },
    {
      line: "/dev/sda2       200G  120G   70G  64% /home",
      segments: [
        { text: "/dev/sda2       200G  120G   70G  64% /home", explanation: "Dedicated partition for user home directories" }
      ]
    },
    {
      line: "tmpfs           7.8G     0  7.8G   0% /dev/shm",
      segments: [
        { text: "tmpfs           ", explanation: "Temporary filesystem that resides in RAM, not on disk" },
        { text: "7.8G     0  7.8G   0% ", explanation: "Allocated up to 7.8G of RAM, but currently empty" },
        { text: "/dev/shm", explanation: "Shared memory area used by programs for fast IPC" }
      ]
    },
    {
      line: "/dev/sdb1       500G  300G  175G  64% /data",
      segments: [
        { text: "/dev/sdb1       500G  300G  175G  64% /data", explanation: "Secondary drive mounted at /data" }
      ]
    },
    {
      line: "overlay          50G   25G   23G  53% /var/lib/docker/overlay2/...",
      segments: [
        { text: "overlay          ", explanation: "Union filesystem used by Docker to layer container images" },
        { text: "50G   25G   23G  53% /var/lib/docker/overlay2/...", explanation: "Reflects the underlying partition's space (/) where Docker data is stored" }
      ]
    }
  ]
};

export const duVariants: Record<string, ExampleOutputLine[]> = {
  "-h": [
    {
      line: "4.0K	./src/utils/helpers.js",
      segments: [
        { text: "4.0K	", explanation: "Disk usage in human-readable format (Kilobytes)" },
        { text: "./src/utils/helpers.js", explanation: "Specific file" }
      ]
    },
    {
      line: "8.0K	./src/utils",
      segments: [
        { text: "8.0K	", explanation: "Cumulative disk usage for this directory and all contents inside it" },
        { text: "./src/utils", explanation: "Directory path" }
      ]
    },
    {
      line: "1.2M	./src/components",
      segments: [{ text: "1.2M	./src/components", explanation: "1.2 Megabytes for the components folder" }]
    },
    {
      line: "2.4M	./src",
      segments: [{ text: "2.4M	./src", explanation: "Total for the entire src folder" }]
    },
    {
      line: "12M	./node_modules/react",
      segments: [{ text: "12M	./node_modules/react", explanation: "Usage for a specific library" }]
    },
    {
      line: "250M	./node_modules",
      segments: [{ text: "250M	./node_modules", explanation: "Total usage for all installed dependencies" }]
    },
    {
      line: "15M	./public",
      segments: [{ text: "15M	./public", explanation: "Static assets folder" }]
    },
    {
      line: "270M	.",
      segments: [
        { text: "270M	", explanation: "Grand total for the current working directory" },
        { text: ".", explanation: "Current directory indicator" }
      ]
    }
  ],
  "-sh": [
    {
      line: "270M	.",
      segments: [
        { text: "270M	", explanation: "Summary grand total size in human-readable format" },
        { text: ".", explanation: "The target directory (current directory)" }
      ]
    }
  ]
};

export const freeVariants: Record<string, ExampleOutputLine[]> = {
  "-h": [
    {
      line: "               total        used        free      shared  buff/cache   available",
      segments: [
        { text: "               total        used        free      shared  buff/cache   available", explanation: "Standard memory column headers" }
      ]
    },
    {
      line: "Mem:            15Gi       4.5Gi       1.2Gi       450Mi       9.8Gi        10Gi",
      segments: [
        { text: "Mem:            ", explanation: "Physical RAM" },
        { text: "15Gi       ", explanation: "Total installed memory (~16GB minus hardware reserved)" },
        { text: "4.5Gi       ", explanation: "Memory actively used by processes" },
        { text: "1.2Gi       ", explanation: "Memory completely unused (it's normal for this to be low on Linux)" },
        { text: "450Mi       ", explanation: "Memory consumed by tmpfs and shared memory segments" },
        { text: "9.8Gi        ", explanation: "Memory used by the kernel to cache disk files for performance" },
        { text: "10Gi", explanation: "Estimate of how much RAM is available for starting new applications (free + reclaimable cache)" }
      ]
    },
    {
      line: "Swap:          2.0Gi          0B       2.0Gi",
      segments: [
        { text: "Swap:          ", explanation: "Virtual memory on disk" },
        { text: "2.0Gi          0B       2.0Gi", explanation: "Total, used, and free swap. 0B used means the system has enough RAM and hasn't swapped out pages." }
      ]
    }
  ],
  "-m": [
    {
      line: "               total        used        free      shared  buff/cache   available",
      segments: [
        { text: "               total        used        free      shared  buff/cache   available", explanation: "Standard memory column headers" }
      ]
    },
    {
      line: "Mem:           15876        4608        1228         450       10040       10240",
      segments: [
        { text: "Mem:           ", explanation: "Physical RAM" },
        { text: "15876        4608        1228         450       10040       10240", explanation: "Memory statistics formatted strictly in Mebibytes (MiB)" }
      ]
    },
    {
      line: "Swap:           2048           0        2048",
      segments: [
        { text: "Swap:           ", explanation: "Virtual memory on disk" },
        { text: "2048           0        2048", explanation: "Swap usage in MiB" }
      ]
    }
  ]
};

export const grepVariants: Record<string, ExampleOutputLine[]> = {
  "-rn": [
    {
      line: "src/main.js:12: console.log('error occurred');",
      segments: [
        { text: "src/main.js", explanation: "The file where the match was found" },
        { text: ":", explanation: "Separator" },
        { text: "12", explanation: "The exact line number containing the match" },
        { text: ": ", explanation: "Separator" },
        { text: "console.log('error occurred');", explanation: "The content of the matching line" }
      ]
    },
    {
      line: "src/utils/helpers.js:45: throw new Error('error occurred');",
      segments: [
        { text: "src/utils/helpers.js", explanation: "Another file containing the match" },
        { text: ":", explanation: "Separator" },
        { text: "45", explanation: "Line number of the match" },
        { text: ": ", explanation: "Separator" },
        { text: "throw new Error('error occurred');", explanation: "Matching line content" }
      ]
    }
  ],
  "-c": [
    {
      line: "src/main.js:3",
      segments: [
        { text: "src/main.js", explanation: "The file name" },
        { text: ":", explanation: "Separator" },
        { text: "3", explanation: "Total count of matching lines in this file" }
      ]
    },
    {
      line: "src/utils/helpers.js:1",
      segments: [
        { text: "src/utils/helpers.js", explanation: "The file name" },
        { text: ":", explanation: "Separator" },
        { text: "1", explanation: "Total count of matching lines in this file" }
      ]
    },
    {
      line: "README.md:0",
      segments: [
        { text: "README.md", explanation: "The file name" },
        { text: ":", explanation: "Separator" },
        { text: "0", explanation: "Zero matches found in this file" }
      ]
    }
  ]
};

export const lsblkVariants: Record<string, ExampleOutputLine[]> = {
  "-f": [
    {
      line: "NAME        FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS",
      segments: [
        { text: "NAME        ", explanation: "Block device name" },
        { text: "FSTYPE ", explanation: "Filesystem type" },
        { text: "FSVER ", explanation: "Filesystem version" },
        { text: "LABEL ", explanation: "Volume label" },
        { text: "UUID                                 ", explanation: "Universally Unique Identifier for the filesystem" },
        { text: "FSAVAIL ", explanation: "Available free space" },
        { text: "FSUSE% ", explanation: "Percentage of space used" },
        { text: "MOUNTPOINTS", explanation: "Where the device is mounted in the directory tree" }
      ]
    },
    {
      line: "sda                                                                                ",
      segments: [
        { text: "sda                                                                                ", explanation: "Main hard drive block device" }
      ]
    },
    {
      line: "├─sda1      vfat   FAT32       A1B2-C3D4                             500M     2% /boot/efi",
      segments: [
        { text: "├─sda1      ", explanation: "Partition 1" },
        { text: "vfat   FAT32       ", explanation: "EFI System partition formatted as FAT32" },
        { text: "A1B2-C3D4                             ", explanation: "Filesystem UUID" },
        { text: "500M     2% /boot/efi", explanation: "Usage metrics and mount point" }
      ]
    },
    {
      line: "├─sda2      ext4   1.0         f4a3b2c1-d5e6-f7a8-b9c0-d1e2f3a4b5c6   23G    53% /",
      segments: [
        { text: "├─sda2      ", explanation: "Partition 2" },
        { text: "ext4   1.0         ", explanation: "Standard Linux ext4 filesystem" },
        { text: "f4a3b2c1-d5e6-f7a8-b9c0-d1e2f3a4b5c6   ", explanation: "Filesystem UUID" },
        { text: "23G    53% /", explanation: "Usage metrics for the root filesystem" }
      ]
    },
    {
      line: "├─sda3      ext4   1.0         1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d   70G    64% /home",
      segments: [
        { text: "├─sda3      ext4   1.0         1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d   70G    64% /home", explanation: "Ext4 partition used for user home directories" }
      ]
    },
    {
      line: "└─sda4      swap   1           d6c5b4a3-f2e1-d0c9-b8a7-f6e5d4c3b2a1                [SWAP]",
      segments: [
        { text: "└─sda4      ", explanation: "Partition 4" },
        { text: "swap   1           ", explanation: "Virtual memory swap space" },
        { text: "d6c5b4a3-f2e1-d0c9-b8a7-f6e5d4c3b2a1                ", explanation: "Filesystem UUID" },
        { text: "[SWAP]", explanation: "Actively used as system swap" }
      ]
    },
    {
      line: "nvme0n1                                                                            ",
      segments: [
        { text: "nvme0n1                                                                            ", explanation: "Secondary high-speed NVMe drive" }
      ]
    },
    {
      line: "└─nvme0n1p1 xfs                99887766-5544-3322-1100-ffeeddccbbaa  800G    20% /data",
      segments: [
        { text: "└─nvme0n1p1 ", explanation: "Partition 1 on NVMe drive" },
        { text: "xfs                ", explanation: "High performance XFS filesystem" },
        { text: "99887766-5544-3322-1100-ffeeddccbbaa  ", explanation: "Filesystem UUID" },
        { text: "800G    20% /data", explanation: "Usage metrics mounted at /data" }
      ]
    }
  ]
};