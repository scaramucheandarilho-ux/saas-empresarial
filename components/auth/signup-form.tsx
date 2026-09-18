"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setOk(null);
    const form = new FormData(e.currentTarget);

    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: {
          empresa_nome: String(form.get("empresa")),
          nome: String(form.get("nome")),
          cnpj: String(form.get("cnpj") || ""),
          telefone: String(form.get("telefone") || ""),
        },
      },
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    if (!data.session) {
      setOk("Conta criada! Confirme o e-mail para ativar o acesso e depois faça login.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="empresa">Nome da empresa</Label>
        <Input id="empresa" name="empresa" placeholder="Minha Empresa Ltda" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" name="telefone" placeholder="(11) 99999-0000" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nome">Seu nome</Label>
        <Input id="nome" name="nome" placeholder="Seu nome completo" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>
      {erro && <p className="text-sm text-destructive">{erro}</p>}
      {ok && <p className="text-sm text-emerald-600">{ok}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar conta"}
      </Button>
    </form>
  );
}
