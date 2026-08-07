import { CommandDef } from "./CommandDef";

export const linuxCmdsSearching: CommandDef[] = [
  {
    name: "ag",
    description: "The Silver Searcher. A code-searching tool similar to ack, but faster.",
    useCases: ["Quickly find a string across an entire codebase", "Search while respecting .gitignore rules"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" },
      "-l": { description: "Only print filenames that contain matches" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rg", "ack", "grep"],
    category: "searching"
  },
  {
    name: "rg",
    description: "ripgrep is a line-oriented search tool that recursively searches directories for a regex pattern.",
    useCases: ["Blazingly fast text search in huge directories", "Search code while respecting gitignores"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Case insensitive search" },
      "-w": { description: "Search for whole words only" },
      "--hidden": { description: "Search hidden files and directories" },
      "-n": { description: "Show line numbers (enabled by default when output goes to terminal)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ag", "grep", "fd"],
    category: "searching"
  },
  {
    name: "fd",
    description: "A simple, fast and user-friendly alternative to find.",
    useCases: ["Find files by name quickly using regex or glob", "Execute a command on all matched files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-e": { description: "Filter by file extension" },
      "-t": { description: "Filter by file type (e.g., f for file, d for directory)" },
      "-H": { description: "Include hidden files and directories" }
    },
    exampleOutputLines: [],
    relatedCommands: ["find", "rg"],
    category: "searching"
  },
  {
    name: "fzf",
    description: "A general-purpose command-line fuzzy finder.",
    useCases: ["Interactively search for files or command history in the terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-m": { description: "Enable multi-select" },
      "--preview": { description: "Show a preview window for the matched item" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fd", "rg"],
    category: "searching"
  },
  {
    name: "ack",
    description: "A tool like grep, optimized for programmers.",
    useCases: ["Search source code specifically, automatically skipping VCS directories"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" },
      "--type": { description: "Search only files of a specific type (e.g., --type=python)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ag", "rg", "grep"],
    category: "searching"
  },
  {
    name: "sift",
    description: "A fast and powerful open source alternative to grep.",
    useCases: ["Search for text patterns in large directories"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Show line numbers" },
      "-i": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["rg", "ag"],
    category: "searching"
  },
  {
    name: "pt",
    description: "The Platinum Searcher. A code search tool similar to ack.",
    useCases: ["Search source code concurrently for speed"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ag", "rg"],
    category: "searching"
  },
  {
    name: "mlocate",
    description: "Find files by name, using a pre-built database (more secure version of locate).",
    useCases: ["Instantly locate a file anywhere on the system without scanning the disk"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case distinctions" }
    },
    exampleOutputLines: [],
    relatedCommands: ["plocate", "find", "updatedb"],
    category: "searching"
  },
  {
    name: "plocate",
    description: "A much faster locate, based on posting lists.",
    useCases: ["Find files instantly using a highly optimized database"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["mlocate", "updatedb"],
    category: "searching"
  },
  {
    name: "zgrep",
    description: "Search possibly compressed files for a regular expression.",
    useCases: ["Search through gzip-compressed log files directly without extracting them first"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" },
      "-n": { description: "Show line number" }
    },
    exampleOutputLines: [],
    relatedCommands: ["grep", "zcat", "bzgrep"],
    category: "searching"
  },
  {
    name: "zegrep",
    description: "Search possibly compressed files for extended regular expressions.",
    useCases: ["Use extended regex to search gzip-compressed logs"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["zgrep", "egrep"],
    category: "searching"
  },
  {
    name: "zfgrep",
    description: "Search possibly compressed files for fixed strings.",
    useCases: ["Search for fixed strings (no regex) in gzip-compressed files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["zgrep", "fgrep"],
    category: "searching"
  },
  {
    name: "bzgrep",
    description: "Search possibly bzip2 compressed files for a regular expression.",
    useCases: ["Search through .bz2 compressed archives without uncompressing"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["zgrep", "xzgrep"],
    category: "searching"
  },
  {
    name: "xzgrep",
    description: "Search compressed files for a regular expression (for .xz and .lzma files).",
    useCases: ["Search through .xz compressed logs or archives"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["zgrep", "grep"],
    category: "searching"
  },
  {
    name: "cscope",
    description: "Interactively examine a C program.",
    useCases: ["Search for C symbol definitions, function calls, and references in large codebases"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-R": { description: "Recurse subdirectories" },
      "-b": { description: "Build the cross-reference only" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ctags"],
    category: "searching"
  },
  {
    name: "ctags",
    description: "Generate tag files for source code.",
    useCases: ["Index source code to enable jump-to-definition in editors like Vim"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-R": { description: "Recurse into directories" }
    },
    exampleOutputLines: [],
    relatedCommands: ["etags", "cscope"],
    category: "searching"
  },
  {
    name: "etags",
    description: "Generate tag files for Emacs.",
    useCases: ["Create a tags file for jumping to definitions in Emacs"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["ctags"],
    category: "searching"
  },
  {
    name: "global",
    description: "Print locations of given symbols (GNU GLOBAL).",
    useCases: ["Navigate large source code projects quickly"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-x": { description: "Show details" }
    },
    exampleOutputLines: [],
    relatedCommands: ["ctags", "cscope"],
    category: "searching"
  },
  {
    name: "objdump",
    description: "Display information from object files.",
    useCases: ["Disassemble a compiled binary to view its assembly code", "Search for specific machine instructions"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Disassemble executable sections" },
      "-t": { description: "Print the symbol table" }
    },
    exampleOutputLines: [],
    relatedCommands: ["readelf", "nm"],
    category: "searching"
  },
  {
    name: "readelf",
    description: "Displays information about ELF files.",
    useCases: ["Analyze the headers or sections of an ELF compiled binary"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Show all information" },
      "-s": { description: "Display the symbol table" }
    },
    exampleOutputLines: [],
    relatedCommands: ["objdump"],
    category: "searching"
  },
  {
    name: "nm",
    description: "List symbols from object files.",
    useCases: ["Find out if a specific function is defined or imported by a library binary"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-D": { description: "Display the dynamic symbols" },
      "-u": { description: "Display only undefined symbols" }
    },
    exampleOutputLines: [],
    relatedCommands: ["objdump", "readelf"],
    category: "searching"
  },
  {
    name: "ldd",
    description: "Print shared object dependencies.",
    useCases: ["Check which shared libraries a compiled program needs to run"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-v": { description: "Print all information" }
    },
    exampleOutputLines: [],
    relatedCommands: ["nm", "readelf"],
    category: "searching"
  },
  {
    name: "apropos",
    description: "Search the manual page names and descriptions.",
    useCases: ["Find a command when you only know what it does, not its name"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-e": { description: "Search each keyword for exact match" }
    },
    exampleOutputLines: [],
    relatedCommands: ["whatis", "man"],
    category: "searching"
  },
  {
    name: "whatis",
    description: "Display one-line manual page descriptions.",
    useCases: ["Quickly check what a specific command does"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["apropos", "man"],
    category: "searching"
  },
  {
    name: "pcregrep",
    description: "A grep with Perl-compatible regular expressions.",
    useCases: ["Search using advanced regex features like lookarounds that standard grep lacks"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-M": { description: "Match across multiple lines" },
      "-i": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["grep", "rg"],
    category: "searching"
  },
  {
    name: "tre-agrep",
    description: "Approximate grep (agrep). Searches for a pattern with a given number of errors.",
    useCases: ["Fuzzy search text for a word even if it is slightly misspelled"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["grep", "pcregrep"],
    category: "searching"
  },
  {
    name: "tracker",
    description: "A semantic data storage for desktop applications (Tracker).",
    useCases: ["Search documents, music, and images on a GNOME desktop system"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "search": { description: "Search for a term" }
    },
    exampleOutputLines: [],
    relatedCommands: ["recoll"],
    category: "searching"
  },
  {
    name: "recoll",
    description: "Personal full text search tool.",
    useCases: ["Index and search through a large collection of personal documents and emails"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-q": { description: "Query string" }
    },
    exampleOutputLines: [],
    relatedCommands: ["tracker", "catfish"],
    category: "searching"
  },
  {
    name: "catfish",
    description: "A versatile file searching tool for the Linux desktop.",
    useCases: ["Find files visually or from CLI using find and locate backends"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["find", "locate"],
    category: "searching"
  }
];