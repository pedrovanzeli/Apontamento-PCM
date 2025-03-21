// Função para buscar solicitação
async function buscarSolicitacao() {
    const numeroSolicitacao = document.getElementById("numeroSolicitacao").value.trim();
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjHfFEDNbyJxmtlGysOJb3i35Oq217kDCjU8_4pGVpzMFeOA-qtbC2vV2d_4YG_tR9bcaTue2tr39M/pub?output=csv";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar os dados.");

        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(",").map(cell => cell.trim()));
        const headers = rows[0];

        const solicitacao = rows.find(linha => linha[1] === numeroSolicitacao);

        if (solicitacao) {
            let html = "<h3>Detalhes da Solicitação</h3><ul>";
            headers.forEach((header, index) => {
                if (solicitacao[index]) {
                    html += `<li><strong>${header}:</strong> ${solicitacao[index]}</li>`;
                }
            });
            html += "</ul>";

            document.getElementById("resultado").innerHTML = html;
            document.getElementById("formApontamento").style.display = "block";
        } else {
            document.getElementById("resultado").innerHTML = "<p>Solicitação não encontrada.</p>";
            document.getElementById("formApontamento").style.display = "none";
        }
    } catch (error) {
        console.error("Erro ao buscar solicitação:", error);
        document.getElementById("resultado").innerHTML = "<p>Ocorreu um erro ao carregar os dados.</p>";
    }
}

// Função para verificar se o apontamento foi finalizado
function verificarApontamentoFinalizado(resposta) {
    if (resposta === "Sim") {
        // Coleta os dados do formulário com os novos nomes de campo
        const numeroOrdem = document.getElementById("numeroSolicitacao").value;
        const descricaoServico = document.getElementById("descricaoServico").value;
        const setor = document.getElementById("setor").value;
        const manutentor = document.getElementById("manutentor").value;
        const centroTrabalho = document.getElementById("centroTrabalho").value;
        const ordemConcluida = document.getElementById("ordemConcluida").value;
        const observacoes = document.getElementById("observacao").value;
        const dataHoraInicial = document.getElementById("dataHoraInicial").value;
        const dataHoraFinal = document.getElementById("dataHoraFinal").value;

        // Variável para verificar se algum campo é inválido
        let isValid = true;

        // Validação de campos obrigatórios
        if (!manutentor || !centroTrabalho || !ordemConcluida) {
            isValid = false;
            if (!manutentor) document.getElementById("manutentor").classList.add("invalid");
            if (!centroTrabalho) document.getElementById("centroTrabalho").classList.add("invalid");
            if (!ordemConcluida) document.getElementById("ordemConcluida").classList.add("invalid");
        } else {
            document.getElementById("manutentor").classList.remove("invalid");
            document.getElementById("centroTrabalho").classList.remove("invalid");
            document.getElementById("ordemConcluida").classList.remove("invalid");
        }

        // Validação das datas
        const currentDate = new Date();
        const dateHoraInicialObj = new Date(dataHoraInicial);
        const dateHoraFinalObj = new Date(dataHoraFinal);

        if (dateHoraInicialObj > currentDate) {
            isValid = false;
            document.getElementById("dataHoraInicial").classList.add("invalid");
        } else {
            document.getElementById("dataHoraInicial").classList.remove("invalid");
        }

        if (dateHoraFinalObj > currentDate) {
            isValid = false;
            document.getElementById("dataHoraFinal").classList.add("invalid");
        } else {
            document.getElementById("dataHoraFinal").classList.remove("invalid");
        }

        if (dateHoraFinalObj < dateHoraInicialObj) {
            isValid = false;
            document.getElementById("dataHoraFinal").classList.add("invalid");
        } else {
            document.getElementById("dataHoraFinal").classList.remove("invalid");
        }

        // Se algum campo estiver inválido, não envia os dados
        if (!isValid) {
            alert("Por favor, revise os campos destacados em vermelho.");
            return; // Interrompe a execução e não redireciona
        }

        // Construindo a URL do WhatsApp com os dados
        const whatsappMessage = `
            *Apontamento de Serviço*\n\n
            *Número da Ordem:* ${numeroOrdem}\n
            *Descrição do Serviço:* ${descricaoServico}\n
            *Setor:* ${setor}\n
            *Manutentor:* ${manutentor}\n
            *Centro de Trabalho:* ${centroTrabalho}\n
            *Ordem Concluída:* ${ordemConcluida}\n
            *Observações:* ${observacoes}\n
            *Data Hora Inicial:* ${dataHoraInicial}\n
            *Data Hora Final:* ${dataHoraFinal}\n
        `.trim().replace(/\n/g, '%0A').replace(/\*/g, '%2A');

        const whatsappUrl = `https://wa.me/5514997350331?text=${whatsappMessage}`;

        // Redireciona para o WhatsApp com os dados preenchidos
        window.open(whatsappUrl, "_blank");
    } else {
        // Caso a resposta seja "Não", peça para revisar os dados
        alert("Por favor, revise as informações antes de finalizar.");
    }
}

// Event listeners para os botões "Sim" e "Não"
document.getElementById("botaoSim").addEventListener("click", function() {
    verificarApontamentoFinalizado("Sim");
});

document.getElementById("botaoNao").addEventListener("click", function() {
    verificarApontamentoFinalizado("Não");
});
