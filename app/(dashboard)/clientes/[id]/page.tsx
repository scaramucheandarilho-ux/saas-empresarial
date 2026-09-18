import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { empresaAtual } from "@/lib/queries";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/page-header";
import { brl, dateBR, daysUntil } from "@/lib/format";
import type { Cliente, Lancamento } from "@/types";

export const dynamic = "force-dynamic";

export default async function ClienteDetalhePage({ params }: { params: { id: string } }) {
  const { supabase, empresaId } = await empresaAtual();
  if (!empresaId) notFound();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", params.id)
    .eq("empresa_id", empresaId)
    .maybeSingle();

  if (!cliente) notFound();

  const { data: lancamentos } = await supabase
    .from("financeiro")
    .select("*")
    .eq("cliente_id", params.id)
    .order("data_vencimento", { ascending: false });

  const c = cliente as Cliente;
  const ls = (lancamentos ?? []) as Lancamento[];
  const totalReceita = ls
    .filter((l) => l.tipo === "receita")
    .reduce((s, l) => s + Number(l.valor), 0);
  const diasRenovacao = daysUntil(c.data_renovacao);

  return (
    <>
      <Link href="/clientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para clientes
      </Link>

      <PageHeader title={c.nome} description={c.email ?? "sem e-mail cadastrado"}>
        <Badge variant={statusBadge(c.status)}>{c.status}</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Valor do contrato</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{brl(c.valor_contrato)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Receita acumulada</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{brl(totalReceita)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Próxima renovação</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{dateBR(c.data_renovacao)}</p>
            {typeof diasRenovacao === "number" && (
              <p className="text-xs text-muted-foreground">
                {diasRenovacao >= 0
                  ? `em ${diasRenovacao} dia(s)`
                  : `vencido há ${Math.abs(diasRenovacao)} dia(s)`}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Dados cadastrais</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Telefone: </span>{c.telefone || "-"}</p>
          <p><span className="text-muted-foreground">Início: </span>{dateBR(c.data_inicio)}</p>
          <p className="sm:col-span-2"><span className="text-muted-foreground">Notas: </span>{c.notas || "-"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lançamentos do cliente</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ls.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.descricao || "-"}</TableCell>
                  <TableCell className="capitalize">{l.tipo}</TableCell>
                  <TableCell>{dateBR(l.data_vencimento)}</TableCell>
                  <TableCell><Badge variant={statusBadge(l.status)}>{l.status}</Badge></TableCell>
                  <TableCell className="text-right">{brl(l.valor)}</TableCell>
                </TableRow>
              ))}
              {!ls.length && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Nenhum lançamento para este cliente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
