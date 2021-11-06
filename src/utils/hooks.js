import { useLocation } from "react-router-dom";

export function useQueryString() {
  return new URLSearchParams(useLocation().search);
}
