# FieldOps

SaaS B2B multiempresa para gestão de equipes externas, ordens de serviço, agenda e roteamento.

Projeto desenvolvido para a disciplina **GCC188 - Engenharia de Software**, da Universidade Federal de Lavras - UFLA, no semestre 2026/2.

## 1. Contexto do Problema e Solução

### 1.1 Problema

Empresas que realizam atendimentos externos, como assistências técnicas, oficinas mecânicas, provedores de internet, empresas de manutenção elétrica, climatização, energia solar, facilities e manutenção industrial, precisam organizar diariamente clientes, técnicos, serviços, locais de atendimento e horários.

Em empresas de pequeno e médio porte, essas informações muitas vezes ficam distribuídas entre planilhas, agendas, mensagens, ligações telefônicas e anotações individuais dos funcionários.

Esse processo dificulta:

- o acompanhamento das ordens de serviço;
- a distribuição dos atendimentos entre os técnicos;
- a identificação de conflitos de horário;
- a consulta do histórico de atendimentos;
- o acompanhamento da situação atual de cada serviço;
- a organização dos deslocamentos até os clientes;
- a centralização das informações de diferentes setores da empresa.

Além disso, empresas que possuem vários técnicos em campo precisam saber quem está responsável por cada atendimento, em qual local o serviço será realizado e qual é o seu status.

### 1.2 Solução

O **FieldOps** é uma plataforma web SaaS multiempresa voltada para o gerenciamento de equipes externas e serviços realizados em campo.

O sistema permitirá que diferentes empresas utilizem a mesma plataforma mantendo seus dados isolados entre si.

Cada empresa poderá gerenciar seus próprios:

- usuários;
- clientes;
- técnicos;
- serviços;
- locais de atendimento;
- ordens de serviço;
- agenda de atendimentos.

Uma ordem de serviço poderá relacionar um cliente, um local de atendimento, um serviço e um técnico responsável.

O sistema também será projetado para oferecer visualização dos atendimentos em mapa e informações de rota para auxiliar o deslocamento dos profissionais.

Entre os tipos de empresas que poderão utilizar o FieldOps estão:

- oficinas e serviços mecânicos;
- provedores e assistências técnicas de internet;
- empresas de climatização;
- assistência técnica de equipamentos;
- empresas de manutenção elétrica;
- empresas de energia solar;
- empresas de facilities;
- manutenção industrial;
- outros negócios que possuam equipes externas.

### 1.3 Principais Funcionalidades Previstas

- autenticar usuários;
- controlar o acesso de usuários por empresa;
- gerenciar clientes;
- gerenciar técnicos;
- gerenciar serviços;
- gerenciar locais de atendimento;
- gerenciar ordens de serviço;
- atribuir técnicos aos atendimentos;
- acompanhar o status das ordens de serviço;
- consultar a agenda de atendimentos;
- visualizar locais de atendimento em mapa;
- visualizar rotas para atendimentos.

---

## 2. Instruções para Uso

O sistema ainda está em desenvolvimento.

As instruções desta seção serão atualizadas conforme os módulos executáveis do projeto forem disponibilizados.

### 2.1 Pré-requisitos

Para executar o sistema localmente serão utilizados:

- Node.js;
- npm;
- PostgreSQL;
- navegador web atualizado.

As versões adotadas estão descritas na seção **Tecnologias**.

### 2.2 Obter o Projeto

O projeto pode ser obtido pelo Git utilizando:

```bash
git clone https://github.com/andreLuAlmeida/fieldops.git
cd fieldops
```

Também é possível acessar o repositório no GitHub e utilizar:

```text
Code > Download ZIP
```

### 2.3 Execução

O processo completo de instalação e execução será documentado conforme o frontend e o backend forem implementados.

A estrutura prevista será:

```text
Frontend -> aplicação React
Backend  -> API Node.js
Banco    -> PostgreSQL
```

---

## 3. Instruções para Desenvolvedores

### 3.1 Clonar o Repositório

```bash
git clone https://github.com/andreLuAlmeida/fieldops.git
cd fieldops
```

### 3.2 Verificar o Ambiente

Os principais comandos utilizados para verificar o ambiente são:

```bash
git --version
node --version
npm --version
psql --version
code --version
```

### 3.3 Instalação das Dependências

Quando os módulos forem inicializados, as dependências serão instaladas separadamente.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 3.4 Execução

A execução prevista será feita em dois processos.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

As portas e demais configurações serão registradas nesta documentação após a criação dos módulos.

### 3.5 Controle de Versão

O projeto utiliza Git e GitHub para controle de versão.

Durante o desenvolvimento deverão ser realizados commits pequenos e frequentes, evitando acumular diversas alterações diferentes em um único commit.

As regras completas de branches, commits, pull requests e organização do repositório serão documentadas durante as próximas etapas do projeto.

---

## 4. Tecnologias

### Frontend

Tecnologias definidas para o frontend:

- **React** - biblioteca utilizada para construção da interface web.
- **TypeScript** - linguagem utilizada no frontend para adicionar tipagem estática ao JavaScript.
- **Vite** - ferramenta de desenvolvimento e build do frontend.
- **HTML5** - estrutura das interfaces.
- **CSS3** - estilização das interfaces.

As versões exatas serão registradas após a inicialização do projeto frontend.

### Backend

- **Node.js 22.23.2** - ambiente de execução JavaScript utilizado no backend.
- **npm 10.9.8** - gerenciador de pacotes utilizado para instalar e gerenciar as dependências do projeto.
- **JavaScript** - linguagem principal utilizada no backend.
- **Express** - framework planejado para implementação da API REST.

A versão do Express será registrada após sua instalação no projeto.

### Banco de Dados

- **PostgreSQL 18.6** - banco de dados relacional utilizado para persistência das informações.

### Outras Ferramentas

- **Git 2.53.0** - controle de versão.
- **GitHub** - hospedagem do repositório, colaboração, backlog e releases.
- **Visual Studio Code 1.146.0** - editor de código utilizado no desenvolvimento.
- **Astah UML** - ferramenta utilizada para criação dos diagramas UML.
- **Figma** - ferramenta prevista para prototipação das interfaces.

### Tecnologias Previstas para Etapas Posteriores

- React Leaflet - integração de mapas no frontend;
- OpenStreetMap - dados cartográficos;
- OSRM - cálculo de rotas;
- Zod - validação de dados da API;
- bcrypt - hash de senhas;
- JWT - autenticação baseada em token;
- Vitest - testes unitários;
- Supertest - testes da API;
- Playwright - testes automatizados de interface.

---

## 5. Organização do Projeto

A estrutura inicial do repositório é:

```text
fieldops/
│
├── backend/
│   └── src/
│
├── frontend/
│   └── src/
│
├── Requisitos/
│
├── Diagramas/
│
├── Padroes-Adotados/
│
├── tests/
│
├── .gitignore
└── README.md
```

### backend/

Contém o código responsável pela API, regras de negócio, autenticação, controle de acesso e comunicação com o PostgreSQL.

A estrutura interna será expandida durante a implementação.

### frontend/

Contém a aplicação web que será desenvolvida utilizando React e TypeScript.

### Requisitos/

Contém o documento de requisitos, casos de uso, arquivos dos diagramas relacionados aos requisitos e demais artefatos de especificação do produto.

### Diagramas/

Contém os diagramas de projeto, incluindo:

- diagrama de classes;
- diagrama de pacotes;
- diagramas de sequência;
- diagrama de implantação.

### Padroes-Adotados/

Contém as regras e padrões adotados durante o desenvolvimento, incluindo:

- critérios de verificação e análise de requisitos;
- boas práticas de codificação;
- outros padrões definidos durante o projeto.

### tests/

Contém os testes automatizados do sistema.

---

## 6. Arquitetura Prevista

A arquitetura geral prevista é:

```text
React + TypeScript
        |
        | HTTP / REST / JSON
        v
Node.js + Express
        |
        | SQL
        v
PostgreSQL
```

No backend, a aplicação será organizada utilizando separação de responsabilidades:

```text
Routes
  |
Controllers
  |
Services
  |
Repositories
  |
PostgreSQL
```

---

## 7. Arquitetura Multiempresa

O FieldOps será desenvolvido como uma aplicação multiempresa.

Cada organização utilizará a mesma plataforma, porém seus dados deverão permanecer isolados dos dados pertencentes às demais empresas.

Cada empresa poderá possuir seus próprios:

- usuários;
- clientes;
- técnicos;
- serviços;
- locais de atendimento;
- ordens de serviço.

Essa arquitetura permitirá que empresas de segmentos diferentes utilizem a mesma plataforma adaptando o catálogo de serviços às suas atividades.

---

## 8. Status do Projeto

O projeto encontra-se atualmente na etapa de preparação do ambiente e definição inicial da arquitetura.

Já foram realizados:

- criação do repositório GitHub;
- configuração do Git;
- configuração do ambiente de desenvolvimento;
- instalação do Node.js;
- instalação e inicialização do PostgreSQL;
- definição inicial da estrutura de diretórios;
- criação do arquivo `.gitignore`.

As próximas etapas incluem:

- especificação dos requisitos funcionais;
- especificação dos requisitos não funcionais;
- elaboração dos casos de uso;
- prototipação das interfaces;
- modelagem do domínio;
- implementação do backend;
- implementação do frontend;
- implementação dos testes automatizados.
