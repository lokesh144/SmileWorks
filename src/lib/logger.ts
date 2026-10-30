import "server-only";

type Level = "info" | "warn" | "error";
type Fields = Record<string, string | number | boolean | null | undefined>;

/**
 * Minimal structured logger. Callers must only pass operational metadata
 * (event names, ids, status codes) — never form contents, emails, IPs or
 * secrets.
 */
function write(level: Level, event: string, fields: Fields = {}) {
  const entry = JSON.stringify({ level, event, time: new Date().toISOString(), ...fields });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

export const logger = {
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, fields?: Fields) => write("error", event, fields),
};

/** Extracts a safe, non-sensitive description of an unknown error. */
export function errorName(error: unknown): string {
  if (error instanceof Error) return error.name;
  return typeof error;
}
