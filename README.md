# CRUD de Alunos com Firebase Admin SDK

Projeto da atividade: criar projeto no Firebase, habilitar o Firestore, configurar a conexão com o Firebase Admin SDK e implementar operações CRUD de alunos com **menu no terminal**, incluindo consultas por turma e por data de nascimento.

## Requisitos atendidos

| Requisito da atividade | Onde está |
|---|---|
| Criar projeto no Firebase e habilitar o Firestore | Projeto `crud-alunos-5c785`, Firestore ativo |
| Configurar conexão com o Firebase Admin SDK | `index.js` (`admin.initializeApp` + `serviceAccountKey.json`) |
| **CREATE** – cadastrar aluno | Opção 1 do menu |
| **READ** – listar alunos | Opção 2 do menu |
| **UPDATE** – atualizar aluno | Opção 3 do menu |
| **DELETE** – excluir aluno | Opção 4 do menu |
| Consulta por turma | Opção 5 do menu |
| Consulta por data de nascimento | Opção 6 do menu (por ano ou data exata) |
| Menu no terminal | `index.js` |
| Dados fictícios | Opção 7 e `popular-dados.js` |
| Não publicar `serviceAccountKey.json` | `.gitignore` |

## Arquivos do projeto

| Arquivo | Função |
|---|---|
| `index.js` | Aplicação principal: menu CRUD no terminal (usa `readline`, funciona no Node.js) |
| `testar-conexao.js` | Testa a conexão com o Firestore e mostra erros comuns |
| `popular-dados.js` | Cadastra 6 alunos fictícios de exemplo |
| `web-crud.html` | Interface web opcional (Firebase Client SDK) |
| `package.json` | Dependências (`firebase-admin`, `@google-cloud/firestore`) |
| `.gitignore` | Impede o envio de `serviceAccountKey.json` e `node_modules/` ao GitHub |
| `serviceAccountKey.json` | Chave de serviço do Firebase (**arquivo local, nunca versionar**) |

## Executando no terminal

1. Instale as dependências (apenas na primeira vez):

   ```bash
   npm install
   ```

2. Teste a conexão (opcional):

   ```bash
   node testar-conexao.js
   ```

3. Se quiser popular com alunos fictícios:

   ```bash
   node popular-dados.js
   ```

4. Abra o menu:

   ```bash
   node index.js
   ```

## Menu disponível

```
==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
```

### Exemplos de uso

- **Cadastrar (1):** informe nome, turma (ex.: `1º Ano A`) e nascimento (`2009-03-12` ou `12/03/2009`).
- **Listar (2):** mostra todos os alunos da coleção `alunos` com ID, nome, turma e nascimento.
- **Atualizar (3):** informe o ID shown na listagem e os novos valores (deixe em branco para manter).
- **Excluir (4):** informe o ID e confirme com `s`.
- **Consultar por turma (5):** busca exata, ex.: `1º Ano A`.
- **Consultar por nascimento (6):** opção 1 = ano inteiro (ex.: `2008`); opção 2 = data exata (ex.: `2008-06-09`).

## Estrutura de dados no Firestore

Coleção: `alunos`

| Campo | Tipo | Descrição |
|---|---|---|
| `nome` | string | Nome do aluno |
| `turma` | string | Turma do aluno |
| `nascimento` | timestamp | Data de nascimento |
| `criadoEm` | timestamp | Data de criação (automática) |
| `atualizadoEm` | timestamp | Data da última atualização (quando aplicável) |

## Versão web (opcional)

O arquivo `web-crud.html` usa o **Firebase Client SDK**. Para usá-lo:

1. No console do Firebase, vá em **Configurações do projeto > Aplicativos da web > `</>`** e registre um aplicativo.
2. Copie o objeto `firebaseConfig` e cole no topo do `<script>` do `web-crud.html` (substituindo os valores de exemplo).
3. No **Firestore Database > Regras**, publique regras de teste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> O Admin SDK (terminal) **não** usa essas regras: a chave de serviço já tem acesso administrativo. As regras são necessárias apenas para a versão web.

## Prints do funcionamento

Capturas reais do terminal com dados ficticios no Firestore (projeto crud-alunos-5c785).

### PRINT 1 - Menu principal

Comando executado: node index.js

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
Saindo... Ate logo!
```

### PRINT 2 - CREATE: cadastrar aluno

Opcao 1 -> nome, turma e data de nascimento

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Cadastrar aluno ---
Nome: Turmas de exemplo: 1º Ano A | 1º Ano B | 2º Ano A | 2º Ano B | 3º Ano A
Turma: Data de nascimento (AAAA-MM-DD ou DD/MM/AAAA): 
Aluno cadastrado com sucesso! ID: o5E4SPfnsl4jtqm7151z

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================

Encerrando...
```

### PRINT 3 - READ: listar alunos

Opcao 2

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Lista de alunos ---

Alunos cadastrados (7 aluno(s))
--------------------------------------------------
  ID:         aluno-001
  Nome:       Ana Beatriz Souza
  Turma:      1º Ano A
  Nascimento: 12/03/2009
--------------------------------------------------
  ID:         aluno-002
  Nome:       Bruno Carvalho Lima
  Turma:      1º Ano A
  Nascimento: 25/07/2009
--------------------------------------------------
  ID:         aluno-003
  Nome:       Camila Ferreira Rocha
  Turma:      1º Ano B
  Nascimento: 03/11/2009
--------------------------------------------------
  ID:         aluno-004
  Nome:       Diego Martins Alves
  Turma:      2º Ano A
  Nascimento: 18/01/2008
--------------------------------------------------
  ID:         aluno-005
  Nome:       Elisa Nogueira Prado
  Turma:      2º Ano A
  Nascimento: 09/06/2008
--------------------------------------------------
  ID:         aluno-006
  Nome:       Felipe Ramos Teixeira
  Turma:      2º Ano B
  Nascimento: 21/12/2008
--------------------------------------------------
  ID:         o5E4SPfnsl4jtqm7151z
  Nome:       Gustavo Almeida
  Turma:      3 Ano A
  Nascimento: 14/09/2008
--------------------------------------------------

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================

Encerrando...
```

### PRINT 4 - Consulta por turma

Opcao 5 -> turma: 1º Ano A

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Consultar alunos por turma ---
Turmas usadas no cadastro: 1º Ano A | 1º Ano B | 2º Ano A | 2º Ano B | 3º Ano A
Turma: 
Alunos da turma "1º Ano A" (2 aluno(s))
--------------------------------------------------
  ID:         aluno-001
  Nome:       Ana Beatriz Souza
  Turma:      1º Ano A
  Nascimento: 12/03/2009
--------------------------------------------------
  ID:         aluno-002
  Nome:       Bruno Carvalho Lima
  Turma:      1º Ano A
  Nascimento: 25/07/2009
--------------------------------------------------

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================

Encerrando...
```

### PRINT 5 - Consulta por data de nascimento

Opcao 6 -> opcao 1 -> ano: 2008

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Consultar alunos por data de nascimento ---
  1 - Buscar por ano (ex.: 2008)
  2 - Buscar por data exata (ex.: 2008-06-09)
Opcao: Ano (AAAA): 
Alunos nascidos em 2008 (4 aluno(s))
--------------------------------------------------
  ID:         aluno-004
  Nome:       Diego Martins Alves
  Turma:      2º Ano A
  Nascimento: 18/01/2008
--------------------------------------------------
  ID:         aluno-005
  Nome:       Elisa Nogueira Prado
  Turma:      2º Ano A
  Nascimento: 09/06/2008
--------------------------------------------------
  ID:         o5E4SPfnsl4jtqm7151z
  Nome:       Gustavo Almeida
  Turma:      3 Ano A
  Nascimento: 14/09/2008
--------------------------------------------------
  ID:         aluno-006
  Nome:       Felipe Ramos Teixeira
  Turma:      2º Ano B
  Nascimento: 21/12/2008
--------------------------------------------------

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================

Encerrando...
```

### PRINT 6 - UPDATE: atualizar aluno

Opcao 3 -> ID do aluno -> novos dados

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Atualizar aluno ---

Alunos disponiveis (7 aluno(s))
--------------------------------------------------
  ID:         aluno-001
  Nome:       Ana Beatriz Souza
  Turma:      1º Ano A
  Nascimento: 12/03/2009
--------------------------------------------------
  ID:         aluno-002
  Nome:       Bruno Carvalho Lima
  Turma:      1º Ano A
  Nascimento: 25/07/2009
--------------------------------------------------
  ID:         aluno-003
  Nome:       Camila Ferreira Rocha
  Turma:      1º Ano B
  Nascimento: 03/11/2009
--------------------------------------------------
  ID:         aluno-004
  Nome:       Diego Martins Alves
  Turma:      2º Ano A
  Nascimento: 18/01/2008
--------------------------------------------------
  ID:         aluno-005
  Nome:       Elisa Nogueira Prado
  Turma:      2º Ano A
  Nascimento: 09/06/2008
--------------------------------------------------
  ID:         aluno-006
  Nome:       Felipe Ramos Teixeira
  Turma:      2º Ano B
  Nascimento: 21/12/2008
--------------------------------------------------
  ID:         o5E4SPfnsl4jtqm7151z
  Nome:       Gustavo Almeida
  Turma:      3 Ano A
  Nascimento: 14/09/2008
--------------------------------------------------
Digite o ID do aluno que deseja atualizar: Nenhum aluno encontrado com o ID informado.

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
Saindo... Ate logo!
```

### PRINT 7 - DELETE: excluir aluno

Opcao 4 -> ID do aluno -> confirmacao com s

```text
Conectado ao projeto Firebase: crud-alunos-5c785

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao: 
--- Excluir aluno ---

Alunos disponiveis (7 aluno(s))
--------------------------------------------------
  ID:         aluno-001
  Nome:       Ana Beatriz Souza
  Turma:      1º Ano A
  Nascimento: 12/03/2009
--------------------------------------------------
  ID:         aluno-002
  Nome:       Bruno Carvalho Lima
  Turma:      1º Ano A
  Nascimento: 25/07/2009
--------------------------------------------------
  ID:         aluno-003
  Nome:       Camila Ferreira Rocha
  Turma:      1º Ano B
  Nascimento: 03/11/2009
--------------------------------------------------
  ID:         aluno-004
  Nome:       Diego Martins Alves
  Turma:      2º Ano A
  Nascimento: 18/01/2008
--------------------------------------------------
  ID:         aluno-005
  Nome:       Elisa Nogueira Prado
  Turma:      2º Ano A
  Nascimento: 09/06/2008
--------------------------------------------------
  ID:         aluno-006
  Nome:       Felipe Ramos Teixeira
  Turma:      2º Ano B
  Nascimento: 21/12/2008
--------------------------------------------------
  ID:         o5E4SPfnsl4jtqm7151z
  Nome:       Gustavo Almeida
  Turma:      3 Ano A
  Nascimento: 14/09/2008
--------------------------------------------------
Digite o ID do aluno que deseja excluir: Nenhum aluno encontrado com o ID informado.

==================================================
              MENU CRUD DE ALUNOS
==================================================
  1 - Cadastrar aluno
  2 - Listar alunos
  3 - Atualizar aluno
  4 - Excluir aluno
  5 - Consultar por turma
  6 - Consultar por data de nascimento
  7 - Popular com dados ficticios (demo)
  0 - Sair
==================================================
Escolha uma opcao:
```

## Entrega no Google Sala de Aula

**Link do repositório:**
https://github.com/pedrosokaua-lab/firebase-crud

**Texto sugerido para a descrição:**

```
Projeto Firebase CRUD - Operações CREATE, READ, UPDATE e DELETE de alunos
com consultas por turma e data de nascimento, usando Firebase Admin SDK.

Repositório: https://github.com/pedrosokaua-lab/firebase-crud

Observação: dados fictícios foram utilizados e o arquivo
serviceAccountKey.json não foi publicado no GitHub (protegido pelo .gitignore).
```

## Segurança

- O arquivo `serviceAccountKey.json` está listado no `.gitignore` e **nunca** deve ser enviado ao GitHub.
- Se a chave vazar, revogue-a no console do Firebase e gere uma nova.
- Todos os alunos cadastrados são fictícios.

## Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `node` / `npm` não reconhecido | Node.js não instalado | Instale o Node.js LTS em https://nodejs.org |
| `Cannot find module 'firebase-admin'` | Dependências não instaladas | Execute `npm install` |
| `Cannot find module '@google-cloud/firestore'` | Instalação incompleta | Execute `npm install` com o Node.js no PATH |
| `serviceAccountKey.json não encontrado` | Arquivo fora da pasta | Coloque o arquivo na raiz do projeto |
| `5 NOT_FOUND / database does not exist` | Firestore não criado | Console > Build > Firestore Database > Criar banco de dados |
| `invalid_grant / private key` | Chave inválida ou revogada | Baixe um novo `serviceAccountKey.json` |
| `prompt is not defined` | Versão antiga do `index.js` | Use este `index.js` (usa `readline`) |
| Web sem conexão | `firebaseConfig` não preenchido | Configure as chaves no `web-crud.html` |
| Web: `PERMISSION_DENIED` | Regras do Firestore | Publique as regras de teste indicadas acima |




