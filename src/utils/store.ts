import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set) => ({
  deploying: false,
  setDeploying: (newDeploying: boolean) =>
    set((state) => ({ deploying: newDeploying })),

  contracts: [],
  fetchContracts: async (walletAddress: string) => {
    const { data, error } = await supabase
      .from("contracts")
      .select()
      .eq("creator_address", walletAddress);

    set({ contracts: data });
  },
}));
