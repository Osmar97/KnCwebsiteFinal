import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { openInNewTab } from "@/lib/openLink";

/**
 * Returns a function that opens a URL in a new tab and falls back to a
 * client-side React Router navigation if the popup is blocked (for internal
 * routes) or a same-tab redirect (for external URLs).
 */
export const useOpenInNewTab = () => {
  const navigate = useNavigate();

  return useCallback(
    (url: string, fallbackMessage?: string) =>
      openInNewTab(url, { navigate, fallbackMessage }),
    [navigate]
  );
};