async function buscarSolicitacao() {
    const numeroSolicitacao = document.getElementById("numeroSolicitacao").value;
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

            // Lista de campos que representam locais de instalação
            const locaisEquipamento = [
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - AVARÉ", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - HOLAMBRA", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - ITABERÁ II", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - SÃO MANUEL", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - TAKAOKA", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - TAQUARI", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - TAQUARITUBA", 
                "LOCAL DE INSTALAÇÃO/EQUIPAMENTO - TAQUARIVAÍ"
            ];

            headers.forEach((header, index) => {
                if (!header.includes("Ordem Concluída") && !header.includes("Data de Submissão")) {
                    // Oculta locais de instalação vazios
                    if (locaisEquipamento.includes(header) && solicitacao[index].trim() === "") {
                        return;
                    }

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
    } catch (error) {
        console.error("Erro ao buscar solicitação:", error);
        document.getElementById("resultado").innerHTML = "<p>Ocorreu um erro ao carregar os dados.</p>";
        document.getElementById("formApontamento").style.display = "none";
    }
}

function enviarApontamento() {
    // Captura os valores dos campos obrigatórios
    const dataHoraInicial = document.getElementById("dataHoraInicial");
    const dataHoraFinal = document.getElementById("dataHoraFinal");
    const manutentor = document.getElementById("manutentor");
    const centroTrabalho = document.getElementById("centroTrabalho");
    const ordemConcluida = document.getElementById("ordemConcluida");

    // Verifica se algum campo obrigatório está vazio
    if (!dataHoraInicial.value) {
        alert("⚠️ Por favor, preencha a Data e Hora Inicial.");
        dataHoraInicial.focus();
        return;
    }
    if (!dataHoraFinal.value) {
        alert("⚠️ Por favor, preencha a Data e Hora Final.");
        dataHoraFinal.focus();
        return;
    }
    if (!manutentor.value.trim()) {
        alert("⚠️ Por favor, preencha a Identificação do Manutentor.");
        manutentor.focus();
        return;
    }
    if (!centroTrabalho.value) {
        alert("⚠️ Por favor, selecione o Centro de Trabalho.");
        centroTrabalho.focus();
        return;
    }
    if (!ordemConcluida.value) {
        alert("⚠️ Por favor, selecione se a Ordem foi Concluída.");
        ordemConcluida.focus();
        return;
    }

    // Criando o objeto do apontamento
    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: dataHoraInicial.value,
        dataHoraFinal: dataHoraFinal.value,
        manutentor: manutentor.value,
        centroTrabalho: centroTrabalho.value,
        ordemConcluida: ordemConcluida.value,
        observacao: document.getElementById("observacao").value,
        imagem: document.getElementById("imagem").files[0]
    };

    console.log("✅ Dados do Apontamento:", apontamento);
    alert("✅ Apontamento enviado com sucesso!");

    // Se houver uma imagem anexada, criar o link de visualização
    if (apontamento.imagem) {
        const imagemLink = URL.createObjectURL(apontamento.imagem);
        const imagemLinkText = document.getElementById("imagemLinkText");
        imagemLinkText.href = imagemLink;
        document.getElementById("imagemLink").style.display = "block";
    }
}
