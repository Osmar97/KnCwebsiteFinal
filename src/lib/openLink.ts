import { toast } from "sonner";

const isInternalRoute = (url: string): boolean =>
  url.startsWith("/") && !url.startsWith("//");

/**
 * Opens a URL in a new tab. If the popup is blocked by the browser,
 * shows an error toast and falls back to navigating in the same tab.
 *
 * For internal routes, pass a React Router `navigate` function so the
 * fallback performs a client-side navigation instead of a full page reload.
 */
export function openInNewTab(
  url: string,
  options?: {
    fallbackMessage?: string;
    navigate?: (to: string) => void;
  }
): void {
  const win = window.open(url, "_blank", "noopener,noreferrer");

  // Popup blocked: window.open returns null (or a closed window in some browsers)
  if (!win || win.closed || typeof win.closed === "undefined") {
    toast.error(
      options?.fallbackMessage ??
        "Popup blocked by your browser. Opening in the same tab instead."
    );
    if (isInternalRoute(url) && options?.navigate) {
      options.navigate(url);
    } else {
      window.location.href = url;
    }
  }
}