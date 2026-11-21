# Resumo dos Testes e Entrega

## Status: OK - Projeto Funcionando

### Ambiente verificado

- Projeto Firebase: `crud-alunos-5c785`
- Firestore Database: **criado e respondendo**
- `serviceAccountKey.json`: presente na pasta (fora do Git)
- Node.js: v22.23.5 instalado em `C:\Users\Administrator\nodejs`
- Dependências: `firebase-admin` + `@google-cloud/firestore` instaladas

### Testes executados com sucesso

| Teste | Resultado |
|---|---|
| Conexão (`node testar-conexao.js`) | Conexao OK, colecao `alunos` respondeu |
| Leitura (READ) | 6 alunos listados |
| Consulta por turma (`1º Ano A`) | 2 alunos encontrados |
| Consulta por nascimento (ano 2008) | 3 alunos encontrados |
| Criação (CREATE) | Documento criado com ID gerado |
| Atualização (UPDATE) | Campo `turma` alterado corretamente |
| Exclusão (DELETE) | Documento removido (`exists = false`) |
| Menu interativo (`node index.js`) | Opções 2 e 6 executadas normalmente |

### Dados fictícios cadastrados

| ID | Nome | Turma | Nascimento |
|---|---|---|---|
| aluno-001 | Ana Beatriz Souza | 1º Ano A | 12/03/2009 |
| aluno-002 | Bruno Carvalho Lima | 1º Ano A | 25/07/2009 |
| aluno-003 | Camila Ferreira Rocha | 1º Ano B | 03/11/2009 |
| aluno-004 | Diego Martins Alves | 2º Ano A | 18/01/2008 |
| aluno-005 | Elisa Nogueira Prado | 2º Ano A | 09/06/2008 |
| aluno-006 | Felipe Ramos Teixeira | 2º Ano B | 21/12/2008 |

> Para recriar os dados: `node popular-dados.js` (os IDs são fixos, não duplica).

### Como rodar

Abra um **novo** terminal PowerShell (para pegar o PATH atualizado):

```powershell
cd "C:\Users\Administrator\Documents\Default Project\firebase-crud"
node index.js
```

### Checklist para entrega no Google Sala de Aula

- [x] Projeto Firebase criado
- [x] Firestore habilitado
- [x] Conexão com Admin SDK configurada
- [x] CRUD completo implementado e testado
- [x] Consultas por turma e data implementadas e testadas
- [x] Dados fictícios no banco
- [x] `serviceAccountKey.json` protegido pelo `.gitignore`
- [x] README com link do repositório
- [ ] Fazer `git push` das correções para o GitHub
- [ ] Tirar prints (terminal + web)
- [ ] Colar link e Prints no Google Sala de Aula

### Link para entrega

https://github.com/pedrosokaua-lab/firebase-crud
