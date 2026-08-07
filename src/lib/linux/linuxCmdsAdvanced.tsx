import { CommandDef } from "./CommandDef";
import { advancedVariants } from "./linuxCmdExampleVariantsAdvanced";

export const linuxCmdsAdvanced: CommandDef[] = [
  {
    name: "docker",
    category: "containerization",
    description: "Build, run, and manage containers and images",
    useCases: [
      "Running applications in isolated environments",
      "Building portable software images",
      "Deploying microservices consistently",
    ],
    isDangerous: false,
    dangerWarning:
      "The 'docker system prune' command can permanently delete stopped containers, unused networks, and dangling images.",
    safeAlternatives: ["docker container ls -a", "docker images"],
    flags: {
      "-v": { description: "Show the docker version information" },
      "-H": { description: "Daemon socket(s) to connect to" },
      "--help": { description: "Print usage" },
    },
    exampleOutputLines: [
      {
        line: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS        PORTS                  NAMES",
        segments: [
          { text: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS        PORTS                  NAMES", explanation: "Table headers" },
        ],
      },
      {
        line: "a1b2c3d4e5f6   nginx     \"/docker-entrypoint.…\"   2 hours ago    Up 2 hours    0.0.0.0:8080->80/tcp   web-server",
        segments: [
          { text: "a1b2c3d4e5f6   ", explanation: "Unique container ID" },
          { text: "nginx     ", explanation: "The base image used" },
          { text: "\"/docker-entrypoint.…\"   ", explanation: "The startup command executed" },
          { text: "2 hours ago    ", explanation: "When it was created" },
          { text: "Up 2 hours    ", explanation: "Current running status" },
          { text: "0.0.0.0:8080->80/tcp   ", explanation: "Port mapping (host 8080 routes to container 80)" },
          { text: "web-server", explanation: "The human-readable container name" },
        ],
      },
      {
        line: "f6e5d4c3b2a1   redis     \"docker-entrypoint.s…\"   3 hours ago    Up 3 hours    6379/tcp               cache",
        segments: [
          { text: "f6e5d4c3b2a1   ", explanation: "Unique container ID" },
          { text: "redis     ", explanation: "The base image used" },
          { text: "\"docker-entrypoint.s…\"   ", explanation: "The startup command executed" },
          { text: "3 hours ago    ", explanation: "When it was created" },
          { text: "Up 3 hours    ", explanation: "Current running status" },
          { text: "6379/tcp               ", explanation: "Exposed port (not mapped to host)" },
          { text: "cache", explanation: "The container name" },
        ],
      },
    ],
    exampleOutputVariants: advancedVariants.docker,
    relatedCommands: ["docker-compose"],
  },
  {
    name: "docker-compose",
    category: "containerization",
    description: "Define and run multi-container Docker applications",
    useCases: [
      "Starting an entire stack (e.g. web server, database, cache) with one command",
      "Configuring application services in a unified YAML file",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Specify an alternate compose file (default: docker-compose.yml)" },
      "-d": { description: "Detached mode: Run containers in the background" },
      "--build": { description: "Build images before starting containers" },
    },
    exampleOutputLines: [
      {
        line: "Creating network \"myapp_default\" with the default driver",
        segments: [
          { text: "Creating network \"myapp_default\" ", explanation: "Setting up a private virtual network for the containers" },
          { text: "with the default driver", explanation: "Using standard bridge networking" },
        ],
      },
      {
        line: "Creating myapp_db_1  ... done",
        segments: [
          { text: "Creating myapp_db_1  ", explanation: "Spawning the database container based on the compose file" },
          { text: "... done", explanation: "Success" },
        ],
      },
      {
        line: "Creating myapp_web_1 ... done",
        segments: [
          { text: "Creating myapp_web_1 ", explanation: "Spawning the web server container" },
          { text: "... done", explanation: "Success" },
        ],
      },
      {
        line: "Attaching to myapp_db_1, myapp_web_1",
        segments: [
          { text: "Attaching to myapp_db_1, myapp_web_1", explanation: "Streaming the logs from both containers to your terminal" },
        ],
      },
    ],
    relatedCommands: ["docker"],
  },
  {
    name: "glances",
    category: "monitoring",
    description: "An eye on your system. A top/htop alternative with more features",
    useCases: [
      "Viewing an exhaustive overview of system resources in one place",
      "Monitoring remote servers seamlessly",
      "Exporting stats to external databases",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-w": { description: "Run in web server mode (accessible via browser)" },
      "-s": { description: "Run in server mode" },
      "-c": { description: "Connect to a Glances server" },
    },
    exampleOutputLines: [
      {
        line: "Ubuntu 22.04 LTS 64bit / Linux 5.15.0-76-generic",
        segments: [
          { text: "Ubuntu 22.04 LTS 64bit / Linux 5.15.0-76-generic", explanation: "OS and Kernel overview" },
        ],
      },
      {
        line: "CPU  [||||||        25.0%]   MEM  [||||||||||    45.2%]",
        segments: [
          { text: "CPU  [||||||        25.0%]   ", explanation: "Visual representation of overall CPU usage" },
          { text: "MEM  [||||||||||    45.2%]", explanation: "Visual representation of overall RAM usage" },
        ],
      },
    ],
    relatedCommands: ["top", "htop"],
  },
  {
    name: "netdata",
    category: "monitoring",
    description: "Real-time performance and health monitoring",
    useCases: [
      "Visualizing high-resolution metrics through a web dashboard",
      "Setting up complex performance alarms",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [
      {
        line: "● netdata.service - Real time performance monitoring",
        segments: [
          { text: "● ", explanation: "Status indicator showing the service is healthy" },
          { text: "netdata.service - Real time performance monitoring", explanation: "Service description" },
        ],
      },
      {
        line: "   Loaded: loaded (/lib/systemd/system/netdata.service; enabled)",
        segments: [
          { text: "   Loaded: loaded (/lib/systemd/system/netdata.service; enabled)", explanation: "Service file location and auto-start status" },
        ],
      },
      {
        line: "   Active: active (running) since Mon 2024-03-18 10:00:00 UTC",
        segments: [
          { text: "   Active: active (running) ", explanation: "The monitoring agent is active" },
          { text: "since Mon 2024-03-18 10:00:00 UTC", explanation: "When the agent was last started" },
        ],
      },
    ],
    relatedCommands: ["glances", "top"],
  },
  {
    name: "logwatch",
    category: "monitoring",
    description: "Analyze and summarize system log files",
    useCases: [
      "Getting daily email summaries of system activities",
      "Quickly auditing specific service activities like SSH logins",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "--detail": { description: "Report Detail Level (Low, Med, High)" },
      "--service": { description: "Filter to only report on a specific service" },
      "--range": { description: "Date range (yesterday, today, all)" },
    },
    exampleOutputLines: [
      {
        line: "################### Logwatch 7.5.1 (05/20/19) ####################",
        segments: [
          { text: "################### Logwatch 7.5.1 (05/20/19) ####################", explanation: "Report header and version" },
        ],
      },
      {
        line: "       Processing Initiated: Mon Mar 18 10:00:00 2024",
        segments: [
          { text: "       Processing Initiated: Mon Mar 18 10:00:00 2024", explanation: "When the report was generated" },
        ],
      },
      {
        line: "       Date Range Processed: yesterday",
        segments: [
          { text: "       Date Range Processed: yesterday", explanation: "The time boundary analyzed" },
        ],
      },
      {
        line: "--------------------- SSHD Begin ------------------------",
        segments: [
          { text: "--------------------- SSHD Begin ------------------------", explanation: "Section for SSH daemon logs" },
        ],
      },
      {
        line: " Users logging in through sshd:",
        segments: [
          { text: " Users logging in through sshd:", explanation: "Aggregated authentication records" },
        ],
      },
      {
        line: "    user:",
        segments: [{ text: "    user:", explanation: "A specific user who logged in" }],
      },
      {
        line: "       10.0.0.5 (10.0.0.5): 2 times",
        segments: [{ text: "       10.0.0.5 (10.0.0.5): 2 times", explanation: "Logins aggregated by source IP" }],
      },
      {
        line: "---------------------- SSHD End -------------------------",
        segments: [
          { text: "---------------------- SSHD End -------------------------", explanation: "End of SSH section" },
        ],
      },
    ],
    relatedCommands: ["journalctl"],
  },
  {
    name: "expect",
    category: "scripting",
    description: "Automate interactive applications",
    useCases: [
      "Automatically answering prompts in scripts (e.g. providing passwords, answering y/N)",
      "Automating repetitive telnet, ftp, or ssh sessions",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-f": { description: "Read commands from a file" },
      "-d": { description: "Enable diagnostic output (debug)" },
    },
    exampleOutputLines: [
      {
        line: "spawn ssh user@10.0.0.5",
        segments: [
          { text: "spawn ", explanation: "Expect starts the target process" },
          { text: "ssh user@10.0.0.5", explanation: "The interactive program being automated" },
        ],
      },
      {
        line: "user@10.0.0.5's password: ",
        segments: [
          { text: "user@10.0.0.5's password: ", explanation: "The application halts and expects user input" },
        ],
      },
      {
        line: "Last login: Mon Mar 18 10:00:00 2024 from 10.0.0.2",
        segments: [
          { text: "Last login: Mon Mar 18 10:00:00 2024 from 10.0.0.2", explanation: "Expect automatically fed the password and logged in" },
        ],
      },
    ],
    relatedCommands: ["bash", "ssh"],
  },
  {
    name: "z",
    category: "navigation",
    description: "Jump to frequently used directories based on history",
    useCases: [
      "Quickly changing to a directory you visit often without typing the full path",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {},
    exampleOutputLines: [
      {
        line: "user@host:~/current/path$ z proj",
        segments: [
          { text: "user@host:~/current/path$ ", explanation: "Your current terminal prompt" },
          { text: "z proj", explanation: "Instructing z to find the most 'frecuent' directory matching 'proj'" },
        ],
      },
      {
        line: "user@host:~/projects/my-proj$ ",
        segments: [
          { text: "user@host:~/projects/my-proj$ ", explanation: "Silently changes the directory without extra output" },
        ],
      },
    ],
    relatedCommands: ["autojump", "cd"],
  },
  {
    name: "autojump",
    category: "navigation",
    description: "A faster way to navigate your filesystem based on history",
    useCases: [
      "Using 'j' to instantly switch to directories you've previously visited",
    ],
    isDangerous: false,
    dangerWarning: null,
    safeAlternatives: [],
    flags: {
      "-s": { description: "Show database entries and their key weights" },
      "-a": { description: "Manually add a path to the database" },
    },
    exampleOutputLines: [
      {
        line: "user@host:~$ j proj",
        segments: [
          { text: "user@host:~$ ", explanation: "Your current terminal prompt" },
          { text: "j proj", explanation: "Running the shortcut for autojump matching 'proj'" },
        ],
      },
      {
        line: "/home/user/projects/my-proj",
        segments: [
          { text: "/home/user/projects/my-proj", explanation: "Autojump prints the absolute path it decided to switch you into" },
        ],
      },
      {
        line: "user@host:~/projects/my-proj$ ",
        segments: [
          { text: "user@host:~/projects/my-proj$ ", explanation: "Your new prompt location" },
        ],
      },
    ],
    relatedCommands: ["z", "cd"],
  },
];