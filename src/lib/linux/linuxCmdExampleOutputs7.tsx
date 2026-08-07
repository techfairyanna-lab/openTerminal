import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const linuxCmdExampleOutputs7: Record<string, ExampleOutputLine[]> = {
  watch: [
    {
      line: "Every 2.0s: df -h                                hostname: Mon Mar 18 10:23:45 2024",
      segments: [
        { text: "Every 2.0s: ", explanation: "The refresh interval for the watch command" },
        { text: "df -h", explanation: "The command being repeatedly executed" },
        { text: "                                hostname: Mon Mar 18 10:23:45 2024", explanation: "The system hostname and current timestamp of the execution" }
      ]
    },
    {
      line: "Filesystem      Size  Used Avail Use% Mounted on",
      segments: [
        { text: "Filesystem      Size  Used Avail Use% Mounted on", explanation: "Header of the command being watched (df -h)" }
      ]
    },
    {
      line: "/dev/sda1        50G   10G   38G  21% /",
      segments: [
        { text: "/dev/sda1        50G   10G   38G  21% /", explanation: "Output of the watched command, refreshing every 2 seconds" }
      ]
    }
  ],
  anacron: [
    {
      line: "Anacron started on 2024-03-18",
      segments: [
        { text: "Anacron started on ", explanation: "Log entry indicating anacron service initialization" },
        { text: "2024-03-18", explanation: "The date the daemon started checking for missed jobs" }
      ]
    },
    {
      line: "Normal exit (0 jobs run)",
      segments: [
        { text: "Normal exit", explanation: "Anacron finished its routine successfully" },
        { text: " (0 jobs run)", explanation: "Indicates there were no delayed jobs that needed to be executed" }
      ]
    }
  ],
  systemctl: [
    {
      line: "  UNIT                           LOAD   ACTIVE SUB     DESCRIPTION",
      segments: [
        { text: "  UNIT                           ", explanation: "The name of the systemd unit (service, mount, socket, etc.)" },
        { text: "LOAD   ", explanation: "Whether the unit's configuration was loaded properly" },
        { text: "ACTIVE ", explanation: "High-level unit activation state" },
        { text: "SUB     ", explanation: "Low-level unit activation state" },
        { text: "DESCRIPTION", explanation: "A brief human-readable description of the unit" }
      ]
    },
    {
      line: "  cron.service                   loaded active running Regular background program processing daemon",
      segments: [
        { text: "  cron.service                   ", explanation: "The cron background scheduler service" },
        { text: "loaded ", explanation: "Unit configuration is loaded" },
        { text: "active ", explanation: "The service is currently active" },
        { text: "running ", explanation: "The service is continuously running" },
        { text: "Regular background program processing daemon", explanation: "Description of the cron service" }
      ]
    },
    {
      line: "  nginx.service                  loaded active running A high performance web server",
      segments: [
        { text: "  nginx.service                  ", explanation: "The Nginx web server service" },
        { text: "loaded active running ", explanation: "The service is up and running" },
        { text: "A high performance web server", explanation: "Description of the Nginx service" }
      ]
    },
    {
      line: "  ssh.service                    loaded active running OpenBSD Secure Shell server",
      segments: [
        { text: "  ssh.service                    ", explanation: "The SSH daemon allowing remote logins" },
        { text: "loaded active running ", explanation: "The service is up and running" },
        { text: "OpenBSD Secure Shell server", explanation: "Description of the SSH service" }
      ]
    },
    {
      line: "  postgresql.service             loaded active running PostgreSQL RDBMS",
      segments: [
        { text: "  postgresql.service             ", explanation: "The PostgreSQL database service" },
        { text: "loaded active running ", explanation: "The service is up and running" },
        { text: "PostgreSQL RDBMS", explanation: "Description of the PostgreSQL service" }
      ]
    }
  ],
  tmux: [
    {
      line: "no server running on /tmp/tmux-1000/default",
      segments: [
        { text: "no server running on ", explanation: "Error message when trying to attach to a tmux session that doesn't exist" },
        { text: "/tmp/tmux-1000/default", explanation: "The default socket path where tmux looks for the server for user ID 1000" }
      ]
    }
  ],
  screen: [
    {
      line: "No Sockets found in /run/screen/S-user.",
      segments: [
        { text: "No Sockets found in ", explanation: "Error message when attempting to list or attach to screen sessions when none exist" },
        { text: "/run/screen/S-user.", explanation: "The directory where the screen sockets are stored for the current user" }
      ]
    }
  ],
  bash: [
    {
      line: "GNU bash, version 5.2.15(1)-release (x86_64-pc-linux-gnu)",
      segments: [
        { text: "GNU bash, ", explanation: "The Bourne Again SHell" },
        { text: "version 5.2.15(1)-release ", explanation: "The installed version of the bash interpreter" },
        { text: "(x86_64-pc-linux-gnu)", explanation: "The architecture and platform bash was compiled for" }
      ]
    },
    {
      line: "Copyright (C) 2022 Free Software Foundation, Inc.",
      segments: [
        { text: "Copyright (C) 2022 Free Software Foundation, Inc.", explanation: "Standard copyright information for GNU software" }
      ]
    }
  ],
  read: [
    {
      line: "Enter your name: ",
      segments: [
        { text: "Enter your name: ", explanation: "Prompt string displayed by 'read -p', waiting for user input" }
      ]
    }
  ],
  trap: [
    {
      line: "trap -- 'cleanup' EXIT",
      segments: [
        { text: "trap -- ", explanation: "Indicates a trap is set" },
        { text: "'cleanup' ", explanation: "The command or function to execute when the signal is caught" },
        { text: "EXIT", explanation: "The signal being trapped (pseudo-signal executed upon shell exit)" }
      ]
    },
    {
      line: "trap -- '' SIGPIPE",
      segments: [
        { text: "trap -- ", explanation: "Indicates a trap is set" },
        { text: "'' ", explanation: "An empty string means the signal is ignored completely" },
        { text: "SIGPIPE", explanation: "The broken pipe signal" }
      ]
    }
  ],
  getopts: [
    {
      line: "Usage: script.sh [-v] [-f filename] [-o output]",
      segments: [
        { text: "Usage: script.sh ", explanation: "Common script usage output when an invalid option is passed to getopts" },
        { text: "[-v] [-f filename] [-o output]", explanation: "The expected flags and arguments the script accepts" }
      ]
    }
  ],
  shift: [
    {
      line: "Remaining arguments: arg2 arg3 arg4",
      segments: [
        { text: "Remaining arguments: ", explanation: "Custom script output demonstrating the state of arguments" },
        { text: "arg2 arg3 arg4", explanation: "The positional parameters ($@) after 'shift' removed the first argument ($1)" }
      ]
    }
  ]
};