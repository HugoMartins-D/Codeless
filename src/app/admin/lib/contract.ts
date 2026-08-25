import type { Contract, ContractSignatory } from "../types";
import { currency } from "../ui/tokens";

/** Lista inicial de sugestões ao criar um contrato — editável depois pela tela de Contratos. */
export const DEFAULT_TEAM_ROSTER: ContractSignatory[] = [
  { name: "Renan Regis", cpf: "122.028.799.78" },
  { name: "Luan Regis", cpf: "122.028.829-28" },
  { name: "Hugo Vinicius Martins da Silva", cpf: "101.157.809-39" },
];

export const DEFAULT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE, MANUTENÇÃO E PÁGINA DE E-COMMERCE

Pelo presente instrumento particular de contrato de prestação de serviços, de um lado:

CONTRATANTE: {{contratante_nome}}, pessoa física ou jurídica inscrita no CPF/CNPJ sob nº {{contratante_cpf/cnpj}}, com sede à {{contratante_endereco}}, neste ato representada por {{contratante_representante}}, doravante denominada simplesmente CONTRATANTE.

E, de outro lado:

CONTRATADOS:

{{contratados_qualificacao}}

doravante denominados, em conjunto, CONTRATADOS.

As partes acima identificadas têm entre si justo e contratado o presente Contrato de Prestação de Serviços de Desenvolvimento de Software e Serviços de Manutenção, que será regido pelas cláusulas e condições seguintes.

CLÁUSULA 1ª – DO OBJETO

Os CONTRATADOS comprometem-se a desenvolver, implantar e disponibilizar ao CONTRATANTE {{projeto_objeto}}, bem como prestar os respectivos serviços de manutenção, suporte técnico, monitoramento, correções e atualizações durante a vigência deste contrato.

Parágrafo Primeiro. O sistema será desenvolvido conforme as especificações previamente definidas e aprovadas entre as partes.

Parágrafo Segundo. Os serviços serão executados com autonomia técnica e administrativa pelos CONTRATADOS, inexistindo qualquer vínculo empregatício, subordinação, pessoalidade ou exclusividade em relação ao CONTRATANTE.

CLÁUSULA 2ª – DO PRAZO

O presente contrato terá vigência de 12 (doze) meses, contados da data de sua assinatura.

Parágrafo Único. Ao término da vigência, o contrato poderá ser renovado mediante acordo entre as partes, por meio de termo aditivo ou da celebração de novo contrato.

CLÁUSULA 3ª – DA RETRIBUIÇÃO E FORMA DE PAGAMENTO

Pelos serviços objeto deste contrato, o CONTRATANTE pagará aos CONTRATADOS:

I – o valor de {{valor_implantacao}}, referente ao desenvolvimento, implantação e disponibilização do sistema/projeto contratado;

II – o valor mensal de {{valor_mensal}}, referente aos serviços de manutenção, suporte técnico, monitoramento, atualizações e correções, durante toda a vigência deste contrato.

Parágrafo Primeiro. O valor previsto no inciso I será pago em parcela única, com vencimento em {{data_vencimento_implantacao}}, ou em outra forma previamente ajustada entre as partes.

Parágrafo Segundo. A mensalidade prevista no inciso II vencerá todo dia {{dia_vencimento_mensal}} de cada mês, iniciando-se após a entrega e aceite do sistema, devendo ser paga por PIX, transferência bancária, boleto ou outro meio acordado entre as partes.

Parágrafo Terceiro. A mensalidade de manutenção compreende exclusivamente os serviços de suporte técnico, monitoramento, correções e atualizações do sistema, não abrangendo o desenvolvimento de novas funcionalidades, módulos, integrações ou alterações estruturais, que dependerão de orçamento e aprovação prévia do CONTRATANTE.

CLÁUSULA 4ª – DAS OBRIGAÇÕES DOS CONTRATADOS

São obrigações dos CONTRATADOS:

I – Desenvolver, implantar e disponibilizar ao CONTRATANTE o sistema/projeto contratado, observando as especificações previamente definidas e aprovadas entre as partes.

II – Executar os serviços com zelo, diligência, boa-fé, qualidade técnica e observância das boas práticas de desenvolvimento de software, empregando todos os meios necessários para a correta execução do objeto deste contrato.

III – Prestar os serviços de manutenção, suporte técnico, monitoramento, correções de falhas e atualizações do sistema durante a vigência deste contrato, observados os limites dos serviços contratados.

IV – Realizar, durante a vigência da manutenção contratada, as atualizações necessárias decorrentes de alterações na legislação fiscal que impactem diretamente as funcionalidades originalmente desenvolvidas, desde que tais alterações não impliquem a criação de novos módulos, funcionalidades ou integrações não previstas no escopo inicial do projeto.

V – Manter absoluto sigilo sobre todas as informações, documentos, dados, arquivos, credenciais de acesso e demais informações confidenciais do CONTRATANTE a que tiverem acesso em razão da execução deste contrato, mesmo após o seu encerramento, ressalvadas as hipóteses de obrigação legal ou determinação judicial.

VI – Informar previamente ao CONTRATANTE, sempre que possível, sobre manutenções programadas, atualizações ou intervenções que possam ocasionar indisponibilidade temporária do sistema.

VII – Empregar os meios técnicos adequados para assegurar o regular funcionamento do sistema, não se responsabilizando por falhas decorrentes de caso fortuito, força maior ou problemas ocasionados por serviços de terceiros, tais como provedores de hospedagem, registradores de domínio, provedores de internet, serviços de nuvem, APIs, gateways de pagamento ou sistemas governamentais.

VIII – Auxiliar o CONTRATANTE na criação e configuração das contas necessárias para registro de domínio, hospedagem e demais serviços de infraestrutura, utilizando, sempre que possível, os dados cadastrais do CONTRATANTE, permanecendo este como titular das respectivas contas.

IX – Entregar ao CONTRATANTE, após a quitação integral dos valores previstos neste contrato, o código-fonte do sistema em formato editável, juntamente com a documentação técnica disponível referente ao projeto desenvolvido.

X – Executar os serviços com autonomia técnica e administrativa, inexistindo qualquer vínculo empregatício, societário ou de subordinação entre os CONTRATADOS e o CONTRATANTE.

CLÁUSULA 5ª – DAS OBRIGAÇÕES DO CONTRATANTE

São obrigações do CONTRATANTE:

I – Fornecer aos CONTRATADOS, de forma completa e tempestiva, todas as informações, documentos, materiais, credenciais, acessos e demais dados necessários ao desenvolvimento, implantação, manutenção e funcionamento do sistema/projeto contratado.

II – Efetuar o pagamento dos valores previstos neste contrato, nas condições e prazos estabelecidos, incluindo o valor referente ao desenvolvimento do sistema, bem como as mensalidades de manutenção durante toda a vigência contratual.

III – Responsabilizar-se pela contratação e pelo pagamento das despesas referentes ao registro e renovação de domínio, hospedagem, certificados digitais, integrações, licenças de terceiros e demais serviços de infraestrutura necessários ao funcionamento do sistema. Os CONTRATADOS poderão auxiliar o CONTRATANTE na criação e configuração das contas junto aos respectivos fornecedores, utilizando os dados cadastrais do CONTRATANTE, permanecendo este como titular das contas e responsável pelos respectivos pagamentos.

IV – Disponibilizar aos CONTRATADOS todos os acessos necessários às plataformas, servidores, serviços, ferramentas e demais recursos indispensáveis à implantação, manutenção, suporte e atualização do sistema.

V – Comunicar aos CONTRATADOS, por meio idôneo, qualquer falha, erro, instabilidade ou necessidade de suporte identificada no sistema, fornecendo as informações necessárias para a correta análise e solução do problema.

VI – Não realizar, nem permitir que terceiros realizem, alterações no sistema, no banco de dados, no servidor ou em qualquer componente da infraestrutura relacionada ao projeto sem a prévia ciência dos CONTRATADOS, quando tais alterações puderem comprometer o funcionamento dos serviços contratados.

VII – Utilizar o sistema em conformidade com a legislação vigente, responsabilizando-se integralmente pela legalidade, veracidade e atualização dos dados, documentos, produtos, serviços, informações e demais conteúdos inseridos na plataforma.

VIII – Manter sigilo sobre o código-fonte, documentação técnica, metodologias, credenciais de acesso, informações confidenciais e demais materiais de propriedade intelectual dos CONTRATADOS aos quais tiver acesso durante a execução deste contrato, abstendo-se de reproduzi-los, divulgá-los, licenciá-los ou disponibilizá-los a terceiros antes da efetiva cessão prevista neste instrumento ou sem autorização expressa dos CONTRATADOS.

IX – Realizar e manter cópias de segurança (backups) dos dados armazenados no sistema, sendo o único responsável pela guarda e recuperação dessas informações, salvo quando houver contratação específica dos CONTRATADOS para a prestação desse serviço.

X – Colaborar com os CONTRATADOS durante toda a execução do contrato, respondendo às solicitações de informações e aprovações em prazo razoável, de modo a não comprometer o cronograma de desenvolvimento e implantação do sistema.

CLÁUSULA 6ª – DO PRAZO DE ENTREGA, DO ACEITE DO SISTEMA, DO SUPORTE TÉCNICO E DAS ATUALIZAÇÕES FISCAIS

Os CONTRATADOS comprometem-se a concluir o desenvolvimento, implantação e disponibilização do sistema/projeto contratado no prazo de 45 (quarenta e cinco) dias, contados do recebimento de todas as informações, documentos, materiais, acessos, credenciais e demais elementos indispensáveis à execução dos serviços, fornecidos pelo CONTRATANTE.

Parágrafo Primeiro. O prazo previsto no caput ficará automaticamente suspenso durante o período em que o CONTRATANTE deixar de fornecer informações, documentos, aprovações, acessos ou quaisquer outros elementos necessários ao desenvolvimento do projeto, retomando sua contagem após a regularização da pendência.

Parágrafo Segundo. Concluído o desenvolvimento, os CONTRATADOS disponibilizarão o sistema ao CONTRATANTE para realização dos testes de funcionamento e validação das funcionalidades contratadas.

Parágrafo Terceiro. O CONTRATANTE terá o prazo de 07 (sete) dias corridos, contados da disponibilização do sistema, para realizar os testes e comunicar, por escrito, eventuais falhas, defeitos ou desconformidades em relação às especificações previamente aprovadas.

Parágrafo Quarto. Não havendo manifestação do CONTRATANTE dentro do prazo estabelecido no parágrafo anterior, considerar-se-á o sistema definitivamente aceito, iniciando-se, a partir dessa data, a prestação dos serviços de manutenção previstos neste contrato.

Parágrafo Quinto. Os CONTRATADOS prestarão suporte técnico durante a vigência da manutenção contratada, comprometendo-se a realizar o primeiro atendimento às solicitações do CONTRATANTE no prazo máximo de 72 (setenta e duas) horas úteis, contados da abertura do respectivo chamado pelos canais de atendimento disponibilizados.

Parágrafo Sexto. O suporte técnico compreenderá a análise de falhas, correções de erros, esclarecimento de dúvidas operacionais, monitoramento e manutenção das funcionalidades originalmente desenvolvidas, não abrangendo os serviços expressamente excluídos neste contrato.

Parágrafo Sétimo. Durante a vigência da manutenção contratada, os CONTRATADOS realizarão as atualizações necessárias decorrentes de alterações na legislação fiscal que impactem diretamente as funcionalidades originalmente desenvolvidas, desde que tais alterações não exijam o desenvolvimento de novos módulos, funcionalidades, integrações ou alterações substanciais no sistema.

Parágrafo Oitavo. Caso alterações legais ou fiscais exijam modificações que extrapolam o escopo originalmente contratado, as partes negociarão, de comum acordo, orçamento e prazo específicos para sua implementação, sem prejuízo da continuidade dos demais serviços de manutenção previstos neste contrato.

CLÁUSULA 7ª – DO DESCUMPRIMENTO CONTRATUAL

O descumprimento de qualquer obrigação prevista neste contrato, por qualquer das partes, autorizará a parte prejudicada a notificar a parte inadimplente para que regularize a situação no prazo de 10 (dez) dias, quando cabível.

Parágrafo Primeiro. Não sendo sanado o descumprimento no prazo estabelecido, poderá a parte prejudicada rescindir o contrato por justa causa, sem prejuízo da cobrança das obrigações pendentes e da reparação pelas perdas e danos comprovadamente sofridos.

Parágrafo Segundo. O descumprimento das obrigações relativas à confidencialidade, à propriedade intelectual ou à utilização indevida do sistema e do código-fonte autoriza a rescisão imediata do contrato, independentemente de notificação prévia, sem prejuízo das medidas judiciais cabíveis.

Parágrafo Terceiro. Fica estabelecida multa contratual correspondente a 10% (dez por cento) do valor total do contrato, sem prejuízo da reparação por eventuais perdas e danos, quando comprovado o descumprimento contratual por qualquer das partes.

CLÁUSULA 8ª - DO FORO

As partes elegem o foro da Comarca de {{cidade}} para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.

E assim, por estarem de justo acordo, as partes assinam este instrumento em 02 (duas) vias de idêntico teor e forma, na presença de 02 (duas) testemunhas, ao fim arroladas.

{{cidade}}, {{data_assinatura}}.

CONTRATANTE:

____________________________________________
{{contratante_nome}}
Por {{contratante_representante}}
Representante Legal

{{contratados_assinaturas}}`;

function qualificacaoBlock(signatories: ContractSignatory[]): string {
  return signatories
    .map((m) => `${m.name.toUpperCase()}${m.role ? `, ${m.role}` : ""}, inscrito no CPF nº ${m.cpf};`)
    .join("\n\n");
}

function assinaturasBlock(signatories: ContractSignatory[]): string {
  return signatories
    .map(
      (m) =>
        `CONTRATADOS:\n\n____________________________________________\n${m.name}${m.role ? `\n${m.role}` : ""}\nCPF nº ${m.cpf}`,
    )
    .join("\n\n\n");
}

export function generateContractText(template: string, contract: Contract): string {
  return template
    .replaceAll("{{contratante_nome}}", contract.clientCompanyName)
    .replaceAll("{{contratante_cpf/cnpj}}", contract.clientCnpj)
    .replaceAll("{{contratante_endereco}}", contract.clientAddress)
    .replaceAll("{{contratante_representante}}", contract.clientRepresentative)
    .replaceAll("{{projeto_objeto}}", contract.projectObject)
    .replaceAll("{{valor_implantacao}}", currency(contract.implementationValue))
    .replaceAll("{{valor_mensal}}", currency(contract.monthlyValue))
    .replaceAll("{{data_vencimento_implantacao}}", contract.implementationDueDate ? new Date(contract.implementationDueDate).toLocaleDateString("pt-BR") : "___/___/____")
    .replaceAll("{{dia_vencimento_mensal}}", String(contract.monthlyDueDay))
    .replaceAll("{{contratados_qualificacao}}", qualificacaoBlock(contract.signatories))
    .replaceAll("{{contratados_assinaturas}}", assinaturasBlock(contract.signatories))
    .replaceAll("{{cidade}}", contract.city)
    .replaceAll("{{data_assinatura}}", new Date(contract.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));
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
