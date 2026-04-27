import { refreshToken } from "./api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://185.200.244.215:9400/api";

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

async function rawFetch(url: string, options: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
  });
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // store the incoming request url and option
  const storedUrl = url;
  const storedOptions = options;

  const response = await rawFetch(storedUrl, storedOptions);

  // if returned with 403 or 401 then call the refresh token
  if (response.status === 401 || response.status === 403) {
    try {
      await refreshToken();

      // if success then call the stored endpoint with its options
      return await rawFetch(storedUrl, storedOptions);
    } catch (err) {
      throw err;
    }
  }

  return response;
}
