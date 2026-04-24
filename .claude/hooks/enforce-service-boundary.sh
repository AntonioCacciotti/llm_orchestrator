#!/usr/bin/env bash
# Hook: prevent subagents from accessing service folders they don't own.
# Only active when ALLOWED_DIR is set (i.e. the process is a subagent).
# The main agent is unrestricted by this hook (it has no ALLOWED_DIR).

# Not a subagent — nothing to enforce.
[[ -z "${ALLOWED_DIR}" ]] && exit 0

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // ""')

# Resolve ALLOWED_DIR to an absolute path once.
allowed=$(realpath "${ALLOWED_DIR}")

block() {
  echo "🚫 Blocked: this subagent is scoped to '${ALLOWED_DIR}' and cannot access '$1'." >&2
  exit 2
}

# Helper: returns 0 if a given path is outside the allowed directory.
is_outside() {
  local target
  target=$(realpath -m "$1" 2>/dev/null || echo "$1")
  [[ "${target}" != "${allowed}"* ]]
}

# ── File tools ────────────────────────────────────────────────────────────────
if [[ "$tool_name" == "Read" || "$tool_name" == "Edit" || "$tool_name" == "MultiEdit" ]]; then
  file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')
  if [[ -n "$file_path" ]] && is_outside "$file_path"; then
    block "$file_path"
  fi
fi

# ── Bash tool ─────────────────────────────────────────────────────────────────
if [[ "$tool_name" == "Bash" ]]; then
  command=$(echo "$input" | jq -r '.tool_input.command // ""')
  # Extract any path-like tokens that point to one of the sibling service folders.
  # We check for the other known service directories by name.
  services=("dashboard_app" "player_management_ms" "reports_ms")
  for svc in "${services[@]}"; do
    svc_real=$(realpath -m "./services/${svc}" 2>/dev/null || echo "./services/${svc}")
    # Skip the service this subagent actually owns.
    [[ "${svc_real}" == "${allowed}"* ]] && continue
    if echo "$command" | grep -q "${svc}"; then
      block "${svc}"
    fi
  done
fi

exit 0