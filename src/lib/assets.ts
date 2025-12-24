export function getAssetPath(path: string): string {
  // Check if we're in production build for GitHub Pages
  const isGitHubPages =
    typeof window !== "undefined"
      ? window.location.hostname === "talipbay.github.io"
      : process.env.NODE_ENV === "production" &&
        process.env.GITHUB_ACTIONS === "true";

  // For VPS deployment, don't add any base path
  const isVPS =
    typeof window !== "undefined" &&
    !window.location.hostname.includes("github.io") &&
    !window.location.hostname.includes("localhost");

  const basePath = isGitHubPages ? "/praktikoffice" : "";

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}
