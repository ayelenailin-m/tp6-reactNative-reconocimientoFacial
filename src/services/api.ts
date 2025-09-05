const BASE = "https://ixk9cqrvwl5t.share.zrok.io";

const COMMON_HEADERS = {
  // lo que pide el back siosi
  "skip_zrok_interstitial": "true",
};
type RNFile = { uri: string; name: string; type: string };
function fileFromUri(uri: string, filename = "face.jpg", mime = "image/jpeg"): RNFile {
  return { uri, name: filename, type: mime };
}

export type ApiResponse = {
  success?: boolean;
  message?: string;
  cuil?: string;
  matches?: string[];
  [k: string]: any;
};

async function parseResponse(res: Response): Promise<ApiResponse> {
  const text = await res.text();
  console.log("Api responde: ", res.status, text); // debug siempre visible
  try { return JSON.parse(text); } catch { return { raw: text } as any; }
}

export async function registerFace(cuil: string, imageUri: string): Promise<ApiResponse> {
  const fd = new FormData();
  fd.append("cuil", cuil);
  fd.append("image", fileFromUri(imageUri) as any); // RN: cast para TS

  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: COMMON_HEADERS as any,
    body: fd,
  });

  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} registrando rostro`);
  // esta API suele devolver ->  200 {"message":"CUIL 444555 registrado correctamente","cuil":"444555"}
  return data ?? { success: true };
}

export async function recognizeFace(imageUri: string): Promise<ApiResponse> {
  const fd = new FormData();
  fd.append("image", fileFromUri(imageUri) as any);

  const res = await fetch(`${BASE}/recognize`, {
    method: "POST",
    headers: COMMON_HEADERS as any,
    body: fd,
  });

  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.message || `Error ${res.status} reconociendo rostro`);
  // esta API suele devolver  -> 200 {"matches":["444555"]}
  return data ?? {};
}
