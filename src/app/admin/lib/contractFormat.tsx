import type { ReactNode } from "react";

/**
 * Renderiza o texto gerado do contrato (parágrafos separados por linha em
 * branco) como um documento formatado: título centralizado, cláusulas em
 * negrito, "Parágrafo X." e itens "I –" com prefixo em negrito, bloco de
 * assinatura centralizado. Puramente baseado em padrões de texto, então
 * continua funcionando mesmo se o template for editado.
 */
export function renderContractBlocks(text: string): ReactNode[] {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    // Título do documento — primeiro bloco
    if (i === 0) {
      return (
        <p key={i} className="text-center font-bold text-[15px] mb-8 leading-snug tracking-wide">
          {block}
        </p>
      );
    }

    // Cabeçalho de cláusula
    if (/^CLÁUSULA\s/i.test(block)) {
      return (
        <p key={i} className="font-bold text-sm mt-8 mb-3">
          {block}
        </p>
      );
    }

    // Bloco de assinatura: linha de sublinhado + nome/CPF logo abaixo
    if (/_{10,}/.test(block)) {
      return (
        <p key={i} className="text-center text-sm leading-relaxed mt-8 whitespace-pre-line">
          {block}
        </p>
      );
    }

    // Rótulo isolado, ex: "CONTRATADOS:" sozinho antes da lista de qualificação
    if (/^(CONTRATANTE|CONTRATADOS?):?\s*$/i.test(block)) {
      return (
        <p key={i} className="font-bold text-sm mt-5 mb-2">
          {block}
        </p>
      );
    }

    // "Parágrafo Primeiro. texto..."
    const paragrafo = block.match(/^(Parágrafo\s+\S+\.)\s*([\s\S]*)$/);
    if (paragrafo) {
      return (
        <p key={i} className="text-sm leading-relaxed mb-3 text-justify">
          <strong>{paragrafo[1]}</strong> {paragrafo[2]}
        </p>
      );
    }

    // Item em numeral romano: "I – texto..."
    const romano = block.match(/^([IVXLCDM]+)\s*[–-]\s*([\s\S]*)$/);
    if (romano) {
      return (
        <p key={i} className="text-sm leading-relaxed mb-3 pl-4 text-justify">
          <strong>{romano[1]} –</strong> {romano[2]}
        </p>
      );
    }

    // Rótulo inline no início do parágrafo, ex: "CONTRATANTE: Empresa X, ..."
    const label = block.match(/^(CONTRATANTE|CONTRATADOS?|CONTRATADO):\s*([\s\S]*)$/);
    if (label) {
      return (
        <p key={i} className="text-sm leading-relaxed mb-3 text-justify">
          <strong>{label[1]}:</strong> {label[2]}
        </p>
      );
    }

    // Parágrafo comum
    return (
      <p key={i} className="text-sm leading-relaxed mb-3 text-justify">
        {block}
      </p>
    );
  });
}
