import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const netstatVariants: Record<string, ExampleOutputLine[]> = {
  "-tuln": [
    {
      line: "Proto Recv-Q Send-Q Local Address           Foreign Address         State      ",
      segments: [
        { text: "Proto ", explanation: "Network protocol" },
        { text: "Recv-Q Send-Q ", explanation: "Bytes in the receive and send queues" },
        { text: "Local Address           ", explanation: "IP address and port on the local machine" },
        { text: "Foreign Address         ", explanation: "IP address and port of the remote peer" },
        { text: "State      ", explanation: "Connection state of the socket" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 ", explanation: "TCP protocol with empty queues" },
        { text: "0.0.0.0:22              ", explanation: "Listening on all IPv4 interfaces on numeric port 22 (SSH)" },
        { text: "0.0.0.0:*               ", explanation: "Accepting connections from any remote IP and port" },
        { text: "LISTEN     ", explanation: "Waiting for incoming connection requests" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ", explanation: "Web server listening for HTTP traffic" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     ", explanation: "Web server listening for HTTPS traffic" }
      ]
    },
    {
      line: "tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 127.0.0.1:5432          ", explanation: "Database process bound only to local loopback interface (cannot be accessed externally)" },
        { text: "0.0.0.0:*               LISTEN     ", explanation: "Waiting for local connections" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN     ", explanation: "Development server listening on port 3000" }
      ]
    },
    {
      line: "udp        0      0 0.0.0.0:53              0.0.0.0:*               ",
      segments: [
        { text: "udp        0      0 0.0.0.0:53              0.0.0.0:*               ", explanation: "DNS service listening on UDP port 53. UDP has no LISTEN state." }
      ]
    }
  ],
  "-an": [
    {
      line: "Proto Recv-Q Send-Q Local Address           Foreign Address         State      ",
      segments: [
        { text: "Proto Recv-Q Send-Q Local Address           Foreign Address         State      ", explanation: "Standard headers" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     ", explanation: "Listening port ready for connections" }
      ]
    },
    {
      line: "tcp        0     64 192.168.1.10:22         192.168.1.50:45892      ESTABLISHED",
      segments: [
        { text: "tcp        ", explanation: "TCP Protocol" },
        { text: "0     64 ", explanation: "64 bytes queued to be sent" },
        { text: "192.168.1.10:22         ", explanation: "Local server IP and SSH port" },
        { text: "192.168.1.50:45892      ", explanation: "Remote client IP and ephemeral port" },
        { text: "ESTABLISHED", explanation: "Active ongoing connection" }
      ]
    },
    {
      line: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     ", explanation: "Listening web server" }
      ]
    },
    {
      line: "tcp        0      0 192.168.1.10:80         203.0.113.5:54321       TIME_WAIT  ",
      segments: [
        { text: "tcp        0      0 192.168.1.10:80         203.0.113.5:54321       ", explanation: "A recently closed HTTP connection" },
        { text: "TIME_WAIT  ", explanation: "Socket is waiting to ensure the remote peer received the connection closure acknowledgment" }
      ]
    },
    {
      line: "tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN     ",
      segments: [
        { text: "tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN     ", explanation: "Local listening database" }
      ]
    },
    {
      line: "udp        0      0 0.0.0.0:53              0.0.0.0:*               ",
      segments: [
        { text: "udp        0      0 0.0.0.0:53              0.0.0.0:*               ", explanation: "Connectionless UDP socket" }
      ]
    }
  ]
};