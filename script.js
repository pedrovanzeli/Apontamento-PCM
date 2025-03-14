// Importações do Firebase Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAUlxHPDSkSDoiXA4eg5BUW9sRxZfz9GI8",
    authDomain: "apontamento-pcm-2fb0e.firebaseapp.com",
    projectId: "apontamento-pcm-2fb0e",
    storageBucket: "apontamento-pcm-2fb0e.appspot.com",
    messagingSenderId: "359651627373",
    appId: "1:359651627373:web:b7e8e633348c83b5ee0a64"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("✅ Firebase inicializado com sucesso!");

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
async function enviarApontamento() {
    const apontamento = {
        numeroSolicitacao: document.getElementById("numeroSolicitacao").value,
        dataHoraInicial: document.getElementById("dataHoraInicial").value,
        dataHoraFinal: document.getElementById("dataHoraFinal").value,
        manutentor: document.getElementById("manutentor").value,
        centroTrabalho: document.getElementById("centroTrabalho").value,
        ordemConcluida: document.getElementById("ordemConcluida").value,
        observacao: document.getElementById("observacao").value
    };

    try {
        await addDoc(collection(db, "apontamentos"), apontamento);
        alert("✅ Apontamento enviado com sucesso!");
        document.getElementById("formApontamento").reset();
    } catch (error) {
        console.error("❌ Erro ao enviar apontamento:", error);
        alert("❌ Erro ao enviar os dados.");
    }
}

// 🔥 Expõe as funções para o HTML
window.buscarSolicitacao = buscarSolicitacao;
window.enviarApontamento = enviarApontamento;
