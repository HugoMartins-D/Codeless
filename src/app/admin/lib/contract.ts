import type { Contract } from "../types";
import { currency } from "../ui/tokens";

export const DEFAULT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Contratante: {{nome}}
CPF: {{cpf}}
Endereço: {{endereco}}

Valor total: {{valor}}
Forma de pagamento: {{forma_pagamento}}
Vigência: {{vigencia}}

Escopo do projeto:
{{escopo}}

Data: {{data}}`;

export function paymentLabel(contract: Contract): string {
  if (contract.paymentMethod === "pix") return "Pix";
  return `Parcelado em ${contract.installments ?? 1}x`;
}

export function generateContractText(template: string, contract: Contract): string {
  return template
    .replaceAll("{{nome}}", contract.clientName)
    .replaceAll("{{cpf}}", contract.cpf)
    .replaceAll("{{endereco}}", contract.address)
    .replaceAll("{{valor}}", currency(contract.totalValue))
    .replaceAll("{{forma_pagamento}}", paymentLabel(contract))
    .replaceAll("{{vigencia}}", contract.validity)
    .replaceAll("{{escopo}}", contract.scope)
    .replaceAll("{{data}}", new Date(contract.createdAt).toLocaleDateString("pt-BR"));
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
