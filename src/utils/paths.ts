const baseUrl = import.meta.env.BASE_URL ?? "/";

function isExternalPath(path: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|#)/i.test(path);
}

export function withBase(path: string) {
  if (!path || isExternalPath(path)) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}
