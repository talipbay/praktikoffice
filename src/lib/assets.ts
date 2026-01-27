export function getAssetPath(path: string): string {
  // If it's a Strapi URL (starts with http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If it's a Strapi upload path, prepend Strapi URL
  if (path.startsWith('/uploads/')) {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    return `${strapiUrl}${path}`;
  }

  // Check if we're in production build for GitHub Pages
  const isGitHubPages =
    typeof window !== "undefined"
      ? window.location.hostname === "talipbay.github.io"
      : process.env.NODE_ENV === "production" &&
        process.env.GITHUB_ACTIONS === "true";

  const basePath = isGitHubPages ? "/praktikoffice" : "";

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}
