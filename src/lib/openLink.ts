import { toast } from "sonner";

/**
 * Opens a URL in a new tab. If the popup is blocked by the browser,
 * shows an error toast and falls back to navigating in the same tab.
 */
export function openInNewTab(url: string, fallbackMessage?: string): void {
  const win = window.open(url, "_blank", "noopener,noreferrer");

  // Popup blocked: window.open returns null (or a closed window in some browsers)
  if (!win || win.closed || typeof win.closed === "undefined") {
    toast.error(
      fallbackMessage ??
        "Popup blocked by your browser. Opening in the same tab instead."
    );
    window.location.href = url;
  }
}