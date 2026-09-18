import { empresaAtual, getDashboardStats } from "@/lib/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  DespesasPieChart,
  NovosClientesChart,
  ReceitaAreaChart,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const { supabase, empresaId } = await empresaAtual();
  if (!empresaId) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">Empresa não encontrada.</CardContent></Card>;
  }

  const s = await getDashboardStats(supabase, empresaId);
  const receita12 = s.receita12Meses.reduce((a, b) => a + b.receita, 0);
  const despesa12 = s.receita12Meses.reduce((a, b) => a + b.despesa, 0);

  return (
    <>
      <PageHeader title="Relatórios" description="Desempenho consolidado dos últimos 12 meses." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Receita 12 meses</p>
          <p className="text-2xl font-semibold">{brl(receita12)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Despesa 12 meses</p>
          <p className="text-2xl font-semibold">{brl(despesa12)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Margem</p>
          <p className="text-2xl font-semibold">{receita12 ? pct(((receita12 - despesa12) / receita12) * 100) : "0%"}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Retenção</p>
          <p className="text-2xl font-semibold">{pct(s.taxaRetencao)}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Receita x Despesa</CardTitle></CardHeader>
        <CardContent><ReceitaAreaChart data={s.receita12Meses} /></CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Novos clientes</CardTitle></CardHeader>
          <CardContent><NovosClientesChart data={s.novosClientes} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Despesas por categoria</CardTitle></CardHeader>
          <CardContent>
            {s.despesasPorCategoria.length ? (
              <DespesasPieChart data={s.despesasPorCategoria} />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">Sem despesas lançadas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
