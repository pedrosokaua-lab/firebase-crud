const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Carregar a chave de serviço do Firebase
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);

  // Inicializar o Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  const alunosRef = db.collection("alunos");

  // Função para exibir o menu
  function mostrarMenu() {
    console.log("\n=== MENU CRUD DE ALUNOS ===");
    console.log("1. Cadastrar aluno");
    console.log("2. Listar alunos");
    console.log("3. Atualizar aluno");
    console.log("4. Excluir aluno");
    console.log("5. Listar alunos por turma");
    console.log("6. Listar alunos por data de nascimento");
    console.log("0. Sair");
    console.log("===========================");
  }

  // Função CREATE: Cadastrar aluno
  async function cadastrarAluno() {
    const nome = prompt("Digite o nome do aluno: ");
    const turma = prompt("Digite a turma do aluno: ");
    const nascimento = prompt("Digite a data de nascimento (YYYY-MM-DD): ");

    try {
      await alunosRef.add({
        nome,
        turma,
        nascimento: admin.firestore.Timestamp.fromDate(new Date(nascimento)),
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Aluno cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  }

  // Função READ: Listar alunos
  async function listarAlunos() {
    try {
      const snapshot = await alunosRef.get();
      if (snapshot.empty) {
        console.log("Nenhum aluno encontrado.");
        return;
      }

      console.log("\n--- Lista de Alunos ---");
      snapshot.forEach((doc) => {
        const data = doc.data();
        const nascimentoDate = data.nascimento ? data.nascimento.toDate() : null;
        console.log(`ID: ${doc.id}`);
        console.log(`Nome: ${data.nome}`);
        console.log(`Turma: ${data.turma}`);
        console.log(`Data de nascimento: ${nascimentoDate ? nascimentoDate.toLocaleDateString() : "N/A"}`);
        console.log("---------------------");
      });
    } catch (error) {
      console.error("Erro ao listar alunos:", error);
    }
  }

  // Função UPDATE: Atualizar aluno
  async function atualizarAluno() {
    const id = prompt("Digite o ID do aluno a ser atualizado: ");
    const nome = prompt("Digite o novo nome (ou pressione Enter para manter): ");
    const turma = prompt("Digite a nova turma (ou pressione Enter para manter): ");

    try {
      const updateData = {};
      if (nome) updateData.nome = nome;
      if (turma) updateData.turma = turma;

      await alunosRef.doc(id).update(updateData);
      console.log("Aluno atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    }
  }

  // Função DELETE: Excluir aluno
  async function excluirAluno() {
    const id = prompt("Digite o ID do aluno a ser excluído: ");

    try {
      await alunosRef.doc(id).delete();
      console.log("Aluno excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }

  // Função: Listar alunos por turma
  async function listarAlunosPorTurma() {
    const turma = prompt("Digite o nome da turma: ");

    try {
      const snapshot = await alunosRef.where("turma", "==", turma).get();
      if (snapshot.empty) {
        console.log("Nenhum aluno encontrado nesta turma.");
        return;
      }

      console.log(`\n--- Alunos da turma ${turma} ---`);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const nascimentoDate = data.nascimento ? data.nascimento.toDate() : null;
        console.log(`ID: ${doc.id}`);
        console.log(`Nome: ${data.nome}`);
        console.log(`Data de nascimento: ${nascimentoDate ? nascimentoDate.toLocaleDateString() : "N/A"}`);
        console.log("---------------------");
      });
    } catch (error) {
      console.error("Erro ao listar alunos por turma:", error);
    }
  }

  // Função: Listar alunos por data de nascimento
  async function listarAlunosPorNascimento() {
    const ano = prompt("Digite o ano de nascimento (YYYY): ");

    try {
      // Query para alunos nascidos no ano especificado
      const snapshot = await alunosRef
        .where("nascimento", ">=", admin.firestore.Timestamp.fromDate(new Date(`${ano}-01-01`)))
        .where("nascimento", "<=", admin.firestore.Timestamp.fromDate(new Date(`${ano}-12-31`)))
        .get();

      if (snapshot.empty) {
        console.log("Nenhum aluno encontrado no ano de nascimento especificado.");
        return;
      }

      console.log(`\n--- Alunos nascidos em ${ano} ---`);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const nascimentoDate = data.nascimento.toDate();
        console.log(`ID: ${doc.id}`);
        console.log(`Nome: ${data.nome}`);
        console.log(`Data de nascimento: ${nascimentoDate.toLocaleDateString()}`);
        console.log("---------------------");
      });
    } catch (error) {
      console.error("Erro ao listar alunos por data de nascimento:", error);
    }
  }

  // Loop principal do menu
  async function main() {
    let opcao;

    do {
      mostrarMenu();
      opcao = prompt("Escolha uma opção: ");

      switch (opcao) {
        case "1":
          await cadastrarAluno();
          break;
        case "2":
          await listarAlunos();
          break;
        case "3":
          await atualizarAluno();
          break;
        case "4":
          await excluirAluno();
          break;
        case "5":
          await listarAlunosPorTurma();
          break;
        case "6":
          await listarAlunosPorNascimento();
          break;
        case "0":
          console.sair = "Saindo do aplicativo...";
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
      }
    } while (opcao !== "0");
  }

  // Executar o aplicativo
  main().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error("Erro inesperado:", error);
    process.exit(1);
  });
} else {
  console.error("Arquivo serviceAccountKey.json não encontrado!");
  console.error(
    "Por favor, baixe a chave de serviço do console do Firebase e salve-o como serviceAccountKey.json neste diretório."
  );
  console.error(
    "1. Acesse https://console.firebase.google.com/"
  );
  console.error("2. Vá para Configurações > Contas de serviço");
  console.error("3. Gere uma nova chave privada");
  console.error("4. Salve o arquivo JSON como serviceAccountKey.json");
}