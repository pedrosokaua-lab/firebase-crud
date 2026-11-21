/**
 * Testa a conexão com o Firebase usando o Firebase Admin SDK.
 * Uso: node testar-conexao.js
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

(async () => {
  console.log("Projeto: " + credenciais.project_id);
  console.log("Testando conexao com o Firestore...");

  const snapshot = await db.collection("alunos").limit(1).get();
  console.log("Conexao OK! A colecao 'alunos' respondeu (documentos na amostra: " + snapshot.size + ").");
  process.exit(0);
})().catch((erro) => {
  console.error("FALHA NA CONEXAO: " + erro.message);

  if (/5 NOT_FOUND|does not exist|NOT_FOUND/i.test(erro.message)) {
    console.error(
      "Dica: o banco Firestore ainda nao foi criado. No console do Firebase, va em Build > Firestore Database > Criar banco de dados."
    );
  } else if (/invalid_grant|private key|UNAUTHENTICATED/i.test(erro.message)) {
    console.error("Dica: baixe um novo serviceAccountKey.json no console do Firebase.");
  } else if (/ENOTFOUND|EAI_AGAIN|getaddrinfo|ETIMEDOUT/i.test(erro.message)) {
    console.error("Dica: verifique sua conexao com a internet.");
  }

  process.exit(1);
});
