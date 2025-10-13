import { create } from "zustand";
import { getServicesList } from "@/actions/get_service_list";

interface ServicesStore {
  services: string[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
}

export const useServicesStore = create<ServicesStore>((set, get) => ({
  services: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  fetchServices: async () => {
    // Don't fetch if already loaded or currently loading
    if (get().isLoaded || get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getServicesList();

      if (response.success && response.services) {
        set({
          services: response.services,
          isLoading: false,
          isLoaded: true,
          error: null,
        });
      } else {
        set({
          services: [],
          isLoading: false,
          isLoaded: false,
          error: response.error || "Failed to fetch services",
        });
      }
    } catch (error) {
      set({
        services: [],
        isLoading: false,
        isLoaded: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
}));
