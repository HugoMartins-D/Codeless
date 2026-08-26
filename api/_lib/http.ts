import type { IncomingMessage, ServerResponse } from "http";

export type ApiRequest = IncomingMessage & { method?: string; headers: Record<string, string | string[] | undefined> };

export function send(res: ServerResponse, status: number, body?: unknown): void {
  res.statusCode = status;
  if (body === undefined) {
    res.end();
    return;
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : ({} as T);
}

function header(req: ApiRequest, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

export function bearerToken(req: ApiRequest): string | undefined {
  return header(req, "authorization") ?? undefined;
}

/** Envolve um handler pra devolver erros conhecidos como JSON (401 se veio de auth, 500 caso contrário). */
export function withErrorHandling(
  handler: (req: ApiRequest, res: ServerResponse) => Promise<void>,
): (req: ApiRequest, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      const isAuthError = /token|autentica/i.test(message);
      console.error("[api/calendar] erro:", message);
      send(res, isAuthError ? 401 : 500, { error: message });
    }
  };
}
