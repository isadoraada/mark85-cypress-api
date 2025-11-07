# Mark85: Automação de Testes de API com Cypress

## 📚 Sobre o Projeto

Este repositório contém testes automatizados de API para o sistema **Mark85** - um gerenciador de tarefas desenvolvido para o curso "Testando API REST com MongoDB e RabbitMQ em Cypress". Os testes foram desenvolvidos usando Cypress com foco em testes de API REST, incluindo integração com MongoDB e validação de mensagens via RabbitMQ/CloudAMQP.

O projeto valida os principais endpoints da aplicação, garantindo a qualidade e confiabilidade das funcionalidades de gerenciamento de usuários, autenticação e tarefas.

## 🛠️ Tecnologias Utilizadas

- **JavaScript** – Linguagem principal
- **Cypress** – Framework de testes E2E e API
- **cypress-plugin-api** – Plugin para facilitar testes de API
- **MongoDB** – Banco de dados (limpeza e preparação de dados)
- **RabbitMQ/CloudAMQP** – Validação de mensagens assíncronas
- **Allure Report** – Geração de relatórios avançados
- **dotenv** – Gerenciamento de variáveis de ambiente

## 🎯 Funcionalidades Testadas

### 👤 Usuários (Users)
- ✅ Cadastro de novos usuários
- ✅ Validação de campos obrigatórios
- ✅ Prevenção de usuários duplicados
- ✅ Validação de formato de e-mail

### 🔐 Sessões (Sessions)
- ✅ Autenticação de usuários
- ✅ Geração de tokens JWT
- ✅ Validação de credenciais incorretas

### 📋 Tarefas (Tasks)
- ✅ **POST** - Cadastro de novas tarefas
- ✅ **GET** - Listagem de todas as tarefas
- ✅ **GET** - Busca de tarefa específica por ID
- ✅ **PUT** - Marcar tarefa como concluída
- ✅ **DELETE** - Exclusão de tarefas
- ✅ Validação de tarefas duplicadas
- ✅ Validação de autorização (token JWT)
- ✅ Verificação de mensagens na fila (RabbitMQ)

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- Aplicação **Mark85 API** rodando (ex: `http://localhost:3333`)
- Acesso ao **MongoDB** (local ou cloud)
- Conta **CloudAMQP** (para validação de mensagens)

### 1. Clone o repositório:

```bash
git clone https://github.com/isadoraada/mark85-cypress-api
cd mark85-cypress-api
```

### 2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
BASE_URL=http://localhost:3333
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/markdb?retryWrites=true&w=majority

AMQP_HOST=https://seu-rabbitmq.cloudamqp.com/api/queues/vhost
AMQP_QUEUE=tasks
AMQP_TOKEN=Basic seu-token-base64
```

### 4. Execute os testes:

#### Executar todos os testes (modo headless):
```bash

npx cypress run
```

#### Abrir interface interativa do Cypress:
```bash
npx cypress open
```

### 5. Gerar e visualizar relatório Allure:

```bash
# Gerar relatório
npx allure generate allure-results --clean -o allure-report

# Abrir relatório no navegador
npx allure open allure-report
```

## ✍️ Autor

**Isadora Araújo**

- GitHub: [@isadoraada](https://github.com/isadoraada)