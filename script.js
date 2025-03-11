async function buscarSolicitacao() {
    const numeroSolicitacao = document.getElementById("numeroSolicitacao").value.trim();
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjHfFEDNbyJxmtlGysOJb3i35Oq217kDCjU8_4pGVpzMFeOA-qtbC2vV2d_4YG_tR9bcaTue2tr39M/pub?output=csv";
    
    try {
        const response = await fetch(url);
        const data = await response.text();
        
        // Processamento do CSV garantindo que colunas com vírgulas entre aspas sejam tratadas corretamente
        const rows = data.split("\n").map(row => row.match(/(?:"([^"]*)")|([^,]+)/g)?.map(cell => cell.replace(/"/g, '').trim()));
        
        if (!rows || rows.length < 2) {
            throw new Error("Formato do CSV inválido");
        }
        
        const headers = rows[0];
        const solicitacao = rows.find(row => row[1] && row[1].trim() === numeroSolicitacao);
        
        if (solicitacao) {
            let html = "<h3>Detalhes da Solicitação</h3><ul>";
            
            headers.forEach((header, index) => {
                const valor = solicitacao[index] ? solicitacao[index].trim() : "";
                
                if (!header.includes("Ordem Concluída") && 
                    !header.includes("Submission Date") && 
                    (!header.includes("LOCAL DE INSTALAÇÃO/EQUIPAMENTO") || valor !== "")) {
                    html += `<li><strong>${header}:</strong> ${valor}</li>`;
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
        console.error("Erro ao buscar os dados:", error);
        document.getElementById("resultado").innerHTML = "<p>Erro ao buscar os dados. Tente novamente mais tarde.</p>";
    }
}

function limparTudo() {
    document.getElementById("numeroSolicitacao").value = "";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("formApontamento").style.display = "none";
    document.getElementById("dataHoraInicial").value = "";
    document.getElementById("dataHoraFinal").value = "";
    document.getElementById("manutentor").value = "";
    document.getElementById("centroTrabalho").value = "Eletrica";
    document.getElementById("observacao").value = "";
    document.getElementById("imagem").value = "";
}

function enviarApontamento() {
    const dataHoraInicial = document.getElementById("dataHoraInicial").value;
    const dataHoraFinal = document.getElementById("dataHoraFinal").value;
    const manutentor = document.getElementById("manutentor").value;
    const centroTrabalho = document.getElementById("centroTrabalho").value;
    const ordemConcluida = document.getElementById("ordemConcluida").value;
    
    const campos = [
        { id: "dataHoraInicial", value: dataHoraInicial },
        { id: "dataHoraFinal", value: dataHoraFinal },
        { id: "manutentor", value: manutentor },
        { id: "centroTrabalho", value: centroTrabalho }
    ];

    let erro = false;

    // Verifica se os campos obrigatórios estão preenchidos e marca com borda vermelha se não estiverem
    campos.forEach(campo => {
        const element = document.getElementById(campo.id);
        if (!campo.value) {
            element.style.borderColor = "red";
            erro = true;
        } else {
            element.style.borderColor = "";
        }
    });

    // Se houver erro, não envia o apontamento
    if (erro) {
        alert("Todos os campos obrigatórios devem ser preenchidos.");
        return;
    }

    // Validando a data final para não ser maior que a data atual
    const dataHoraAtual = new Date().toISOString().slice(0, 16); // Formato: "YYYY-MM-DDTHH:MM"
    if (dataHoraFinal > dataHoraAtual) {
        alert("A data e hora final não pode ser maior que a data e hora atual.");
        return;
    }

    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: dataHoraInicial,
        dataHoraFinal: dataHoraFinal,
        manutentor: manutentor,
        centroTrabalho: centroTrabalho,
        ordemConcluida: ordemConcluida,
        observacao: document.getElementById("observacao").value,
        imagem: document.getElementById("imagem").files[0]
    };

    console.log("Dados do Apontamento:", apontamento);
    alert("Apontamento enviado com sucesso!");
}
