#!/usr/bin/env bash
# Hook: block any attempt by the main agent to read .env files.
# Claude Code passes a JSON payload via stdin before each tool use.
# Exiting with code 2 blocks the tool call and surfaces the message to the agent.

input=$(cat)

tool_name=$(echo "$input" | jq -r '.tool_name // ""')

block() {
  echo "$1" >&2
  exit 2
}

# ── Read / Edit / MultiEdit tool ─────────────────────────────────────────────
if [[ "$tool_name" == "Read" || "$tool_name" == "Edit" || "$tool_name" == "MultiEdit" ]]; then
  file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')
  # Match .env, .env.local, .env.production, etc.
  if [[ "$(basename "$file_path")" == .env* ]]; then
    block "Blocked: main agent is not allowed to read '$file_path'. Spawn a subagent to retrieve the values you need."
  fi
fi

# ── Bash tool ─────────────────────────────────────────────────────────────────
if [[ "$tool_name" == "Bash" ]]; then
  command=$(echo "$input" | jq -r '.tool_input.command // ""')
  # Catch: cat .env*, less .env*, head .env*, tail .env*, grep … .env*, etc.
  if echo "$command" | grep -qE '(^|[[:space:]]|/)(cat|less|head|tail|more|grep|awk|sed|bat|view|open)\s[^|&;]*\.env'; then
    block "Blocked: main agent is not allowed to read .env files via shell commands. Spawn a subagent instead."
  fi
  # Catch: direct references like $(cat .env) or < .env or source .env
  if echo "$command" | grep -qE '(source|\.)\s+[^|&;]*\.env[^[:space:]]*|<\s*[^|&;]*\.env|\$\(cat\s+[^)]*\.env'; then
    block "Blocked: main agent is not allowed to read .env files via shell commands. Spawn a subagent instead."
  fi
fi

exit 0