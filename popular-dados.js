/**
 * Cadastra alunos fictícios de exemplo no Firestore.
 * Uso: node popular-dados.js
 *
 * Os IDs sao fixos (aluno-001 ... aluno-006), entao rodar
 * novamente apenas atualiza os mesmos registros (nao duplica).
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const chavePath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(chavePath)) {
  console.error("ERRO: serviceAccountKey.json nao encontrado nesta pasta.");
  process.exit(1);
}

let credenciais;
try {
  credenciais = JSON.parse(fs.readFileSync(chavePath, "utf8"));
} catch (erro) {
  console.error("ERRO: nao foi possivel ler o serviceAccountKey.json (" + erro.message + ").");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(credenciais) });
const db = admin.firestore();
const alunosRef = db.collection("alunos");

const alunos = [
  { id: "aluno-001", nome: "Ana Beatriz Souza", turma: "1º Ano A", nascimento: "2009-03-12" },
  { id: "aluno-002", nome: "Bruno Carvalho Lima", turma: "1º Ano A", nascimento: "2009-07-25" },
  { id: "aluno-003", nome: "Camila Ferreira Rocha", turma: "1º Ano B", nascimento: "2009-11-03" },
  { id: "aluno-004", nome: "Diego Martins Alves", turma: "2º Ano A", nascimento: "2008-01-18" },
  { id: "aluno-005", nome: "Elisa Nogueira Prado", turma: "2º Ano A", nascimento: "2008-06-09" },
  { id: "aluno-006", nome: "Felipe Ramos Teixeira", turma: "2º Ano B", nascimento: "2008-12-21" },
];

function converterData(texto) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia));
}

(async () => {
  console.log("Projeto: " + credenciais.project_id);
  const lote = db.batch();

  for (const aluno of alunos) {
    lote.set(alunosRef.doc(aluno.id), {
      nome: aluno.nome,
      turma: aluno.turma,
      nascimento: admin.firestore.Timestamp.fromDate(converterData(aluno.nascimento)),
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await lote.commit();
  console.log(alunos.length + " alunos ficticios cadastrados com sucesso na colecao 'alunos'.");
  process.exit(0);
})().catch((erro) => {
  console.error("ERRO ao cadastrar dados de exemplo: " + erro.message);
  console.error("Verifique se o Firestore Database foi criado no console do Firebase.");
  process.exit(1);
});
