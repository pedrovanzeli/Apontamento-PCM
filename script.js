// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAUlxHPDSkSDoiXA4eg5BUW9sRxZfz9GI8",
    authDomain: "apontamento-pcm-2fb0e.firebaseapp.com",
    projectId: "apontamento-pcm-2fb0e",
    storageBucket: "apontamento-pcm-2fb0e.appspot.com", // 🔥 Corrigido o domínio
    messagingSenderId: "359651627373",
    appId: "1:359651627373:web:b7e8e633348c83b5ee0a64"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("✅ Firebase inicializado:", firebase.apps.length > 0);

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

// Função para enviar apontamento
async function enviarParaJotform() {
    // Coleta os dados do formulário com os novos nomes de campo
    const numeroOrdem = document.getElementById("numeroSolicitacao").value;
    const descricaoServico = document.getElementById("descricaoServico").value; // Atualize conforme necessário
    const setor = document.getElementById("setor").value; // Atualize conforme necessário
    const manutentor = document.getElementById("manutentor").value;
    const centroTrabalho = document.getElementById("centroTrabalho").value;
    const ordemConcluida = document.getElementById("ordemConcluida").value;
    const observacoes = document.getElementById("observacao").value;
    const dataHoraInicial = document.getElementById("dataHoraInicial").value;
    const dataHoraFinal = document.getElementById("dataHoraFinal").value;

    // Construindo a URL do Jotform com os novos dados
    const jotformUrl = `https://form.jotform.com/250724680785667?numeroOrdem=${encodeURIComponent(numeroOrdem)}&descricaoServico=${encodeURIComponent(descricaoServico)}&setor=${encodeURIComponent(setor)}&manutentor=${encodeURIComponent(manutentor)}&centroTrabalho=${encodeURIComponent(centroTrabalho)}&ordemConcluida=${encodeURIComponent(ordemConcluida)}&observacoes=${encodeURIComponent(observacoes)}&dataHoraInicial=${encodeURIComponent(dataHoraInicial)}&dataHoraFinal=${encodeURIComponent(dataHoraFinal)}`;

    // Redireciona para o Jotform com os dados
    window.location.href = jotformUrl;
}
