async function buscarSolicitacao() {
    const numeroSolicitacao = document.getElementById("numeroSolicitacao").value;
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjHfFEDNbyJxmtlGysOJb3i35Oq217kDCjU8_4pGVpzMFeOA-qtbC2vV2d_4YG_tR9bcaTue2tr39M/pub?output=csv";
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.split("\n").map(row => row.split(","));
    const headers = rows[0];
    const solicitacao = rows.find(linha => linha[1] === numeroSolicitacao);
    
    if (solicitacao) {
        let html = "<h3>Detalhes da Solicitação</h3><ul>";
        headers.forEach((header, index) => {
            if (!header.includes("Ordem Concluída") && !header.includes("Data de Submissão") && 
                (!header.includes("LOCAL DE INSTALAÇÃO/EQUIPAMENTO") || solicitacao[index].trim() !== "")) {
                if (header.includes("Descrição do Serviço") || header.includes("Informações Complementares")) {
                    html += `<li><strong>${header}:</strong><div class="scrollable">${solicitacao[index]}</div></li>`;
                } else {
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
}

function enviarApontamento() {
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
    
    console.log("Dados do Apontamento:", apontamento);
    alert("Apontamento enviado com sucesso!");

    // Se uma imagem for carregada, exibe o link para visualização
    if (apontamento.imagem) {
        const imagemLink = URL.createObjectURL(apontamento.imagem);
        const imagemLinkText = document.getElementById("imagemLinkText");
        imagemLinkText.href = imagemLink;
        document.getElementById("imagemLink").style.display = "block";
    }
}
