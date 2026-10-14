import { Buffer } from "node:buffer";
import {
  bodyEditConfig,
  BODY_EDIT_MODES,
  normalizeBodyEditIntensity,
  type BodyEditMode,
  type BodyEditIntensity,
  type BodyEditIntensityInput,
} from "../../config/body-editor";
import { buildBodyEditPrompt } from "./body-edit-prompts";
import { getApiKey, getBaseUrl } from "./config";

type ImageMime = (typeof bodyEditConfig.allowedMimeTypes)[number];
type OutputFormat = "png" | "jpeg" | "webp";
export type BodyImageEditErrorCode =
  | "INVALID_INPUT"
  | "NOT_CONFIGURED"
  | "INVALID_CONFIGURATION"
  | "UPSTREAM_ERROR"
  | "INVALID_RESPONSE"
  | "OUTPUT_TOO_LARGE"
  | "ASYNC_RESPONSE"
  | "TIMEOUT"
  | "CANCELLED";

export class BodyImageEditError extends Error {
  constructor(
    public readonly code: BodyImageEditErrorCode,
    message: string,
    public readonly status?: number,
    public readonly requestId?: string,
    public readonly diagnostic?: {
      reason: 'result_origin' | 'result_http' | 'result_format' | 'result_network' | 'result_timeout';
      resultHost?: string;
    },
  ) {
    super(message);
    this.name = "BodyImageEditError";
  }
}

export interface BodyImageEditOptions {
  sourceImage: { bytes: Uint8Array; mimeType: ImageMime; fileName?: string };
  mode: BodyEditMode;
  intensity?: BodyEditIntensityInput;
  signal?: AbortSignal;
}

/** Connection settings are server-owned; never populate them from a public request. */
export interface BodyEditConnection {
  apiKey?: string;
  baseURL?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
}

export interface BodyImageEditResult {
  imageUrl: string;
  provider: "openai";
  model: typeof bodyEditConfig.model;
  mode: BodyEditMode;
  intensity: BodyEditIntensity;
  requestId?: string;
  outputFormat?: OutputFormat;
}

function imageFormat(bytes: Uint8Array): OutputFormat | undefined {
  if (
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  )
    return "png";
  if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return "jpeg";
  if (
    bytes.length >= 12 &&
    Buffer.from(bytes.subarray(0, 4)).toString() === "RIFF" &&
    Buffer.from(bytes.subarray(8, 12)).toString() === "WEBP"
  )
    return "webp";
  return undefined;
}

function editEndpoint(baseURL: string): string {
  try {
    const url = new URL(baseURL);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error();
    const path = url.pathname.replace(/\/+$/, "");
    if (path && !path.endsWith("/v1")) throw new Error();
    url.pathname = `${path || "/v1"}/images/edits`;
    return url.toString();
  } catch {
    throw new BodyImageEditError(
      "INVALID_CONFIGURATION",
      "Use an HTTPS gateway origin or a base URL ending in /v1.",
    );
  }
}

/** Validates the same request as execution, without credentials, network or a billable call. */
export function prepareBodyImageEdit(
  options: BodyImageEditOptions,
  connection: Pick<BodyEditConnection, "baseURL"> = {},
) {
  const source = options?.sourceImage;
  if (
    !source ||
    !(source.bytes instanceof Uint8Array) ||
    !source.bytes.byteLength ||
    source.bytes.byteLength > bodyEditConfig.maxInputBytes ||
    !bodyEditConfig.allowedMimeTypes.includes(source.mimeType) ||
    `image/${imageFormat(source.bytes)}` !== source.mimeType ||
    !BODY_EDIT_MODES.includes(options.mode)
  ) {
    throw new BodyImageEditError(
      "INVALID_INPUT",
      "Provide a PNG, JPEG or WebP image up to 10 MB and a supported mode and intensity.",
    );
  }
  let intensity: BodyEditIntensity;
  try { intensity = normalizeBodyEditIntensity(options.intensity); }
  catch { throw new BodyImageEditError('INVALID_INPUT', 'Provide an integer editing intensity from 1 to 100.'); }
  const fileName =
    source.fileName
      ?.split(/[\\/]/)
      .pop()
      ?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
    `portrait.${imageFormat(source.bytes)}`;
  return {
    endpoint: editEndpoint(
      connection.baseURL ?? getBaseUrl("openai") ?? bodyEditConfig.baseURL,
    ),
    model: bodyEditConfig.model,
    mode: options.mode,
    intensity,
    prompt: buildBodyEditPrompt({ mode: options.mode, intensity }),
    inputBytes: source.bytes.byteLength,
    mimeType: source.mimeType,
    fileName: fileName.slice(-128),
  };
}

function safeRequestId(value: unknown): string | undefined {
  return typeof value === "string" && /^[a-zA-Z0-9_.:-]{1,128}$/.test(value)
    ? value
    : undefined;
}

function safeImageURL(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 8192) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password)
      return undefined;
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    if (
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.endsWith(".local")
    )
      return undefined;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const [a, b] = host.split(".").map(Number);
      if (
        a === 0 ||
        a === 10 ||
        a === 127 ||
        a >= 224 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 198 && (b === 18 || b === 19))
      )
        return undefined;
    }
    if (
      host.startsWith("[") &&
      (/^\[(::|::1|f[cd][0-9a-f:]*)\]$/.test(host) ||
        /^\[fe[89ab]/.test(host) ||
        /^\[::ffff:/.test(host))
    )
      return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function abortable<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      signal.removeEventListener("abort", onAbort);
      reject(new DOMException("Request aborted", "AbortError"));
    };
    // Observe the operation even if already aborted, avoiding an unhandled late rejection.
    operation
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort));
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function readResponse(
  response: Response,
  signal: AbortSignal,
  requestId?: string,
): Promise<unknown> {
  if (
    Number(response.headers.get("content-length")) >
    bodyEditConfig.maxResponseBytes
  ) {
    // Stream cleanup must not extend a request deadline if its cancel hook stalls.
    void response.body?.cancel().catch(() => undefined);
    throw new BodyImageEditError(
      "OUTPUT_TOO_LARGE",
      "The gateway response exceeded the size limit.",
      response.status,
      requestId,
    );
  }
  if (!response.body)
    throw new BodyImageEditError(
      "INVALID_RESPONSE",
      "The gateway returned no image response.",
      response.status,
      requestId,
    );
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await abortable(reader.read(), signal);
      if (done) break;
      total += value.byteLength;
      if (total > bodyEditConfig.maxResponseBytes) {
        throw new BodyImageEditError(
          "OUTPUT_TOO_LARGE",
          "The gateway response exceeded the size limit.",
          response.status,
          requestId,
        );
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new BodyImageEditError(
        "INVALID_RESPONSE",
        "The gateway returned invalid image JSON.",
        response.status,
        requestId,
      );
    }
  } catch (error) {
    void reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

function imageResult(
  payload: unknown,
  status: number,
  headerRequestId?: string,
) {
  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const requestId = headerRequestId ?? safeRequestId(data.request_id);
  const item =
    Array.isArray(data.data) && data.data[0] && typeof data.data[0] === "object"
      ? (data.data[0] as Record<string, unknown>)
      : undefined;
  if (!item && safeRequestId(data.request_id)) {
    throw new BodyImageEditError(
      "ASYNC_RESPONSE",
      "The gateway returned a task instead of an image. Check the request ID before resubmitting.",
      status,
      requestId,
    );
  }
  if (typeof item?.b64_json === "string" && item.b64_json) {
    const value = item.b64_json;
    if (value.length > Math.ceil(bodyEditConfig.maxOutputBytes / 3) * 4) {
      throw new BodyImageEditError(
        "OUTPUT_TOO_LARGE",
        "The edited image exceeded 10 MB.",
        status,
        requestId,
      );
    }
    if (value.length % 4 !== 0 || !/^[a-zA-Z0-9+/]+={0,2}$/.test(value)) {
      throw new BodyImageEditError(
        "INVALID_RESPONSE",
        "The gateway returned invalid image data.",
        status,
        requestId,
      );
    }
    const bytes = Buffer.from(value, "base64");
    if (bytes.byteLength > bodyEditConfig.maxOutputBytes) {
      throw new BodyImageEditError(
        "OUTPUT_TOO_LARGE",
        "The edited image exceeded 10 MB.",
        status,
        requestId,
      );
    }
    const format = imageFormat(bytes);
    if (!format || bytes.toString("base64") !== value) {
      throw new BodyImageEditError(
        "INVALID_RESPONSE",
        "The gateway returned invalid image data.",
        status,
        requestId,
      );
    }
    return {
      imageUrl: `data:image/${format};base64,${value}`,
      outputFormat: format,
      requestId,
    };
  }
  const imageUrl = safeImageURL(item?.url);
  if (imageUrl) return { imageUrl, requestId };
  throw new BodyImageEditError(
    "INVALID_RESPONSE",
    "The gateway returned no supported image result.",
    status,
    requestId,
  );
}

/** Server-only image editing. No automatic retries: an uncertain request can still incur a charge. */
export async function editBodyImage(
  options: BodyImageEditOptions,
  connection: BodyEditConnection = {},
): Promise<BodyImageEditResult> {
  const prepared = prepareBodyImageEdit(options, connection);
  const apiKey = (connection.apiKey ?? getApiKey("openai")).trim();
  if (!apiKey || /^(?:sk[-_])?your(?:[-_]|$)/i.test(apiKey)) {
    throw new BodyImageEditError(
      "NOT_CONFIGURED",
      "Configure the gateway OPENAI_API_KEY on the server.",
    );
  }
  const timeoutMs = connection.timeoutMs ?? bodyEditConfig.timeoutMs;
  if (
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0 ||
    timeoutMs > 2_147_483_647
  ) {
    throw new BodyImageEditError(
      "INVALID_CONFIGURATION",
      "Use a positive, finite request timeout.",
    );
  }
  if (options.signal?.aborted)
    throw new BodyImageEditError("CANCELLED", "Image editing was cancelled.");
  const controller = new AbortController();
  let timedOut = false;
  let requestId: string | undefined;
  const onCancel = () => controller.abort();
  options.signal?.addEventListener("abort", onCancel, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const form = new FormData();
  form.set("model", prepared.model);
  form.set("prompt", prepared.prompt);
  form.set("n", "1");
  form.set(
    "image",
    new Blob([new Uint8Array(options.sourceImage.bytes)], {
      type: prepared.mimeType,
    }),
    prepared.fileName,
  );
  try {
    const response = await abortable(
      (connection.fetch ?? fetch)(prepared.endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: controller.signal,
        redirect: "error",
      }),
      controller.signal,
    );
    requestId = safeRequestId(response.headers.get("x-request-id"));
    if (!response.ok) {
      void response.body?.cancel().catch(() => undefined);
      throw new BodyImageEditError(
        "UPSTREAM_ERROR",
        "The image gateway rejected the request. Check gateway access and balance before retrying.",
        response.status,
        requestId,
      );
    }
    const payload = await readResponse(response, controller.signal, requestId);
    return {
      ...imageResult(payload, response.status, requestId),
      provider: "openai",
      model: prepared.model,
      mode: prepared.mode,
      intensity: prepared.intensity,
    };
  } catch (error) {
    if (controller.signal.aborted) {
      throw new BodyImageEditError(
        timedOut ? "TIMEOUT" : "CANCELLED",
        timedOut
          ? "Image editing timed out. Check the gateway request before retrying."
          : "Image editing was cancelled.",
        undefined,
        requestId,
      );
    }
    if (error instanceof BodyImageEditError) throw error;
    throw new BodyImageEditError(
      "UPSTREAM_ERROR",
      "The image gateway could not be reached. Check the gateway request before retrying.",
      undefined,
      requestId,
    );
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onCancel);
  }
}

/** Materializes only a server-returned Rabbit CDN image for private persistence. */
export async function materializeBodyImageResult(
  result: BodyImageEditResult,
  connection: Pick<BodyEditConnection, "fetch" | "timeoutMs"> = {},
): Promise<BodyImageEditResult> {
  if (result.imageUrl.startsWith("data:")) return result;
  let url: URL;
  let resultHost: string | undefined;
  try {
    url = new URL(result.imageUrl);
    resultHost = /^[a-z0-9.-]{1,253}$/.test(url.hostname) ? url.hostname : undefined;
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hash ||
      (url.port && url.port !== "443") ||
      !bodyEditConfig.resultHostPattern.test(url.hostname) ||
      !url.pathname.startsWith("/ximg/")
    )
      throw new Error();
  } catch {
    throw new BodyImageEditError(
      "INVALID_RESPONSE",
      "The gateway returned an unsupported result origin.",
      undefined,
      result.requestId,
      { reason: 'result_origin', resultHost },
    );
  }
  const timeoutMs = connection.timeoutMs ?? bodyEditConfig.resultTimeoutMs;
  if (
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0 ||
    timeoutMs > 2_147_483_647
  ) {
    throw new BodyImageEditError(
      "INVALID_CONFIGURATION",
      "Use a positive, finite result timeout.",
    );
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await abortable(
      (connection.fetch ?? fetch)(url.toString(), {
        method: "GET",
        redirect: "error",
        credentials: "omit",
        signal: controller.signal,
      }),
      controller.signal,
    );
    if (!response.ok || response.redirected || !response.body) {
      void response.body?.cancel().catch(() => undefined);
      throw new BodyImageEditError(
        "INVALID_RESPONSE",
        "The generated image could not be retrieved.",
        response.status,
        result.requestId,
        { reason: 'result_http', resultHost },
      );
    }
    if (
      Number(response.headers.get("content-length")) >
      bodyEditConfig.maxOutputBytes
    ) {
      void response.body.cancel().catch(() => undefined);
      throw new BodyImageEditError(
        "OUTPUT_TOO_LARGE",
        "The edited image exceeded 10 MB.",
      );
    }
    reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const next = await abortable(reader.read(), controller.signal);
      if (next.done) break;
      size += next.value.byteLength;
      if (size > bodyEditConfig.maxOutputBytes)
        throw new BodyImageEditError(
          "OUTPUT_TOO_LARGE",
          "The edited image exceeded 10 MB.",
        );
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const format = imageFormat(bytes);
    if (!format)
      throw new BodyImageEditError(
        "INVALID_RESPONSE",
        "The generated image is not a supported photograph.",
        response.status,
        result.requestId,
        { reason: 'result_format', resultHost },
      );
    return {
      ...result,
      imageUrl: `data:image/${format};base64,${Buffer.from(bytes).toString("base64")}`,
      outputFormat: format,
    };
  } catch (error) {
    if (reader) void reader.cancel().catch(() => undefined);
    if (controller.signal.aborted)
      throw new BodyImageEditError(
        "TIMEOUT",
        "The generated image download timed out.",
        undefined,
        result.requestId,
        { reason: 'result_timeout', resultHost },
      );
    if (error instanceof BodyImageEditError) throw error;
    throw new BodyImageEditError(
      "INVALID_RESPONSE",
      "The generated image could not be retrieved.",
      undefined,
      result.requestId,
      { reason: 'result_network', resultHost },
    );
  } finally {
    clearTimeout(timer);
    reader?.releaseLock();
  }
}
