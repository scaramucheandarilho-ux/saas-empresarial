import { empresaAtual } from "@/lib/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, statusBadge } from "@/components/ui/badge";
import { brl, dateBR, daysUntil } from "@/lib/format";
import type { Lancamento } from "@/types";

export const dynamic = "force-dynamic";

export default async function FaturamentoPage() {
  const { supabase, empresaId } = await empresaAtual();

  const { data } = empresaId
    ? await supabase
        .from("financeiro")
        .select("*")
        .eq("empresa_id", empresaId)
        .eq("status", "pendente")
        .not("data_vencimento", "is", null)
        .order("data_vencimento")
    : { data: [] };

  const lanc = (data ?? []) as Lancamento[];

  const grupos = [
    { titulo: "Vencidas", itens: lanc.filter((l) => (daysUntil(l.data_vencimento) ?? 0) < 0) },
    { titulo: "Próximos 7 dias", itens: lanc.filter((l) => { const d = daysUntil(l.data_vencimento) ?? 0; return d >= 0 && d <= 7; }) },
    { titulo: "Próximos 30 dias", itens: lanc.filter((l) => { const d = daysUntil(l.data_vencimento) ?? 0; return d > 7 && d <= 30; }) },
    { titulo: "Depois de 30 dias", itens: lanc.filter((l) => (daysUntil(l.data_vencimento) ?? 0) > 30) },
  ];

  return (
    <>
      <PageHeader title="Calendário de faturamento" description="Contas a vencer organizadas por prazo." />
      <div className="grid gap-4 lg:grid-cols-2">
        {grupos.map((g) => (
          <Card key={g.titulo}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>{g.titulo}</CardTitle>
              <Badge variant="muted">{g.itens.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {g.itens.map((l) => (
                <div key={l.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{l.descricao || l.categoria || "Lançamento"}</p>
                    <p className="text-xs text-muted-foreground">{dateBR(l.data_vencimento)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${l.tipo === "receita" ? "text-emerald-600" : "text-red-600"}`}>
                      {brl(l.valor)}
                    </p>
                    <Badge variant={statusBadge(l.status)}>{l.tipo}</Badge>
                  </div>
                </div>
              ))}
              {!g.itens.length && <p className="py-6 text-center text-sm text-muted-foreground">Nada aqui.</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
