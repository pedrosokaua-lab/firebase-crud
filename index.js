/**
 * ============================================================
 *  CRUD de Alunos - Firebase Admin SDK
 *  Menu interativo no terminal (Node.js puro)
 *
 *  Requisitos atendidos:
 *  - CREATE: cadastrar aluno          (opção 1)
 *  - READ:   listar alunos            (opção 2)
 *  - UPDATE: atualizar aluno          (opção 3)
 *  - DELETE: excluir aluno            (opção 4)
 *  - Consulta por turma               (opção 5)
 *  - Consulta por data de nascimento  (opção 6)
 *
 *  Uso:
 *    npm install
 *    node index.js
 * ============================================================
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

// Caminho do arquivo de credenciais (NUNCA versionar este arquivo)
const CAMINHO_CHAVE = path.join(__dirname, "serviceAccountKey.json");

function falhar(mensagem) {
  console.error("\nERRO: " + mensagem + "\n");
  process.exit(1);
}

// ---------- Validação das credenciais ----------
if (!fs.existsSync(CAMINHO_CHAVE)) {
  falhar(
    "Arquivo serviceAccountKey.json nao encontrado.\n" +
      "Baixe a chave em: Console do Firebase > Configuracoes do projeto > Contas de servico > Gerar nova chave privada.\n" +
      "Salve o arquivo como serviceAccountKey.json nesta pasta:\n" +
      __dirname
  );
}

let credenciais;
try {
  credenciais = JSON.parse(fs.readFileSync(CAMINHO_CHAVE, "utf8"));
} catch (erro) {
  falhar(
    "Nao foi possivel ler o serviceAccountKey.json (" +
      erro.message +
      ").\nBaixe a chave novamente no console do Firebase."
  );
}

if (!credenciais.project_id || !credenciais.client_email || !credenciais.private_key) {
  falhar(
    "serviceAccountKey.json invalido: faltam os campos project_id, client_email ou private_key.\n" +
      "Baixe a chave novamente no console do Firebase."
  );
}

// ---------- Conexão com o Firebase (Admin SDK) ----------
admin.initializeApp({
  credential: admin.credential.cert(credenciais),
});

const db = admin.firestore();
const alunosRef = db.collection("alunos");

// ---------- Entrada do usuário (readline, funciona no Node.js) ----------
const rl = readline.createInterface({ input, output });
const perguntar = async (texto) => (await rl.question(texto)).trim();

const TURMAS_SUGERIDAS = ["1º Ano A", "1º Ano B", "2º Ano A", "2º Ano B", "3º Ano A"];

// ---------- Funções auxiliares ----------
function formatarData(valor) {
  if (!valor) return "N/A";
  try {
    const data = valor.toDate ? valor.toDate() : new Date(valor);
    if (Number.isNaN(data.getTime())) return "N/A";
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch {
    return "N/A";
  }
}

// Aceita AAAA-MM-DD ou DD/MM/AAAA
function converterData(texto) {
  if (!texto) return null;
  const t = texto.trim();

  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));

  m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));

  return null;
}

// Traduz erros comuns do Firebase para dicas úteis
function explicarErro(erro) {
  const msg = erro && erro.message ? erro.message : String(erro);

  if (/5 NOT_FOUND|does not exist|NOT_FOUND/i.test(msg)) {
    return (
      msg +
      "\nDica: o banco Firestore ainda nao foi criado. No console do Firebase va em Build > Firestore Database > Criar banco de dados."
    );
  }
  if (/invalid_grant|private key|UNAUTHENTICATED|Invalid JWT/i.test(msg)) {
    return msg + "\nDica: baixe um novo serviceAccountKey.json no console do Firebase.";
  }
  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo|ETIMEDOUT|ECONNREFUSED/i.test(msg)) {
    return msg + "\nDica: verifique sua conexao com a internet.";
  }
  if (/PERMISSION_DENIED/i.test(msg)) {
    return msg + "\nDica: confira se a chave pertence ao mesmo projeto do console.";
  }
  return msg;
}

async function registrarErro(erro) {
  console.error("\nERRO: " + explicarErro(erro));
}

function exibirAluno(doc) {
  const dados = doc.data();
  console.log("--------------------------------------------------");
  console.log("  ID:         " + doc.id);
  console.log("  Nome:       " + (dados.nome || ""));
  console.log("  Turma:      " + (dados.turma || ""));
  console.log("  Nascimento: " + formatarData(dados.nascimento));
}

function exibirLista(snapshot, titulo) {
  if (snapshot.empty) {
    console.log("\n" + titulo);
    console.log("Nenhum aluno encontrado.");
    return;
  }
  console.log("\n" + titulo + " (" + snapshot.size + " aluno(s))");
  snapshot.forEach(exibirAluno);
  console.log("--------------------------------------------------");
}

// ---------- CREATE: cadastrar aluno ----------
async function cadastrarAluno() {
  console.log("\n--- Cadastrar aluno ---");
  const nome = await perguntar("Nome: ");
  if (!nome) {
    console.log("Cadastro cancelado: o nome e obrigatorio.");
    return;
  }

  console.log("Turmas de exemplo: " + TURMAS_SUGERIDAS.join(" | "));
  const turma = await perguntar("Turma: ");
  if (!turma) {
    console.log("Cadastro cancelado: a turma e obrigatoria.");
    return;
  }

  const nascimentoTexto = await perguntar("Data de nascimento (AAAA-MM-DD ou DD/MM/AAAA): ");
  const nascimento = converterData(nascimentoTexto);
  if (!nascimento) {
    console.log("Cadastro cancelado: data invalida. Use AAAA-MM-DD ou DD/MM/AAAA.");
    return;
  }

  try {
    const referencia = await alunosRef.add({
      nome,
      turma,
      nascimento: admin.firestore.Timestamp.fromDate(nascimento),
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("\nAluno cadastrado com sucesso! ID: " + referencia.id);
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- READ: listar alunos ----------
async function listarAlunos() {
  console.log("\n--- Lista de alunos ---");
  try {
    const snapshot = await alunosRef.orderBy("nome").get();
    exibirLista(snapshot, "Alunos cadastrados");
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- UPDATE: atualizar aluno ----------
async function atualizarAluno() {
  console.log("\n--- Atualizar aluno ---");
  try {
    const snapshot = await alunosRef.orderBy("nome").get();
    if (snapshot.empty) {
      console.log("Nenhum aluno cadastrado para atualizar.");
      return;
    }
    exibirLista(snapshot, "Alunos disponiveis");

    const id = await perguntar("Digite o ID do aluno que deseja atualizar: ");
    if (!id) {
      console.log("Atualizacao cancelada.");
      return;
    }

    const referencia = alunosRef.doc(id);
    const atual = await referencia.get();
    if (!atual.exists) {
      console.log("Nenhum aluno encontrado com o ID informado.");
      return;
    }

    const dadosAtuais = atual.data();
    console.log("Deixe em branco para manter o valor atual.");

    const nome = await perguntar("Novo nome [" + (dadosAtuais.nome || "") + "]: ");
    const turma = await perguntar("Nova turma [" + (dadosAtuais.turma || "") + "]: ");
    const nascimentoTexto = await perguntar(
      "Nova data de nascimento [" + formatarData(dadosAtuais.nascimento) + "]: "
    );

    const alteracoes = {};
    if (nome) alteracoes.nome = nome;
    if (turma) alteracoes.turma = turma;

    if (nascimentoTexto) {
      const nascimento = converterData(nascimentoTexto);
      if (!nascimento) {
        console.log("Atualizacao cancelada: data invalida.");
        return;
      }
      alteracoes.nascimento = admin.firestore.Timestamp.fromDate(nascimento);
    }

    if (Object.keys(alteracoes).length === 0) {
      console.log("Nada foi alterado.");
      return;
    }

    alteracoes.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
    await referencia.update(alteracoes);
    console.log("\nAluno atualizado com sucesso!");
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- DELETE: excluir aluno ----------
async function excluirAluno() {
  console.log("\n--- Excluir aluno ---");
  try {
    const snapshot = await alunosRef.orderBy("nome").get();
    if (snapshot.empty) {
      console.log("Nenhum aluno cadastrado para excluir.");
      return;
    }
    exibirLista(snapshot, "Alunos disponiveis");

    const id = await perguntar("Digite o ID do aluno que deseja excluir: ");
    if (!id) {
      console.log("Exclusao cancelada.");
      return;
    }

    const referencia = alunosRef.doc(id);
    const atual = await referencia.get();
    if (!atual.exists) {
      console.log("Nenhum aluno encontrado com o ID informado.");
      return;
    }

    const dados = atual.data();
    const confirmacao = await perguntar(
      'Confirmar exclusao de "' + (dados.nome || id) + '"? (s/N): '
    );
    if (confirmacao.toLowerCase() !== "s") {
      console.log("Exclusao cancelada.");
      return;
    }

    await referencia.delete();
    console.log("\nAluno excluido com sucesso!");
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- CONSULTA: por turma ----------
async function consultarPorTurma() {
  console.log("\n--- Consultar alunos por turma ---");
  console.log("Turmas usadas no cadastro: " + TURMAS_SUGERIDAS.join(" | "));
  const turma = await perguntar("Turma: ");
  if (!turma) {
    console.log("Consulta cancelada.");
    return;
  }

  try {
    const snapshot = await alunosRef.where("turma", "==", turma).get();
    exibirLista(snapshot, 'Alunos da turma "' + turma + '"');
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- CONSULTA: por data de nascimento ----------
async function consultarPorNascimento() {
  console.log("\n--- Consultar alunos por data de nascimento ---");
  console.log("  1 - Buscar por ano (ex.: 2008)");
  console.log("  2 - Buscar por data exata (ex.: 2008-06-09)");
  const modo = await perguntar("Opcao: ");

  try {
    if (modo === "1") {
      const anoTexto = await perguntar("Ano (AAAA): ");
      if (!/^\d{4}$/.test(anoTexto)) {
        console.log("Ano invalido.");
        return;
      }
      const ano = Number(anoTexto);
      const inicio = admin.firestore.Timestamp.fromDate(new Date(Date.UTC(ano, 0, 1)));
      const fim = admin.firestore.Timestamp.fromDate(
        new Date(Date.UTC(ano, 11, 31, 23, 59, 59))
      );
      const snapshot = await alunosRef
        .where("nascimento", ">=", inicio)
        .where("nascimento", "<=", fim)
        .get();
      exibirLista(snapshot, "Alunos nascidos em " + ano);
      return;
    }

    if (modo === "2") {
      const texto = await perguntar("Data (AAAA-MM-DD ou DD/MM/AAAA): ");
      const data = converterData(texto);
      if (!data) {
        console.log("Data invalida.");
        return;
      }
      const inicio = admin.firestore.Timestamp.fromDate(data);
      const fim = admin.firestore.Timestamp.fromDate(
        new Date(data.getTime() + 24 * 60 * 60 * 1000 - 1000)
      );
      const snapshot = await alunosRef
        .where("nascimento", ">=", inicio)
        .where("nascimento", "<=", fim)
        .get();
      exibirLista(snapshot, "Alunos nascidos em " + formatarData(inicio));
      return;
    }

    console.log("Opcao invalida.");
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- DADOS FICTÍCIOS (demo) ----------
async function popularDadosFicticios() {
  console.log("\n--- Popular com dados ficticios ---");
  const confirmacao = await perguntar(
    "Isso adiciona/atualiza 6 alunos de exemplo. Continuar? (s/N): "
  );
  if (confirmacao.toLowerCase() !== "s") {
    console.log("Operacao cancelada.");
    return;
  }

  const alunos = [
    { id: "aluno-001", nome: "Ana Beatriz Souza", turma: "1º Ano A", nascimento: "2009-03-12" },
    { id: "aluno-002", nome: "Bruno Carvalho Lima", turma: "1º Ano A", nascimento: "2009-07-25" },
    { id: "aluno-003", nome: "Camila Ferreira Rocha", turma: "1º Ano B", nascimento: "2009-11-03" },
    { id: "aluno-004", nome: "Diego Martins Alves", turma: "2º Ano A", nascimento: "2008-01-18" },
    { id: "aluno-005", nome: "Elisa Nogueira Prado", turma: "2º Ano A", nascimento: "2008-06-09" },
    { id: "aluno-006", nome: "Felipe Ramos Teixeira", turma: "2º Ano B", nascimento: "2008-12-21" },
  ];

  try {
    const lote = db.batch();
    for (const aluno of alunos) {
      const data = converterData(aluno.nascimento);
      lote.set(alunosRef.doc(aluno.id), {
        nome: aluno.nome,
        turma: aluno.turma,
        nascimento: admin.firestore.Timestamp.fromDate(data),
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await lote.commit();
    console.log("\n6 alunos ficticios cadastrados com sucesso!");
  } catch (erro) {
    await registrarErro(erro);
  }
}

// ---------- Menu principal ----------
function exibirMenu() {
  console.log("\n==================================================");
  console.log("              MENU CRUD DE ALUNOS");
  console.log("==================================================");
  console.log("  1 - Cadastrar aluno");
  console.log("  2 - Listar alunos");
  console.log("  3 - Atualizar aluno");
  console.log("  4 - Excluir aluno");
  console.log("  5 - Consultar por turma");
  console.log("  6 - Consultar por data de nascimento");
  console.log("  7 - Popular com dados ficticios (demo)");
  console.log("  0 - Sair");
  console.log("==================================================");
}

async function principal() {
  console.log("Conectado ao projeto Firebase: " + credenciais.project_id);

  let opcao;
  do {
    exibirMenu();
    opcao = await perguntar("Escolha uma opcao: ");

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
        await consultarPorTurma();
        break;
      case "6":
        await consultarPorNascimento();
        break;
      case "7":
        await popularDadosFicticios();
        break;
      case "0":
        console.log("\nSaindo... Ate logo!");
        break;
      default:
        console.log("\nOpcao invalida. Tente novamente.");
    }
  } while (opcao !== "0");
}

principal()
  .catch((erro) => {
    // Entrada encerrada (Ctrl+D ou pipe): sair sem mensagem de erro
    if (/readline was closed|ERR_USE_AFTER_CLOSE/i.test(erro.message || "")) {
      console.log("\nEncerrando...");
      return;
    }
    registrarErro(erro);
  })
  .finally(() => rl.close());
