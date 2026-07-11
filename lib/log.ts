/**
 * Structured logging for server code.
 *
 * Emits single-line JSON in production (machine-parseable by Vercel's log
 * drains and any aggregator) and readable output in development. Use this
 * instead of bare console.* in server actions, route handlers, and lib code
 * so every log line carries a scope and structured context.
 *
 * Deliberately tiny: no transport, no levels config, no dependency. If a
 * client ever needs Sentry/Axiom/etc., this is the single seam to wire it
 * into (backlog-worthy the first time it comes up).
 */

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function emit(level: LogLevel, scope: string, message: string, context?: LogContext) {
  if (process.env.NODE_ENV === "production") {
    // Single-line JSON: Vercel indexes these fields automatically.
    const line = JSON.stringify({
      level,
      scope,
      message,
      ...context,
      timestamp: new Date().toISOString(),
    });
    console[level](line);
    return;
  }

  const suffix = context && Object.keys(context).length > 0 ? context : "";
  console[level](`[${scope}] ${message}`, suffix);
}

/** Scoped logger — one per module: `const log = createLogger("booking")`. */
export function createLogger(scope: string) {
  return {
    info: (message: string, context?: LogContext) => emit("info", scope, message, context),
    warn: (message: string, context?: LogContext) => emit("warn", scope, message, context),
    error: (message: string, context?: LogContext) => emit("error", scope, message, context),
  };
}
