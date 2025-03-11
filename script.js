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
                if (!header.includes("Ordem Concluída") && !header.includes("Data de Submissão") && solicitacao[index]) {
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
        document.getElementById("formApontamento").style.display = "none";
    }
}
async function enviarApontamento() {
    const agora = new Date();
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

    if (campoInvalido) return;

    const dataHoraFinal = new Date(document.getElementById("dataHoraFinal").value);
    if (dataHoraFinal > agora) {
        alert("⚠️ A Data e Hora Final não pode ser maior que o momento atual.");
        document.getElementById("dataHoraFinal").style.border = "2px solid red";
        document.getElementById("dataHoraFinal").focus();
        return;
    }

    // Captura os dados do formulário
    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: document.getElementById("dataHoraInicial").value,
        dataHoraFinal: document.getElementById("dataHoraFinal").value,
        manutentor: document.getElementById("manutentor").value,
        centroTrabalho: document.getElementById("centroTrabalho").value,
        ordemConcluida: document.getElementById("ordemConcluida").value,
        observacao: document.getElementById("observacao").value
    };

    // Verifica se há imagem anexada
    const imagemInput = document.getElementById("imagem");
    if (imagemInput.files.length > 0) {
        const imagem = imagemInput.files[0];
        const formData = new FormData();
        formData.append("file", imagem);

        try {
            const uploadResponse = await fetch("https://api.imgbb.com/1/upload?key=SUA_CHAVE_IMGBB", {
                method: "POST",
                body: formData
            });

            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
                apontamento.imagemLink = uploadResult.data.url;
            } else {
                apontamento.imagemLink = "Erro no upload";
            }
        } catch (error) {
            console.error("Erro no upload da imagem:", error);
            apontamento.imagemLink = "Erro no upload";
        }
    }

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwDATDbe5NHQryzbpbUXpFmFv5E0sw67H8LcAu9YAPKdfTsouOUW-9G7jKeEZ9izBOPWA/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apontamento)
        });

        const result = await response.json();
        if (result.status === "sucesso") {
            alert("✅ Apontamento enviado com sucesso!");
            document.getElementById("formApontamento").reset();
        } else {
            alert("❌ Erro ao enviar o apontamento: " + result.mensagem);
        }
    } catch (error) {
        console.error("Erro ao enviar apontamento:", error);
        alert("❌ Erro ao enviar os dados.");
    }
}

