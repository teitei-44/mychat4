"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mandalartFormSchema } from "@/lib/mandalart/schema";
import { formToRow } from "@/lib/mandalart/mapper";
import { idSchema } from "@/lib/mandalart/queries";

export type ActionResult =
  { ok: true; id: string } | { ok: false; error: string };

const LOGIN_REQUIRED = "로그인이 필요합니다. 다시 로그인해 주세요.";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function parseForm(input: unknown) {
  const parsed = mandalartFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false as const,
      error: first?.message
        ? `입력값을 확인하세요: ${first.message}`
        : "입력값을 확인하세요.",
    };
  }
  return { ok: true as const, data: parsed.data };
}

export async function createMandalart(input: unknown): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: LOGIN_REQUIRED };

  const parsed = parseForm(input);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabase
    .from("mandalarts")
    .insert({ ...formToRow(parsed.data), user_id: user.id })
    .select("id")
    .single();
  if (error || !data) {
    return {
      ok: false,
      error: "저장하지 못했습니다. 잠시 후 다시 시도하세요.",
    };
  }

  revalidatePath("/mandalarts");
  return { ok: true, id: data.id };
}

export async function updateMandalart(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: LOGIN_REQUIRED };
  if (!idSchema.safeParse(id).success) {
    return { ok: false, error: "만다라트를 찾을 수 없습니다." };
  }

  const parsed = parseForm(input);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabase
    .from("mandalarts")
    .update(formToRow(parsed.data))
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    return {
      ok: false,
      error: "저장하지 못했습니다. 잠시 후 다시 시도하세요.",
    };
  }
  if (!data) return { ok: false, error: "만다라트를 찾을 수 없습니다." };

  revalidatePath("/mandalarts");
  revalidatePath(`/mandalarts/${id}`);
  return { ok: true, id };
}

export async function deleteMandalart(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: LOGIN_REQUIRED };
  if (!idSchema.safeParse(id).success) {
    return { ok: false, error: "만다라트를 찾을 수 없습니다." };
  }

  const { data, error } = await supabase
    .from("mandalarts")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    return {
      ok: false,
      error: "삭제하지 못했습니다. 잠시 후 다시 시도하세요.",
    };
  }
  if (!data.length) return { ok: false, error: "만다라트를 찾을 수 없습니다." };

  revalidatePath("/mandalarts");
  return { ok: true, id };
}
