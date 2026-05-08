#!/usr/bin/env bash
# Hook: ensure ALLOWED_DIR is set whenever a subagent (claude) is spawned.
# Only active on the main agent (no ALLOWED_DIR set).
# Subagents themselves are not spawning other agents, so skip them.

[[ -n "${ALLOWED_DIR}" ]] && exit 0

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // ""')

[[ "$tool_name" != "Bash" ]] && exit 0

command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Only care about commands that invoke claude as a binary (not paths containing "claude")
echo "$command" | grep -qE '(^|[;&|]\s*|`\s*)claude\s' || exit 0

# If claude is invoked but ALLOWED_DIR is not set in the command, block it
if ! echo "$command" | grep -q "ALLOWED_DIR="; then
  echo "Blocked: spawning a subagent without ALLOWED_DIR is not allowed." >&2
  echo "Set ALLOWED_DIR=./services/<service-folder> before the claude command." >&2
  exit 2
fi

exit 0
