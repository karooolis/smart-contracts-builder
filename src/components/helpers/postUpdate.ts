import { supabase } from "@/utils/supabase";
import { Tables } from "@/types/supabase";

type UpdateProps = Partial<Tables<"contracts">>;

export const postUpdate = async (id: number, props: UpdateProps) => {
  await supabase.from("contracts").update(props).eq("id", id);
};
