type StoreEntry = { value: unknown; expires: number };

const store = new Map<string, StoreEntry>();

export interface ShareRecord {
  mode: "pfp" | "card";
  name: string;
  stack: string;
  builderClass: string;
  photoDataUrl: string;
}

const TTL_SECONDS = 60 * 60 * 24 * 14;

function hasKvEnvVars(): boolean {
  return !!(
    process.env.KV_REST_API_URL ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

let kvClient: unknown | null = null;

async function getKv(): Promise<unknown | null> {
  if (kvClient) return kvClient;

  try {
    const mod = await import("@vercel/kv");
    kvClient = (mod as Record<string, unknown>).kv;
    return kvClient;
  } catch {
    return null;
  }
}

export async function saveCard(record: ShareRecord): Promise<string> {
  const id = crypto.randomUUID().split("-")[0];
  const key = `share:${id}`;

  const kv = await getKv();
  if (kv && typeof kv === "object" && kv !== null) {
    const client = kv as Record<string, unknown>;
    const setFn = client.set as ((key: string, value: unknown, options?: { ex?: number }) => Promise<void>) | undefined;
    if (setFn) {
      try {
        await setFn(key, record, { ex: TTL_SECONDS });
        return id;
      } catch (err) {
        if (hasKvEnvVars()) {
          throw new Error(
            `Failed to connect to Vercel KV: ${err instanceof Error ? err.message : "unknown error"}`
          );
        }
      }
    }
  }

  store.set(key, { value: record, expires: Date.now() + TTL_SECONDS * 1000 });
  return id;
}

export async function getCard(id: string): Promise<ShareRecord | null> {
  const key = `share:${id}`;

  const kv = await getKv();
  if (kv && typeof kv === "object" && kv !== null) {
    const client = kv as Record<string, unknown>;
    const getFn = client.get as ((key: string) => Promise<unknown>) | undefined;
    if (getFn) {
      try {
        const record = await getFn(key);
        return (record as ShareRecord | null) ?? null;
      } catch (err) {
        if (hasKvEnvVars()) {
          throw new Error(
            `Failed to connect to Vercel KV: ${err instanceof Error ? err.message : "unknown error"}`
          );
        }
      }
    }
  }

  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value as ShareRecord;
}

export interface CombinedFrameRecord {
  mode: "combined";
  name: string;
  photoDataUrls: string[];
}

export async function saveCombined(
  record: Omit<CombinedFrameRecord, "mode"> & { mode?: "combined" }
): Promise<string> {
  const id = crypto.randomUUID().split("-")[0];
  const key = `share:${id}`;
  const fullRecord: CombinedFrameRecord = { ...record, mode: "combined" };

  const kv = await getKv();
  if (kv && typeof kv === "object" && kv !== null) {
    const client = kv as Record<string, unknown>;
    const setFn = client.set as ((key: string, value: unknown, options?: { ex?: number }) => Promise<void>) | undefined;
    if (setFn) {
      try {
        await setFn(key, fullRecord, { ex: TTL_SECONDS });
        return id;
      } catch (err) {
        if (hasKvEnvVars()) {
          throw new Error(
            `Failed to connect to Vercel KV: ${err instanceof Error ? err.message : "unknown error"}`
          );
        }
      }
    }
  }

  store.set(key, { value: fullRecord, expires: Date.now() + TTL_SECONDS * 1000 });
  return id;
}

export async function getCombined(
  id: string
): Promise<CombinedFrameRecord | null> {
  const key = `share:${id}`;

  const kv = await getKv();
  if (kv && typeof kv === "object" && kv !== null) {
    const client = kv as Record<string, unknown>;
    const getFn = client.get as ((key: string) => Promise<unknown>) | undefined;
    if (getFn) {
      try {
        const record = await getFn(key);
        const value = record as Partial<CombinedFrameRecord> | null;
        if (value && value.mode === "combined") {
          return value as CombinedFrameRecord;
        }
        return null;
      } catch (err) {
        if (hasKvEnvVars()) {
          throw new Error(
            `Failed to connect to Vercel KV: ${err instanceof Error ? err.message : "unknown error"}`
          );
        }
      }
    }
  }

  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  const value = entry.value as Partial<CombinedFrameRecord>;
  if (value && value.mode === "combined") {
    return value as CombinedFrameRecord;
  }
  return null;
}
