import { NextResponse, type NextRequest } from "next/server";
import { guard } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guard();
  if ("error" in g) return g.error;
  const { supabase, empresaId } = g;

  const body = await req.json();
  delete body.id;
  delete body.empresa_id;

  const { data, error } = await supabase
    .from("clientes")
    .update(body)
    .eq("id", params.id)
    .eq("empresa_id", empresaId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cliente: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guard();
  if ("error" in g) return g.error;
  const { supabase, empresaId } = g;

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", params.id)
    .eq("empresa_id", empresaId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
