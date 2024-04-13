import { create } from "zustand";
import { supabase } from "./supabase";

import ERC20_Initial from "../templates/ERC20_Sample.sol";

// TODO: TS
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

  contractType: "erc20",
  setContractType: (newType: string) => set({ contractType: newType }),

  library: "openzeppelin",
  setLibrary: (newLibrary: string) => set({ library: newLibrary }),

  code: ERC20_Initial,
  setCode: (newCode: string) => set({ code: newCode }),
}));
