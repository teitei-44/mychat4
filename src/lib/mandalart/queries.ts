import "server-only";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rowToMandalart, type Mandalart } from "./mapper";

export const idSchema = z.uuid();

/** 내 만다라트 목록 (최신 수정순). RLS로 본인 데이터만 조회된다. */
export async function listMandalarts(): Promise<Mandalart[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mandalarts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error("만다라트 목록을 불러오지 못했습니다.");
  return data.map(rowToMandalart);
}

/** 단건 조회. 없거나 다른 사용자 소유(RLS)면 null */
export async function getMandalart(id: string): Promise<Mandalart | null> {
  if (!idSchema.safeParse(id).success) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mandalarts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("만다라트를 불러오지 못했습니다.");
  return data ? rowToMandalart(data) : null;
}
