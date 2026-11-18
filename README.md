# Firebase CRUD com Admin SDK

## Descrição
Aplicação de linha de comando para operações CRUD (Create, Read, Update, Delete) no Firestore do Firebase, com consultas por turma e data de nascimento.

## Configuração do Firebase

1. Acesse https://console.firebase.google.com/
2. Crie um novo projeto Firebase
3. No console, vá em "Firestore Database" e crie um banco de dados
4. Baixe a chave de serviço (Service Account Key):
   - Vá em Configurações (ícone de engrenagem) > Contas de serviço
   - Clique em "Gerar nova chave privada"
   - Salve o arquivo JSON como `serviceAccountKey.json` neste diretório


1. Instale as dependências:
   ```
   npm install
   ```

2. Execute a aplicação:
   ```
   node index.js
   ```

3. Siga o menu no terminal:
   - 1: Cadastrar aluno
   - 2: Listar alunos
   - 3: Atualizar aluno
   - 4: Excluir aluno
   - 5: Listar alunos por turma
   - 6: Listar alunos por data de nascimento
   - 0: Sair

## Estrutura de dados do Firestore

A coleção "alunos" contém documentos com o seguinte estrutura:
- nome: string
- turma: string
- nascimento: timestamp (data de nascimento)
- criadoEm: timestamp (data de criação)
