// Minimal fail-closed wrapper for the Alma Relay container.
//
// The upstream Node edition only requires RELAY_REGISTRATION_KEY when the
// variable is actually set: with no key at all it accepts registrations from
// anyone who knows the relay address. This package always deploys a
// registration key, so the wrapper refuses to start unless a usable key is
// present. It performs no network probing, health checking or startup
// gating beyond that single environment validation, then hands control to the
// unmodified upstream entrypoint.

export function validateRegistrationKey(value) {
  if (typeof value !== 'string') {
    throw new Error('RELAY_REGISTRATION_KEY must be provided');
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('RELAY_REGISTRATION_KEY must not be empty');
  }
  if (/[\r\n]/.test(trimmed)) {
    throw new Error('RELAY_REGISTRATION_KEY must be a single line');
  }
  if (trimmed !== value) {
    throw new Error('RELAY_REGISTRATION_KEY must not contain leading or trailing whitespace');
  }
  if (trimmed.length < 32) {
    throw new Error('RELAY_REGISTRATION_KEY must be at least 32 characters');
  }
  return trimmed;
}

function main() {
  let key;
  try {
    key = validateRegistrationKey(process.env.RELAY_REGISTRATION_KEY);
  } catch (error) {
    // Never echo the value itself; only the reason is reported.
    console.error(`[alma-relay] refusing to start: ${error.message}`);
    process.exit(1);
  }
  // Hand the validated value to the unmodified upstream entrypoint.
  process.env.RELAY_REGISTRATION_KEY = key;
  return import('/app/index.mjs');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
