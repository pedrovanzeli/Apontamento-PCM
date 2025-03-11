async function buscarSolicitacao() {
    const numeroSolicitacao = document.getElementById("numeroSolicitacao").value.trim();
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjHfFEDNbyJxmtlGysOJb3i35Oq217kDCjU8_4pGVpzMFeOA-qtbC2vV2d_4YG_tR9bcaTue2tr39M/pub?output=csv";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao carregar os dados.");
        }

        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows[0];

        // Encontrar a solicitação com o número digitado
        const solicitacao = rows.find(linha => linha[1] === numeroSolicitacao);

        if (solicitacao) {
            let html = "<h3>Detalhes da Solicitação</h3><ul>";

            headers.forEach((header, index) => {
                if (!header.includes("Ordem Concluída") && !header.includes("Data de Submissão")) {
                    if (solicitacao[index].trim()) {
                        html += `<li><strong>${header}:</strong> ${solicitacao[index]}</li>`;
                    }
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
        document.getElementById("formApontamento").style.display = "none";
    }
}

function enviarApontamento() {
    const camposObrigatorios = [
        { id: "dataHoraInicial", mensagem: "Preencha a Data e Hora Inicial." },
        { id: "dataHoraFinal", mensagem: "Preencha a Data e Hora Final." },
        { id: "manutentor", mensagem: "Preencha a Identificação do Manutentor." },
        { id: "centroTrabalho", mensagem: "Selecione o Centro de Trabalho." },
        { id: "ordemConcluida", mensagem: "Selecione se a Ordem foi Concluída." }
    ];

    let campoInvalido = false;

    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        elemento.style.border = "1px solid #ccc"; // Resetando a borda

        if (!elemento.value.trim()) {
            alert(`⚠️ ${campo.mensagem}`);
            elemento.style.border = "2px solid red"; // Destaca o erro
            elemento.focus();
            campoInvalido = true;
            return;
        }
    });

    if (campoInvalido) return; // Se houver erro, para o envio

    // Criando objeto do apontamento
    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: document.getElementById("dataHoraInicial").value,
        dataHoraFinal: document.getElementById("dataHoraFinal").value,
        manutentor: document.getElementById("manutentor").value,
        centroTrabalho: document.getElementById("centroTrabalho").value,
        ordemConcluida: document.getElementById("ordemConcluida").value,
        observacao: document.getElementById("observacao").value,
        imagem: document.getElementById("imagem").files[0]
    };

    console.log("✅ Dados do Apontamento:", apontamento);
    alert("✅ Apontamento enviado com sucesso!");

    // Exibir o link de visualização da imagem
    if (apontamento.imagem) {
        const imagemLink = URL.createObjectURL(apontamento.imagem);
        const imagemLinkText = document.getElementById("imagemLinkText");
        imagemLinkText.href = imagemLink;
        document.getElementById("imagemLink").style.display = "block";
    }
}
