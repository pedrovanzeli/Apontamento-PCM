async function enviarApontamento() {
    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: document.getElementById("dataHoraInicial").value,
        dataHoraFinal: document.getElementById("dataHoraFinal").value,
        manutentor: document.getElementById("manutentor").value,
        centroTrabalho: document.getElementById("centroTrabalho").value,
        observacao: document.getElementById("observacao").value,
        imagem: document.getElementById("imagem").files[0] ? document.getElementById("imagem").files[0].name : '' // Se você quiser enviar o nome da imagem
    };

    const url = "URL_DO_SEU_GOOGLE_APPS_SCRIPT"; // Substitua pela URL do seu Google Apps Script
    const options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(apontamento)
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.result === "success") {
            alert("Apontamento enviado com sucesso!");
        } else {
            alert("Erro ao enviar apontamento.");
        }
    } catch (error) {
        console.error('Erro ao enviar apontamento:', error);
        alert("Erro ao enviar apontamento.");
    }
}
