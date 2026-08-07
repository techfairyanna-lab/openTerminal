import { CommandDef } from "./CommandDef";

export const linuxCmdsTextProcessing: CommandDef[] = [
  {
    name: "cat",
    description: "Concatenate files and print on the standard output.",
    useCases: ["View the contents of a small file", "Combine multiple files into one"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Number all output lines" },
      "-A": { description: "Show non-printing characters, tabs, and ends of lines" }
    },
    exampleOutputLines: [],
    relatedCommands: ["less", "bat"],
    category: "text-processing"
  },
  {
    name: "less",
    description: "View file contents one screen at a time (allows backward scrolling).",
    useCases: ["Read long logs or documents without cluttering the terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-N": { description: "Show line numbers" },
      "-S": { description: "Chop long lines instead of wrapping them" }
    },
    exampleOutputLines: [],
    relatedCommands: ["more", "cat"],
    category: "text-processing"
  },
  {
    name: "more",
    description: "View file contents one screen at a time (older, forward-only).",
    useCases: ["Read text file page by page"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["less", "cat"],
    category: "text-processing"
  },
  {
    name: "head",
    description: "Output the first part of files.",
    useCases: ["Preview the first few lines of a file", "Check CSV headers"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Print specific number of lines instead of the default 10" }
    },
    exampleOutputLines: [],
    relatedCommands: ["tail", "cat"],
    category: "text-processing"
  },
  {
    name: "tail",
    description: "Output the last part of files.",
    useCases: ["Watch logs in real-time", "See the end of a long file"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Follow mode: append data as the file grows" },
      "-n": { description: "Print specific number of lines instead of the default 10" }
    },
    exampleOutputLines: [],
    relatedCommands: ["head", "less"],
    category: "text-processing"
  },
  {
    name: "grep",
    description: "Print lines that match patterns.",
    useCases: ["Search for a specific word in a file", "Filter output of other commands"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Ignore case distinctions" },
      "-r": { description: "Search directories recursively" },
      "-v": { description: "Invert match (select non-matching lines)" },
      "-n": { description: "Prefix each line of output with the line number within its input file" },
      "-E": { description: "Interpret pattern as an extended regular expression (ERE)" },
      "-P": { description: "Interpret pattern as a Perl-compatible regular expression (PCRE)" },
      "-F": { description: "Interpret pattern as a list of fixed strings (no regex), separated by newlines" },
      "-A": { description: "Print NUM lines of trailing context after matching lines" },
      "-B": { description: "Print NUM lines of leading context before matching lines" },
      "-C": { description: "Print NUM lines of output context (before and after matches)" },
      "-l": { description: "Only print the names of files containing matches, not the matches themselves" },
      "-c": { description: "Only print a count of matching lines per file" },
      "-o": { description: "Print only the matched (non-empty) parts of a matching line" }
    },
    exampleOutputLines: [],
    relatedCommands: ["egrep", "fgrep", "awk", "sed"],
    category: "text-processing"
  },
  {
    name: "egrep",
    description: "Print lines that match extended regular expressions.",
    useCases: ["Search text using complex regex syntax"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["grep"],
    category: "text-processing"
  },
  {
    name: "fgrep",
    description: "Print lines that match fixed strings (no regex).",
    useCases: ["Search for exact string matches very quickly"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["grep"],
    category: "text-processing"
  },
  {
    name: "sed",
    description: "Stream editor for filtering and transforming text.",
    useCases: ["Find and replace text in a file", "Delete specific lines based on a pattern"],
    isDangerous: false,
    dangerWarning: "Using sed -i modifies files in-place without backups by default. Be careful!",
    safeAlternatives: ["Use sed -i.bak to create backups"],
    flags: {
      "-i": { description: "Edit files in place" },
      "-e": { description: "Add script to the commands to be executed" },
      "-n": { description: "Suppress automatic printing of pattern space" }
    },
    exampleOutputLines: [],
    relatedCommands: ["awk", "grep", "tr"],
    category: "text-processing"
  },
  {
    name: "awk",
    description: "Pattern scanning and text processing language.",
    useCases: ["Extract specific columns from tabular data", "Perform mathematical operations on text data"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-F": { description: "Set the input field separator" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sed", "cut", "grep"],
    category: "text-processing"
  },
  {
    name: "cut",
    description: "Remove sections from each line of files.",
    useCases: ["Extract a specific column from a CSV", "Split text by a delimiter"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Use a specific delimiter instead of TAB" },
      "-f": { description: "Select specific fields (columns)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["awk", "sed"],
    category: "text-processing"
  },
  {
    name: "sort",
    description: "Sort lines of text files.",
    useCases: ["Alphabetize a list", "Sort numbers numerically"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Compare according to string numerical value" },
      "-r": { description: "Reverse the result of comparisons" },
      "-u": { description: "Output only the first of an equal run (unique)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["uniq", "wc"],
    category: "text-processing"
  },
  {
    name: "uniq",
    description: "Report or omit repeated lines.",
    useCases: ["Remove adjacent duplicates from a list", "Count occurrences of lines (when combined with sort)"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Prefix lines by the number of occurrences" },
      "-d": { description: "Only print duplicate lines" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sort"],
    category: "text-processing"
  },
  {
    name: "wc",
    description: "Print newline, word, and byte counts for each file.",
    useCases: ["Count lines in a file", "Count words in a document"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-l": { description: "Print the newline counts" },
      "-w": { description: "Print the word counts" },
      "-c": { description: "Print the byte counts" }
    },
    exampleOutputLines: [],
    relatedCommands: ["grep", "awk"],
    category: "text-processing"
  },
  {
    name: "diff",
    description: "Compare files line by line.",
    useCases: ["See changes between two versions of a file", "Create a patch file"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-u": { description: "Output unified diff format (used for patches)" },
      "-r": { description: "Recursively compare any subdirectories found" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cmp", "comm", "patch"],
    category: "text-processing"
  },
  {
    name: "tr",
    description: "Translate or delete characters.",
    useCases: ["Convert lowercase to uppercase", "Remove specific characters like newlines"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Delete characters in the set" },
      "-s": { description: "Squeeze repeating characters into a single character" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sed", "awk"],
    category: "text-processing"
  },
  {
    name: "tee",
    description: "Read from standard input and write to standard output and files.",
    useCases: ["Save the output of a command to a file while also watching it on screen"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Append to the given files, do not overwrite" },
      "-i": { description: "Ignore interrupt signals" }
    },
    exampleOutputLines: [],
    relatedCommands: ["cat", ">", ">>"],
    category: "text-processing"
  },
  {
    name: "echo",
    description: "Display a line of text.",
    useCases: ["Print text to the terminal", "Write a single line into a file via redirect"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-e": { description: "Enable interpretation of backslash escapes (like \\n for newline)" },
      "-n": { description: "Do not output the trailing newline" }
    },
    exampleOutputLines: [],
    relatedCommands: ["printf", "cat"],
    category: "text-processing"
  },
  {
    name: "printf",
    description: "Format and print data.",
    useCases: ["Print text with exact formatting rules", "Safely print variables in scripts"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["echo", "awk"],
    category: "text-processing"
  },
  {
    name: "paste",
    description: "Merge lines of files.",
    useCases: ["Merge two files side by side as columns"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Reuse characters from LIST instead of TABs" }
    },
    exampleOutputLines: [],
    relatedCommands: ["join", "cut"],
    category: "text-processing"
  },
  {
    name: "join",
    description: "Join lines of two files on a common field.",
    useCases: ["Act like a SQL INNER JOIN for two text files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-t": { description: "Use CHAR as input and output field separator" },
      "-a": { description: "Print unpairable lines from file FILENUM" }
    },
    exampleOutputLines: [],
    relatedCommands: ["paste", "awk"],
    category: "text-processing"
  },
  {
    name: "fold",
    description: "Wrap each input line to fit in specified width.",
    useCases: ["Break long lines to fit standard 80-column terminals"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-w": { description: "Use WIDTH columns instead of 80" },
      "-s": { description: "Break at spaces" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fmt", "pr"],
    category: "text-processing"
  },
  {
    name: "fmt",
    description: "Simple optimal text formatter.",
    useCases: ["Reformat paragraph text evenly"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-w": { description: "Maximum line width (default 75)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["fold", "pr"],
    category: "text-processing"
  },
  {
    name: "expand",
    description: "Convert tabs to spaces.",
    useCases: ["Normalize source code indentations to spaces"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-t": { description: "Have tabs NUMBER characters apart" }
    },
    exampleOutputLines: [],
    relatedCommands: ["unexpand"],
    category: "text-processing"
  },
  {
    name: "unexpand",
    description: "Convert spaces to tabs.",
    useCases: ["Convert multiple space indentations to actual tabs"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-a": { description: "Convert all blanks, instead of just initial blanks" }
    },
    exampleOutputLines: [],
    relatedCommands: ["expand"],
    category: "text-processing"
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
    category: "text-processing"
  },
  {
    name: "od",
    description: "Dump files in octal and other formats.",
    useCases: ["Examine binary files or raw character encoding"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Output as ASCII characters or backslash escapes" }
    },
    exampleOutputLines: [],
    relatedCommands: ["xxd", "hexdump"],
    category: "text-processing"
  },
  {
    name: "xxd",
    description: "Make a hexdump or do the reverse.",
    useCases: ["View raw binary data as hex", "Patch binary files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-r": { description: "Reverse operation: convert hexdump into binary" },
      "-l": { description: "Stop after writing len octets" }
    },
    exampleOutputLines: [],
    relatedCommands: ["od", "hexdump"],
    category: "text-processing"
  },
  {
    name: "strings",
    description: "Print the sequences of printable characters in files.",
    useCases: ["Extract human-readable text from binary files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-n": { description: "Locate and print any NUL-terminated sequence of at least min-len characters" }
    },
    exampleOutputLines: [],
    relatedCommands: ["hexdump"],
    category: "text-processing"
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
    category: "text-processing"
  },
  {
    name: "column",
    description: "Columnate lists.",
    useCases: ["Format CSV data into aligned columns in the terminal"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-t": { description: "Determine the number of columns the input contains and create a table" },
      "-s": { description: "Specify a set of characters to be used to delimit columns" }
    },
    exampleOutputLines: [],
    relatedCommands: ["paste", "pr"],
    category: "text-processing"
  },
  {
    name: "csplit",
    description: "Split a file into sections determined by context lines.",
    useCases: ["Split an XML or log file whenever a certain pattern matches"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["split", "awk"],
    category: "text-processing"
  },
  {
    name: "comm",
    description: "Compare two sorted files line by line.",
    useCases: ["Find common lines between two lists"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-1": { description: "Suppress column 1 (lines unique to FILE1)" },
      "-2": { description: "Suppress column 2 (lines unique to FILE2)" },
      "-3": { description: "Suppress column 3 (lines that appear in both files)" }
    },
    exampleOutputLines: [],
    relatedCommands: ["diff", "cmp"],
    category: "text-processing"
  },
  {
    name: "patch",
    description: "Apply a diff file to an original.",
    useCases: ["Apply source code updates distributed as patch files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-p": { description: "Strip the smallest prefix containing num leading slashes from each file name" }
    },
    exampleOutputLines: [],
    relatedCommands: ["diff"],
    category: "text-processing"
  },
  {
    name: "iconv",
    description: "Convert text from one character encoding to another.",
    useCases: ["Fix broken text files saved in ISO-8859-1 to UTF-8"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "From encoding" },
      "-t": { description: "To encoding" }
    },
    exampleOutputLines: [],
    relatedCommands: ["recode", "dos2unix"],
    category: "text-processing"
  },
  {
    name: "base64",
    description: "Base64 encode/decode data and print to standard output.",
    useCases: ["Encode secrets or tokens", "Decode a base64 string"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-d": { description: "Decode data" }
    },
    exampleOutputLines: [],
    relatedCommands: ["openssl", "xxd"],
    category: "text-processing"
  },
  {
    name: "md5sum",
    description: "Compute and check MD5 message digest.",
    useCases: ["Verify a downloaded file matches the author's checksum"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Read MD5 sums from the FILEs and check them" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sha256sum"],
    category: "text-processing"
  },
  {
    name: "sha256sum",
    description: "Compute and check SHA256 message digest.",
    useCases: ["Verify file integrity securely"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Read sums from the FILEs and check them" }
    },
    exampleOutputLines: [],
    relatedCommands: ["md5sum", "sha1sum"],
    category: "text-processing"
  },
  {
    name: "sha1sum",
    description: "Compute and check SHA1 message digest.",
    useCases: ["Verify file integrity using SHA-1"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Read sums from the FILEs and check them" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sha256sum"],
    category: "text-processing"
  },
  {
    name: "sha512sum",
    description: "Compute and check SHA512 message digest.",
    useCases: ["Verify file integrity using high-security SHA-512"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Read sums from the FILEs and check them" }
    },
    exampleOutputLines: [],
    relatedCommands: ["sha256sum"],
    category: "text-processing"
  },
  {
    name: "cksum",
    description: "Checksum and count the bytes in a file.",
    useCases: ["Quick CRC checksum generation"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["md5sum"],
    category: "text-processing"
  },
  {
    name: "look",
    description: "Display lines beginning with a given string.",
    useCases: ["Find words in the system dictionary that start with a prefix"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Ignore case" }
    },
    exampleOutputLines: [],
    relatedCommands: ["grep"],
    category: "text-processing"
  },
  {
    name: "spell",
    description: "A spell checker (historical).",
    useCases: ["Check text files for spelling errors"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["aspell", "hunspell"],
    category: "text-processing"
  },
  {
    name: "aspell",
    description: "Interactive spell checker.",
    useCases: ["Interactively correct typos in text files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-c": { description: "Check a file" }
    },
    exampleOutputLines: [],
    relatedCommands: ["spell"],
    category: "text-processing"
  },
  {
    name: "colrm",
    description: "Remove columns from a file.",
    useCases: ["Strip off specific character columns from each line of input"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["cut", "awk"],
    category: "text-processing"
  },
  {
    name: "tabs",
    description: "Set tabs on a terminal.",
    useCases: ["Configure the terminal's hardware tab stops"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["expand"],
    category: "text-processing"
  },
  {
    name: "pr",
    description: "Convert text files for printing.",
    useCases: ["Format plain text with page headers and margins for printing"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["fmt", "fold"],
    category: "text-processing"
  },
  {
    name: "jq",
    description: "Command-line JSON processor.",
    useCases: ["Extract specific values from a JSON API response", "Pretty-print JSON files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-r": { description: "Output raw strings, not JSON texts" }
    },
    exampleOutputLines: [],
    relatedCommands: ["yq", "sed"],
    category: "text-processing"
  },
  {
    name: "yq",
    description: "Command-line YAML and XML processor.",
    useCases: ["Parse and modify YAML configuration files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-i": { description: "Update the file in place" }
    },
    exampleOutputLines: [],
    relatedCommands: ["jq"],
    category: "text-processing"
  },
  {
    name: "xmllint",
    description: "Command line XML tool.",
    useCases: ["Format, query or validate XML files"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "--format": { description: "Reformat and reindent the output" }
    },
    exampleOutputLines: [],
    relatedCommands: ["jq", "yq"],
    category: "text-processing"
  },
  {
    name: "dos2unix",
    description: "DOS/Mac to Unix and vice versa text file format converter.",
    useCases: ["Fix broken shell scripts edited on Windows by removing CR characters"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["unix2dos", "tr", "sed"],
    category: "text-processing"
  },
  {
    name: "unix2dos",
    description: "Unix to DOS text file format converter.",
    useCases: ["Convert Linux text files to open properly in older Windows apps"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["dos2unix"],
    category: "text-processing"
  },
  {
    name: "recode",
    description: "Convert files between various character sets and usages.",
    useCases: ["Translate character encodings or line endings"],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [],
    relatedCommands: ["iconv"],
    category: "text-processing"
  }
];