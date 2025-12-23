import { create } from "zustand";

interface CSRFStore {
  csrfToken: string | null;
  setCSRFToken: (token: string | null) => void;
  initCSRFToken: () => Promise<string | null>;
}

export const useCSRFStore = create<CSRFStore>((set) => ({
  csrfToken: null,
  setCSRFToken: (token) => set({ csrfToken: token }),
  initCSRFToken: async () => {
    const fetchCsrfApi = await fetch(
      "https://api.netverses.com/v1/security/get-csrf",
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!fetchCsrfApi.ok) return null;
    const csrfApiResponse = await fetchCsrfApi.json();

    console.log(csrfApiResponse);

    if (!csrfApiResponse) return null;
    if (!csrfApiResponse.success) return null;

    return csrfApiResponse?.csrf_token ?? null;
  },
}));
