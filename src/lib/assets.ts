export function getAssetPath(path: string): string {
  // Check if we're in production build for GitHub Pages
  const isGitHubPages =
    typeof window !== "undefined"
      ? window.location.hostname === "talipbay.github.io"
      : process.env.NODE_ENV === "production" &&
        process.env.GITHUB_ACTIONS === "true";

  const basePath = isGitHubPages ? "/praktikoffice" : "";

  return `${basePath}${path}`;
}
