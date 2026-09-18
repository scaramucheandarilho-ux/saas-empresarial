import { empresaAtual } from "@/lib/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { FinanceiroView } from "@/components/financeiro/financeiro-view";
import { Card, CardContent } from "@/components/ui/card";
import type { Cliente, Lancamento } from "@/types";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const { supabase, empresaId } = await empresaAtual();
  if (!empresaId) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">Empresa não encontrada.</CardContent></Card>;
  }

  const [{ data: lanc }, { data: clientes }] = await Promise.all([
    supabase.from("financeiro").select("*").eq("empresa_id", empresaId).order("data_vencimento", { ascending: false }),
    supabase.from("clientes").select("*").eq("empresa_id", empresaId).order("nome"),
  ]);

  return (
    <>
      <PageHeader title="Financeiro" description="Controle de receitas, despesas e resultado." />
      <FinanceiroView
        lancamentos={(lanc ?? []) as Lancamento[]}
        clientes={(clientes ?? []) as Cliente[]}
      />
    </>
  );
}
