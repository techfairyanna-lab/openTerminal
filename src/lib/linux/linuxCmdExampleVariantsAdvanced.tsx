import { ExampleOutputLine } from "./linuxCmdExampleOutputs";

export const advancedVariants: Record<
  string,
  Record<string, ExampleOutputLine[]>
> = {
  git: {
    init: [
      {
        line: "Initialized empty Git repository in /home/user/project/.git/",
        segments: [
          {
            text: "Initialized empty Git repository in ",
            explanation: "Success message indicating a new repo was created",
          },
          {
            text: "/home/user/project/.git/",
            explanation:
              "The absolute path to the newly created hidden .git directory",
          },
        ],
      },
    ],
    clone: [
      {
        line: "Cloning into 'repo'...",
        segments: [
          {
            text: "Cloning into 'repo'...",
            explanation: "Creating a new local directory named 'repo'",
          },
        ],
      },
      {
        line: "remote: Enumerating objects: 156, done.",
        segments: [
          {
            text: "remote: ",
            explanation: "Message originating from the remote server",
          },
          {
            text: "Enumerating objects: 156, done.",
            explanation: "Counting the total number of files and commits",
          },
        ],
      },
      {
        line: "remote: Counting objects: 100% (156/156), done.",
        segments: [
          {
            text: "remote: Counting objects: 100% (156/156), done.",
            explanation: "Verifying the objects to transfer",
          },
        ],
      },
      {
        line: "remote: Compressing objects: 100% (98/98), done.",
        segments: [
          {
            text: "remote: Compressing objects: 100% (98/98), done.",
            explanation: "Compressing data to save bandwidth during download",
          },
        ],
      },
      {
        line: "Receiving objects: 100% (156/156), 1.24 MiB | 2.34 MiB/s, done.",
        segments: [
          { text: "Receiving objects: 100% (156/156), ", explanation: "Download progress" },
          { text: "1.24 MiB | 2.34 MiB/s, ", explanation: "Total size and download speed" },
          { text: "done.", explanation: "Download completion" },
        ],
      },
      {
        line: "Resolving deltas: 100% (47/47), done.",
        segments: [
          {
            text: "Resolving deltas: 100% (47/47), done.",
            explanation: "Reconstructing files from compressed differential data",
          },
        ],
      },
    ],
    add: [
      {
        line: "$ git add .",
        segments: [
          {
            text: "$ git add .",
            explanation: "Stages all changes (silent on success)",
          },
        ],
      },
    ],
    commit: [
      {
        line: "[main a1b2c3d] Fix login validation bug",
        segments: [
          { text: "[", explanation: "Start of commit info" },
          { text: "main ", explanation: "The branch you committed to" },
          { text: "a1b2c3d", explanation: "The short SHA-1 hash of the new commit" },
          { text: "] ", explanation: "End of commit info" },
          { text: "Fix login validation bug", explanation: "The commit message" },
        ],
      },
      {
        line: " 3 files changed, 42 insertions(+), 7 deletions(-)",
        segments: [
          { text: " 3 files changed, ", explanation: "Number of files modified" },
          { text: "42 insertions(+), ", explanation: "Total lines added" },
          { text: "7 deletions(-)", explanation: "Total lines removed" },
        ],
      },
    ],
    push: [
      {
        line: "Enumerating objects: 5, done.",
        segments: [
          { text: "Enumerating objects: 5, done.", explanation: "Preparing objects to upload" },
        ],
      },
      {
        line: "Counting objects: 100% (5/5), done.",
        segments: [
          { text: "Counting objects: 100% (5/5), done.", explanation: "Verifying the count" },
        ],
      },
      {
        line: "Delta compression using up to 8 threads",
        segments: [
          { text: "Delta compression using up to 8 threads", explanation: "Compressing diffs efficiently" },
        ],
      },
      {
        line: "Compressing objects: 100% (3/3), done.",
        segments: [
          { text: "Compressing objects: 100% (3/3), done.", explanation: "Compression successful" },
        ],
      },
      {
        line: "Writing objects: 100% (3/3), 1.24 KiB | 1.24 MiB/s, done.",
        segments: [
          { text: "Writing objects: 100% (3/3), ", explanation: "Uploading the objects" },
          { text: "1.24 KiB | 1.24 MiB/s, done.", explanation: "Transfer stats" },
        ],
      },
      {
        line: "To https://github.com/user/repo.git",
        segments: [
          { text: "To ", explanation: "Destination" },
          { text: "https://github.com/user/repo.git", explanation: "Remote repository URL" },
        ],
      },
      {
        line: "   a1b2c3d..e4f5g6h  main -> main",
        segments: [
          { text: "   a1b2c3d..e4f5g6h  ", explanation: "Commit range pushed" },
          { text: "main ", explanation: "Local branch" },
          { text: "-> ", explanation: "Pushed to" },
          { text: "main", explanation: "Remote branch" },
        ],
      },
    ],
    pull: [
      {
        line: "remote: Enumerating objects: 3, done.",
        segments: [{ text: "remote: Enumerating objects: 3, done.", explanation: "Remote server packaging objects" }],
      },
      {
        line: "remote: Counting objects: 100% (3/3), done.",
        segments: [{ text: "remote: Counting objects: 100% (3/3), done.", explanation: "Remote server verifying objects" }],
      },
      {
        line: "remote: Compressing objects: 100% (2/2), done.",
        segments: [{ text: "remote: Compressing objects: 100% (2/2), done.", explanation: "Remote server compressing data" }],
      },
      {
        line: "Updating a1b2c3d..e4f5g6h",
        segments: [{ text: "Updating a1b2c3d..e4f5g6h", explanation: "Applying updates between these commit hashes" }],
      },
      {
        line: "Fast-forward",
        segments: [{ text: "Fast-forward", explanation: "Merge strategy used (no divergence, simple line-up)" }],
      },
      {
        line: " src/app.js | 12 +++++++++---",
        segments: [
          { text: " src/app.js ", explanation: "File updated" },
          { text: "| 12 +++++++++---", explanation: "Visual summary of additions and deletions" },
        ],
      },
      {
        line: " 1 file changed, 9 insertions(+), 3 deletions(-)",
        segments: [{ text: " 1 file changed, 9 insertions(+), 3 deletions(-)", explanation: "Summary of pull changes" }],
      },
    ],
    fetch: [
      {
        line: "remote: Enumerating objects: 5, done.",
        segments: [{ text: "remote: Enumerating objects: 5, done.", explanation: "Remote packaging objects" }],
      },
      {
        line: "remote: Counting objects: 100% (5/5), done.",
        segments: [{ text: "remote: Counting objects: 100% (5/5), done.", explanation: "Remote verifying objects" }],
      },
      {
        line: "From https://github.com/user/repo",
        segments: [{ text: "From https://github.com/user/repo", explanation: "Source repository" }],
      },
      {
        line: "   a1b2c3d..e4f5g6h  main       -> origin/main",
        segments: [
          { text: "   a1b2c3d..e4f5g6h  ", explanation: "Commit hashes fetched" },
          { text: "main       -> origin/main", explanation: "Updating local tracking branch" },
        ],
      },
    ],
    branch: [
      {
        line: "  develop",
        segments: [{ text: "  develop", explanation: "A local branch" }],
      },
      {
        line: "  feature/auth",
        segments: [{ text: "  feature/auth", explanation: "Another local branch" }],
      },
      {
        line: "  feature/dashboard",
        segments: [{ text: "  feature/dashboard", explanation: "Another local branch" }],
      },
      {
        line: "* main",
        segments: [
          { text: "* ", explanation: "Asterisk indicates the currently active branch" },
          { text: "main", explanation: "The name of the active branch" },
        ],
      },
    ],
    merge: [
      {
        line: "Updating a1b2c3d..e4f5g6h",
        segments: [{ text: "Updating a1b2c3d..e4f5g6h", explanation: "The commit range being merged" }],
      },
      {
        line: "Fast-forward",
        segments: [{ text: "Fast-forward", explanation: "The merge strategy applied" }],
      },
      {
        line: " src/auth.js   | 35 ++++++++++++++",
        segments: [{ text: " src/auth.js   | 35 ++++++++++++++", explanation: "Diff stat for auth.js" }],
      },
      {
        line: " src/routes.js |  8 +++-",
        segments: [{ text: " src/routes.js |  8 +++-", explanation: "Diff stat for routes.js" }],
      },
      {
        line: " 2 files changed, 40 insertions(+), 3 deletions(-)",
        segments: [{ text: " 2 files changed, 40 insertions(+), 3 deletions(-)", explanation: "Overall merge summary" }],
      },
    ],
    rebase: [
      {
        line: "Successfully rebased and updated refs/heads/feature.",
        segments: [
          { text: "Successfully rebased and updated ", explanation: "Confirmation of success" },
          { text: "refs/heads/feature.", explanation: "The internal reference for the rebased branch" },
        ],
      },
    ],
    stash: [
      {
        line: "Saved working directory and index state WIP on main: a1b2c3d Fix login bug",
        segments: [
          { text: "Saved working directory and index state ", explanation: "Stash creation message" },
          { text: "WIP on main: ", explanation: "Context: Work in Progress on branch 'main'" },
          { text: "a1b2c3d Fix login bug", explanation: "The last commit before the stash" },
        ],
      },
    ],
    diff: [
      {
        line: "diff --git a/src/app.js b/src/app.js",
        segments: [{ text: "diff --git a/src/app.js b/src/app.js", explanation: "Comparing original (a) to modified (b)" }],
      },
      {
        line: "index 1234567..abcdefg 100644",
        segments: [{ text: "index 1234567..abcdefg 100644", explanation: "Git blob hashes and file mode" }],
      },
      {
        line: "--- a/src/app.js",
        segments: [{ text: "--- a/src/app.js", explanation: "Original file path" }],
      },
      {
        line: "+++ b/src/app.js",
        segments: [{ text: "+++ b/src/app.js", explanation: "Modified file path" }],
      },
      {
        line: "@@ -15,7 +15,9 @@ function handleLogin(req, res) {",
        segments: [
          { text: "@@ -15,7 +15,9 @@ ", explanation: "Diff chunk header (lines 15-21 in old, 15-23 in new)" },
          { text: "function handleLogin(req, res) {", explanation: "Context around the change" },
        ],
      },
      {
        line: "   const { username, password } = req.body;",
        segments: [{ text: "   const { username, password } = req.body;", explanation: "Unmodified line" }],
      },
      {
        line: "-  if (username && password) {",
        segments: [
          { text: "-", explanation: "Line removed" },
          { text: "  if (username && password) {", explanation: "The removed code" },
        ],
      },
      {
        line: "+  if (username?.trim() && password?.length >= 8) {",
        segments: [
          { text: "+", explanation: "Line added" },
          { text: "  if (username?.trim() && password?.length >= 8) {", explanation: "The new code" },
        ],
      },
      {
        line: "+    const hashedPassword = await bcrypt.hash(password, 10);",
        segments: [
          { text: "+", explanation: "Line added" },
          { text: "    const hashedPassword = await bcrypt.hash(password, 10);", explanation: "The new code" },
        ],
      },
      {
        line: "     // authenticate user",
        segments: [{ text: "     // authenticate user", explanation: "Unmodified line" }],
      },
    ],
    log: [
      {
        line: "a1b2c3d Fix login validation bug",
        segments: [
          { text: "a1b2c3d ", explanation: "Commit hash" },
          { text: "Fix login validation bug", explanation: "Commit message" },
        ],
      },
      {
        line: "e4f5g6h Add user dashboard component",
        segments: [
          { text: "e4f5g6h ", explanation: "Commit hash" },
          { text: "Add user dashboard component", explanation: "Commit message" },
        ],
      },
      {
        line: "9a8b7c6 Update dependencies to latest versions",
        segments: [
          { text: "9a8b7c6 ", explanation: "Commit hash" },
          { text: "Update dependencies to latest versions", explanation: "Commit message" },
        ],
      },
      {
        line: "5d4e3f2 Initial commit",
        segments: [
          { text: "5d4e3f2 ", explanation: "Commit hash" },
          { text: "Initial commit", explanation: "Commit message" },
        ],
      },
    ],
    config: [
      {
        line: "user.name=John Smith",
        segments: [{ text: "user.name=John Smith", explanation: "Global username configured" }],
      },
      {
        line: "user.email=john@example.com",
        segments: [{ text: "user.email=john@example.com", explanation: "Global email configured" }],
      },
      {
        line: "core.editor=vim",
        segments: [{ text: "core.editor=vim", explanation: "Default text editor for Git" }],
      },
      {
        line: "init.defaultBranch=main",
        segments: [{ text: "init.defaultBranch=main", explanation: "Default branch name for new repos" }],
      },
      {
        line: "pull.rebase=false",
        segments: [{ text: "pull.rebase=false", explanation: "Default pull strategy" }],
      },
    ],
    remote: [
      {
        line: "origin  https://github.com/user/repo.git (fetch)",
        segments: [
          { text: "origin  ", explanation: "The shortname of the remote" },
          { text: "https://github.com/user/repo.git ", explanation: "The remote URL" },
          { text: "(fetch)", explanation: "Configured for fetching data" },
        ],
      },
      {
        line: "origin  https://github.com/user/repo.git (push)",
        segments: [
          { text: "origin  ", explanation: "The shortname of the remote" },
          { text: "https://github.com/user/repo.git ", explanation: "The remote URL" },
          { text: "(push)", explanation: "Configured for pushing data" },
        ],
      },
    ],
    tag: [
      {
        line: "v1.0.0",
        segments: [{ text: "v1.0.0", explanation: "A semantic version tag" }],
      },
      {
        line: "v1.1.0",
        segments: [{ text: "v1.1.0", explanation: "A semantic version tag" }],
      },
      {
        line: "v1.2.0",
        segments: [{ text: "v1.2.0", explanation: "A semantic version tag" }],
      },
      {
        line: "v2.0.0",
        segments: [{ text: "v2.0.0", explanation: "A major semantic version tag" }],
      },
    ],
    "cherry-pick": [
      {
        line: "[main f1e2d3c] Add logout feature",
        segments: [
          { text: "[main f1e2d3c] ", explanation: "Commit applied to the main branch" },
          { text: "Add logout feature", explanation: "The cherry-picked commit message" },
        ],
      },
      {
        line: " Date: Mon Mar 15 10:23:45 2024 +0000",
        segments: [{ text: " Date: Mon Mar 15 10:23:45 2024 +0000", explanation: "Preserved original commit date" }],
      },
      {
        line: " 1 file changed, 15 insertions(+)",
        segments: [{ text: " 1 file changed, 15 insertions(+)", explanation: "Diff summary of the applied commit" }],
      },
    ],
    bisect: [
      {
        line: "Bisecting: 12 revisions left to test after this (roughly 4 steps)",
        segments: [
          { text: "Bisecting: ", explanation: "Operation status" },
          { text: "12 revisions left to test after this ", explanation: "Remaining search space" },
          { text: "(roughly 4 steps)", explanation: "Estimated steps via binary search" },
        ],
      },
      {
        line: "[a1b2c3d4e5f6] Update auth middleware",
        segments: [
          { text: "[a1b2c3d4e5f6] ", explanation: "The commit currently checked out for testing" },
          { text: "Update auth middleware", explanation: "Commit message" },
        ],
      },
    ],
    blame: [
      {
        line: "a1b2c3d4 (John Smith  2024-03-15 10:23:45 +0000  1) # My Project",
        segments: [
          { text: "a1b2c3d4 ", explanation: "Commit hash" },
          { text: "(John Smith  2024-03-15 10:23:45 +0000  1) ", explanation: "Author, date, and line number" },
          { text: "# My Project", explanation: "Line content" },
        ],
      },
      {
        line: "e4f5g6h8 (Jane Doe    2024-03-16 14:30:22 +0000  2) ",
        segments: [
          { text: "e4f5g6h8 ", explanation: "Commit hash" },
          { text: "(Jane Doe    2024-03-16 14:30:22 +0000  2) ", explanation: "Author, date, and line number" },
        ],
      },
      {
        line: "e4f5g6h8 (Jane Doe    2024-03-16 14:30:22 +0000  3) A web application for managing tasks.",
        segments: [
          { text: "e4f5g6h8 ", explanation: "Commit hash" },
          { text: "(Jane Doe    2024-03-16 14:30:22 +0000  3) ", explanation: "Author, date, and line number" },
          { text: "A web application for managing tasks.", explanation: "Line content" },
        ],
      },
      {
        line: "9a8b7c6d (John Smith  2024-03-17 09:15:33 +0000  4) ",
        segments: [
          { text: "9a8b7c6d ", explanation: "Commit hash" },
          { text: "(John Smith  2024-03-17 09:15:33 +0000  4) ", explanation: "Author, date, and line number" },
        ],
      },
      {
        line: "9a8b7c6d (John Smith  2024-03-17 09:15:33 +0000  5) ## Installation",
        segments: [
          { text: "9a8b7c6d ", explanation: "Commit hash" },
          { text: "(John Smith  2024-03-17 09:15:33 +0000  5) ", explanation: "Author, date, and line number" },
          { text: "## Installation", explanation: "Line content" },
        ],
      },
    ],
  },
  docker: {
    run: [
      {
        line: "Unable to find image 'hello-world:latest' locally",
        segments: [{ text: "Unable to find image 'hello-world:latest' locally", explanation: "Docker checked the local cache and missed" }],
      },
      {
        line: "latest: Pulling from library/hello-world",
        segments: [{ text: "latest: Pulling from library/hello-world", explanation: "Fetching from Docker Hub library" }],
      },
      {
        line: "Digest: sha256:2498fce...",
        segments: [{ text: "Digest: sha256:2498fce...", explanation: "Image integrity hash" }],
      },
      {
        line: "Status: Downloaded newer image for hello-world:latest",
        segments: [{ text: "Status: Downloaded newer image for hello-world:latest", explanation: "Pull successful" }],
      },
      {
        line: "Hello from Docker!",
        segments: [{ text: "Hello from Docker!", explanation: "Output generated by the container payload" }],
      },
      {
        line: "This message shows that your installation appears to be working correctly.",
        segments: [{ text: "This message shows that your installation appears to be working correctly.", explanation: "Output from container" }],
      },
    ],
    ps: [
      {
        line: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS        PORTS                  NAMES",
        segments: [{ text: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS        PORTS                  NAMES", explanation: "Table headers" }],
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
    "ps -a": [
      {
        line: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS                    PORTS                  NAMES",
        segments: [{ text: "CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS                    PORTS                  NAMES", explanation: "Table headers" }],
      },
      {
        line: "a1b2c3d4e5f6   nginx     \"/docker-entrypoint.…\"   2 hours ago    Up 2 hours                0.0.0.0:8080->80/tcp   web-server",
        segments: [{ text: "a1b2c3d4e5f6   nginx     \"/docker-entrypoint.…\"   2 hours ago    Up 2 hours                0.0.0.0:8080->80/tcp   web-server", explanation: "Currently running container" }],
      },
      {
        line: "f6e5d4c3b2a1   redis     \"docker-entrypoint.s…\"   3 hours ago    Up 3 hours                6379/tcp               cache",
        segments: [{ text: "f6e5d4c3b2a1   redis     \"docker-entrypoint.s…\"   3 hours ago    Up 3 hours                6379/tcp               cache", explanation: "Currently running container" }],
      },
      {
        line: "b9c8d7e6f5a4   alpine    \"/bin/sh\"                5 hours ago    Exited (0) 4 hours ago                           temp-job",
        segments: [
          { text: "b9c8d7e6f5a4   alpine    \"/bin/sh\"                5 hours ago    ", explanation: "Container details" },
          { text: "Exited (0) 4 hours ago                           ", explanation: "Status showing it successfully completed (exit code 0) and stopped" },
          { text: "temp-job", explanation: "The container name" },
        ],
      },
    ],
    build: [
      {
        line: "Step 1/5 : FROM node:18-alpine",
        segments: [{ text: "Step 1/5 : FROM node:18-alpine", explanation: "Setting the base image" }],
      },
      {
        line: " ---> 8d4b6c3f2a1e",
        segments: [{ text: " ---> 8d4b6c3f2a1e", explanation: "Base image hash" }],
      },
      {
        line: "Step 2/5 : WORKDIR /app",
        segments: [{ text: "Step 2/5 : WORKDIR /app", explanation: "Setting the working directory inside the container" }],
      },
      {
        line: " ---> Running in 3c4d5e6f7a8b",
        segments: [{ text: " ---> Running in 3c4d5e6f7a8b", explanation: "Executing instruction in an intermediate container" }],
      },
      {
        line: "Step 3/5 : COPY package*.json ./",
        segments: [{ text: "Step 3/5 : COPY package*.json ./", explanation: "Copying files from host to container" }],
      },
      {
        line: "Step 4/5 : RUN npm install",
        segments: [{ text: "Step 4/5 : RUN npm install", explanation: "Running a command inside the container during build" }],
      },
      {
        line: "Step 5/5 : COPY . .",
        segments: [{ text: "Step 5/5 : COPY . .", explanation: "Copying remaining source code" }],
      },
      {
        line: "Successfully built 9e8d7c6b5a4f",
        segments: [{ text: "Successfully built 9e8d7c6b5a4f", explanation: "The final resulting image hash" }],
      },
      {
        line: "Successfully tagged myapp:latest",
        segments: [{ text: "Successfully tagged myapp:latest", explanation: "The friendly name assigned to the new image" }],
      },
    ],
    pull: [
      {
        line: "Using default tag: latest",
        segments: [{ text: "Using default tag: latest", explanation: "Docker defaults to 'latest' if no tag is specified" }],
      },
      {
        line: "latest: Pulling from library/nginx",
        segments: [{ text: "latest: Pulling from library/nginx", explanation: "Fetching the official nginx image" }],
      },
      {
        line: "c5e155d5a1d1: Pull complete",
        segments: [{ text: "c5e155d5a1d1: Pull complete", explanation: "Downloading a specific image layer" }],
      },
      {
        line: "... Digest: sha256:abc123...",
        segments: [{ text: "... Digest: sha256:abc123...", explanation: "Image hash verification" }],
      },
      {
        line: "Status: Downloaded newer image for nginx:latest",
        segments: [{ text: "Status: Downloaded newer image for nginx:latest", explanation: "Completion status" }],
      },
      {
        line: "docker.io/library/nginx:latest",
        segments: [{ text: "docker.io/library/nginx:latest", explanation: "The full path to the downloaded image" }],
      },
    ],
    push: [
      {
        line: "The push refers to repository [docker.io/myrepo/myapp]",
        segments: [{ text: "The push refers to repository [docker.io/myrepo/myapp]", explanation: "Target registry destination" }],
      },
      {
        line: "5f70bf18a086: Pushed",
        segments: [{ text: "5f70bf18a086: Pushed", explanation: "Successfully uploaded an image layer" }],
      },
      {
        line: "latest: digest: sha256:abc123... size: 1570",
        segments: [{ text: "latest: digest: sha256:abc123... size: 1570", explanation: "Final manifest hash and metadata" }],
      },
    ],
    images: [
      {
        line: "REPOSITORY   TAG       IMAGE ID       CREATED        SIZE",
        segments: [{ text: "REPOSITORY   TAG       IMAGE ID       CREATED        SIZE", explanation: "Table headers" }],
      },
      {
        line: "nginx        latest    a8758716bb6a   2 days ago     187MB",
        segments: [
          { text: "nginx        latest    ", explanation: "Image name and tag" },
          { text: "a8758716bb6a   ", explanation: "Unique image ID" },
          { text: "2 days ago     187MB", explanation: "Age and disk footprint" },
        ],
      },
      {
        line: "node         18        c5e155d5a1d1   5 days ago     995MB",
        segments: [{ text: "node         18        c5e155d5a1d1   5 days ago     995MB", explanation: "Node.js environment image" }],
      },
      {
        line: "myapp        latest    9e8d7c6b5a4f   10 min ago     234MB",
        segments: [{ text: "myapp        latest    9e8d7c6b5a4f   10 min ago     234MB", explanation: "Locally built image" }],
      },
    ],
    exec: [
      {
        line: "root@a1b2c3d4e5f6:/app# ",
        segments: [
          { text: "root", explanation: "Running as root user inside the container" },
          { text: "@", explanation: "Separator" },
          { text: "a1b2c3d4e5f6", explanation: "The container ID acting as hostname" },
          { text: ":/app# ", explanation: "Working directory and root prompt" },
        ],
      },
    ],
    logs: [
      {
        line: "2024-03-18T10:00:00.123Z INFO  [Server] Listening on port 8080",
        segments: [
          { text: "2024-03-18T10:00:00.123Z ", explanation: "Log timestamp" },
          { text: "INFO  [Server] Listening on port 8080", explanation: "Application output indicating successful startup" },
        ],
      },
      {
        line: "2024-03-18T10:05:22.456Z DEBUG [Database] Connected to postgres:5432",
        segments: [
          { text: "2024-03-18T10:05:22.456Z ", explanation: "Log timestamp" },
          { text: "DEBUG [Database] Connected to postgres:5432", explanation: "Application output indicating a DB connection" },
        ],
      },
    ],
    volume: [
      {
        line: "DRIVER    VOLUME NAME",
        segments: [{ text: "DRIVER    VOLUME NAME", explanation: "Table headers" }],
      },
      {
        line: "local     mydata",
        segments: [
          { text: "local     ", explanation: "Storage driver used" },
          { text: "mydata", explanation: "Name of the volume" },
        ],
      },
      {
        line: "local     postgres_data",
        segments: [{ text: "local     postgres_data", explanation: "Another volume, likely for database persistence" }],
      },
      {
        line: "local     redis_data",
        segments: [{ text: "local     redis_data", explanation: "Volume for Redis caching persistence" }],
      },
    ],
    network: [
      {
        line: "NETWORK ID     NAME      DRIVER    SCOPE",
        segments: [{ text: "NETWORK ID     NAME      DRIVER    SCOPE", explanation: "Table headers" }],
      },
      {
        line: "a1b2c3d4e5f6   bridge    bridge    local",
        segments: [
          { text: "a1b2c3d4e5f6   ", explanation: "Unique network ID" },
          { text: "bridge    ", explanation: "Network name" },
          { text: "bridge    ", explanation: "Driver type (default local networking)" },
          { text: "local", explanation: "Network scope" },
        ],
      },
      {
        line: "f6e5d4c3b2a1   host      host      local",
        segments: [{ text: "f6e5d4c3b2a1   host      host      local", explanation: "Host network mapping" }],
      },
      {
        line: "1a2b3c4d5e6f   mynet     bridge    local",
        segments: [{ text: "1a2b3c4d5e6f   mynet     bridge    local", explanation: "A custom user-defined bridge network" }],
      },
    ],
    inspect: [
      {
        line: "[",
        segments: [{ text: "[", explanation: "Start of JSON array output" }],
      },
      {
        line: "    {",
        segments: [{ text: "    {", explanation: "Start of object for inspected item" }],
      },
      {
        line: "        \"Id\": \"a1b2c3d4e5f6...\",",
        segments: [{ text: "        \"Id\": \"a1b2c3d4e5f6...\",", explanation: "Full ID of the container or image" }],
      },
      {
        line: "        \"State\": {",
        segments: [{ text: "        \"State\": {", explanation: "Nested object containing status info" }],
      },
      {
        line: "            \"Status\": \"running\",",
        segments: [{ text: "            \"Status\": \"running\",", explanation: "Container is active" }],
      },
      {
        line: "            \"Running\": true",
        segments: [{ text: "            \"Running\": true", explanation: "Boolean flag for running state" }],
      },
      {
        line: "        }",
        segments: [{ text: "        }", explanation: "End of State object" }],
      },
      {
        line: "    }",
        segments: [{ text: "    }", explanation: "End of item object" }],
      },
      {
        line: "]",
        segments: [{ text: "]", explanation: "End of JSON output" }],
      },
    ],
    stats: [
      {
        line: "CONTAINER ID   NAME         CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O",
        segments: [{ text: "CONTAINER ID   NAME         CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O", explanation: "Live resource usage headers" }],
      },
      {
        line: "a1b2c3d4e5f6   web-server   0.15%   24.5MiB / 7.77GiB    0.31%   1.2kB / 648B     8.19MB / 0B",
        segments: [
          { text: "a1b2c3d4e5f6   web-server   ", explanation: "Container identity" },
          { text: "0.15%   ", explanation: "CPU utilization percentage" },
          { text: "24.5MiB / 7.77GiB    0.31%   ", explanation: "Memory usage vs allocation limit" },
          { text: "1.2kB / 648B     ", explanation: "Network data received / sent" },
          { text: "8.19MB / 0B", explanation: "Disk block data read / written" },
        ],
      },
    ],
    system: [
      {
        line: "WARNING! This will remove:",
        segments: [{ text: "WARNING! This will remove:", explanation: "Cautionary prompt detailing what will be deleted" }],
      },
      {
        line: "  - all stopped containers",
        segments: [{ text: "  - all stopped containers", explanation: "Reclaiming space from inactive processes" }],
      },
      {
        line: "  - all networks not used by at least one container",
        segments: [{ text: "  - all networks not used by at least one container", explanation: "Reclaiming unused virtual networks" }],
      },
      {
        line: "  - all dangling images",
        segments: [{ text: "  - all dangling images", explanation: "Reclaiming space from untagged orphaned layers" }],
      },
      {
        line: "  - all dangling build cache",
        segments: [{ text: "  - all dangling build cache", explanation: "Clearing leftover build artifacts" }],
      },
      {
        line: "Total reclaimed space: 1.234GB",
        segments: [{ text: "Total reclaimed space: 1.234GB", explanation: "Summary of disk space freed (shows after confirming Y)" }],
      },
    ],
  },
  systemctl: {
    "list-timers": [
      {
        line: "NEXT                        LEFT          LAST                        PASSED       UNIT                         ACTIVATES",
        segments: [{ text: "NEXT                        LEFT          LAST                        PASSED       UNIT                         ACTIVATES", explanation: "Table headers for systemd timers" }],
      },
      {
        line: "Mon 2024-03-18 06:00:00 UTC 8h left       Sun 2024-03-17 06:00:00 UTC 15h ago      apt-daily.timer              apt-daily.service",
        segments: [
          { text: "Mon 2024-03-18 06:00:00 UTC 8h left       ", explanation: "When it runs next" },
          { text: "Sun 2024-03-17 06:00:00 UTC 15h ago      ", explanation: "When it ran last" },
          { text: "apt-daily.timer              ", explanation: "The timer configuration file" },
          { text: "apt-daily.service", explanation: "The service triggered by this timer" },
        ],
      },
      {
        line: "Mon 2024-03-18 06:14:00 UTC 8h left       Sun 2024-03-17 06:14:00 UTC 15h ago      apt-daily-upgrade.timer      apt-daily-upgrade.service",
        segments: [{ text: "Mon 2024-03-18 06:14:00 UTC 8h left       Sun 2024-03-17 06:14:00 UTC 15h ago      apt-daily-upgrade.timer      apt-daily-upgrade.service", explanation: "Automated upgrade timer details" }],
      },
      {
        line: "Mon 2024-03-18 00:00:00 UTC 2h left       Sun 2024-03-17 00:00:00 UTC 21h ago      logrotate.timer              logrotate.service",
        segments: [{ text: "Mon 2024-03-18 00:00:00 UTC 2h left       Sun 2024-03-17 00:00:00 UTC 21h ago      logrotate.timer              logrotate.service", explanation: "Log rotation timer details" }],
      },
    ],
    status: [
      {
        line: "● nginx.service - A high performance web server",
        segments: [
          { text: "● ", explanation: "Green dot indicating healthy status" },
          { text: "nginx.service - A high performance web server", explanation: "Service name and description" },
        ],
      },
      {
        line: "     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)",
        segments: [
          { text: "     Loaded: loaded ", explanation: "The unit is loaded into memory" },
          { text: "(/lib/systemd/system/nginx.service; ", explanation: "Path to the configuration" },
          { text: "enabled)", explanation: "Service starts automatically on boot" },
        ],
      },
      {
        line: "     Active: active (running) since Mon 2024-03-18 10:23:45 UTC; 2h 15min ago",
        segments: [
          { text: "     Active: active (running) ", explanation: "Service is currently active and running" },
          { text: "since Mon 2024-03-18 10:23:45 UTC; 2h 15min ago", explanation: "Uptime indicator" },
        ],
      },
      {
        line: "   Main PID: 1234 (nginx)",
        segments: [{ text: "   Main PID: 1234 (nginx)", explanation: "Process ID of the master process" }],
      },
      {
        line: "      Tasks: 3",
        segments: [{ text: "      Tasks: 3", explanation: "Number of active threads/workers" }],
      },
      {
        line: "     Memory: 5.2M",
        segments: [{ text: "     Memory: 5.2M", explanation: "Memory footprint" }],
      },
      {
        line: "        CPU: 234ms",
        segments: [{ text: "        CPU: 234ms", explanation: "Total CPU time consumed" }],
      },
    ],
  },
  tmux: {
    ls: [
      {
        line: "work: 3 windows (created Mon Mar 18 10:23:45 2024)",
        segments: [
          { text: "work", explanation: "The name of the tmux session" },
          { text: ": 3 windows ", explanation: "Number of open windows in this session" },
          { text: "(created Mon Mar 18 10:23:45 2024)", explanation: "Session creation timestamp" },
        ],
      },
      {
        line: "dev: 2 windows (created Mon Mar 18 09:15:30 2024)",
        segments: [
          { text: "dev", explanation: "Another session name" },
          { text: ": 2 windows ", explanation: "Number of open windows in this session" },
          { text: "(created Mon Mar 18 09:15:30 2024)", explanation: "Session creation timestamp" },
        ],
      },
    ],
  },
  screen: {
    "-ls": [
      {
        line: "There are screens on:",
        segments: [{ text: "There are screens on:", explanation: "Header indicating active screen sessions" }],
      },
      {
        line: "\t12345.mysession\t(03/18/2024 10:23:45 AM)\t(Detached)",
        segments: [
          { text: "\t12345.mysession", explanation: "PID and session name" },
          { text: "\t(03/18/2024 10:23:45 AM)", explanation: "Start time" },
          { text: "\t(Detached)", explanation: "Session is running in the background and can be re-attached" },
        ],
      },
      {
        line: "\t12346.dev\t(03/18/2024 09:15:30 AM)\t(Attached)",
        segments: [
          { text: "\t12346.dev", explanation: "PID and session name" },
          { text: "\t(03/18/2024 09:15:30 AM)", explanation: "Start time" },
          { text: "\t(Attached)", explanation: "Someone is currently viewing this session" },
        ],
      },
      {
        line: "2 Sockets in /run/screen/S-user.",
        segments: [{ text: "2 Sockets in /run/screen/S-user.", explanation: "Summary indicating the location of the socket files" }],
      },
    ],
  },
};