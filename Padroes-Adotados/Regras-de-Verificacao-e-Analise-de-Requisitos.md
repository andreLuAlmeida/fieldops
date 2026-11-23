# Regras de Verificação e Análise de Requisitos

**Projeto:** FieldOps  
**Disciplina:** GCC188 — Engenharia de Software  
**Instituição:** Universidade Federal de Lavras — UFLA  
**Semestre:** 2026/2  

## 1. Objetivo

Este documento define regras objetivas que deverão ser utilizadas na escrita, revisão e análise dos requisitos do sistema **FieldOps**.

O objetivo é padronizar a especificação dos requisitos e permitir que qualquer integrante da equipe consiga verificar, de forma reproduzível, se um requisito está ou não em conformidade com o padrão adotado.

As regras foram elaboradas com base nas orientações da disciplina e nos princípios apresentados no **Capítulo 1 — Análise de Requisitos**, do livro *Engenharia de Software Aplicada — Fundamentos*, de Rogério Magela, especialmente nas seções referentes à **Especificação de Requisitos** e à **Análise de Requisitos**.

Sempre que possível, recomendações qualitativas apresentadas no livro foram transformadas neste documento em critérios objetivos de verificação.

---

## 2. Padrão de Identificação

### RV01 — Todo requisito deve possuir identificador único

Os requisitos deverão ser identificados de acordo com o seu tipo:

- requisitos funcionais: `RF` seguido de três algarismos;
- requisitos não funcionais: `RNF` seguido de três algarismos.

Exemplos válidos:

```text
RF001
RF002
RF015
RNF001
RNF004
```

Exemplos inválidos:

```text
R1
REQ01
FUNC001
NF01
RF1
```

### Critério de verificação

Um requisito será considerado conforme quando:

1. possuir exatamente um identificador;
2. o identificador seguir a expressão regular abaixo:

```text
RF[0-9]{3}
```

ou:

```text
RNF[0-9]{3}
```

3. não existir outro requisito no documento com o mesmo identificador.

---

## 3. Regras para Escrita dos Requisitos

### RV02 — O título de todo requisito funcional deve iniciar com verbo no infinitivo

O nome do requisito funcional deverá representar uma ação do sistema e começar com um verbo no infinitivo.

Exemplos válidos:

```text
RF001 — Autenticar Usuário
RF002 — Cadastrar Cliente
RF003 — Consultar Cliente
RF004 — Alterar Cliente
RF005 — Excluir Cliente
```

Exemplos inválidos:

```text
RF002 — Cadastro de Cliente
RF003 — Consulta dos Clientes
RF004 — Cliente Alterado
```

### Critério de verificação

O primeiro termo do título, depois do identificador, deverá ser um verbo no infinitivo terminado, em regra, em `-ar`, `-er` ou `-ir`.

Além disso, o mesmo título deverá ser utilizado sem alteração no respectivo caso de uso.

---

### RV03 — Cada requisito deve especificar somente uma ação principal

A seção 7.2.1 do capítulo de referência orienta a definir somente um requisito por vez.

Por isso, cada requisito do FieldOps deverá representar apenas uma funcionalidade ou restrição principal.

Exemplo válido:

```text
RF002 — Cadastrar Cliente

O sistema deve permitir o cadastro de clientes da empresa.
```

Exemplo inválido:

```text
O sistema deve permitir cadastrar clientes e enviar uma mensagem
ao cliente após o cadastro.
```

Nesse caso, existem duas ações diferentes:

1. cadastrar cliente;
2. enviar mensagem.

Elas deverão ser especificadas separadamente.

### Critério de verificação

A descrição principal do requisito:

- deverá conter apenas uma ação principal executada pelo sistema;
- não poderá utilizar `e` ou `ou` para juntar duas funcionalidades independentes;
- se a frase puder ser dividida em duas funcionalidades que possam ser implementadas ou testadas separadamente, deverão existir dois requisitos.

---

### RV04 — Palavras que introduzem ambiguidade não deverão ser utilizadas

A seção 7.2.2 do capítulo de referência apresenta palavras que devem ser evitadas durante a especificação dos requisitos.

No FieldOps, fica proibido utilizar na descrição dos requisitos os seguintes termos ou expressões:

```text
e
ou
somente se
exceto
se necessário
mas
contudo
entretanto
usualmente
geralmente
frequentemente
tipicamente
amigável
versátil
flexível
aproximadamente
tão logo quanto possível
talvez
provavelmente
```

Também deverão ser evitadas expressões equivalentes que produzam o mesmo tipo de indefinição, como:

```text
rápido
adequado
fácil
eficiente
quando possível
se possível
normalmente
```

### Critério de verificação

Durante a revisão, será feita uma busca textual pela lista acima.

Caso alguma dessas expressões esteja presente no requisito, ele será marcado como **não conforme** e deverá ser reescrito com uma condição objetiva.

Exemplo inválido:

```text
O sistema deve carregar o dashboard rapidamente.
```

Exemplo válido:

```text
O sistema deve exibir o conteúdo principal do dashboard
em até 3 segundos.
```

---

### RV05 — A descrição principal de um requisito terá no máximo 30 palavras

A seção 7.2.3 do capítulo de referência recomenda evitar frases grandes.

Para tornar essa orientação verificável no FieldOps, foi adotado um limite quantitativo.

### Critério de verificação

A frase principal utilizada para especificar um requisito deverá possuir **no máximo 30 palavras**.

Não entram nessa contagem:

- identificador;
- título;
- pré-condições;
- fluxos principal e alternativos;
- regras de negócio;
- observações;
- critérios de aceitação.

Caso a descrição ultrapasse 30 palavras, deverá ser simplificada ou dividida em requisitos diferentes quando houver mais de uma responsabilidade envolvida.

---

### RV06 — Todo termo específico do domínio deverá pertencer ao vocabulário definido do projeto

A seção 7.2.4 do capítulo de referência recomenda utilizar um vocabulário fechado e manter um glossário de termos.

No FieldOps, termos de negócio utilizados nos requisitos deverão possuir significado único.

Exemplos de termos do domínio:

```text
Empresa
Cliente
Técnico
Serviço
Ordem de Serviço
Local de Atendimento
Ativo
Administrador
```

### Critério de verificação

Um termo específico do domínio poderá ser utilizado em um requisito somente quando:

1. estiver definido no glossário/dicionário do projeto; ou
2. for definido no próprio documento antes de sua primeira utilização.

Siglas também deverão ser descritas em sua primeira ocorrência ou constar no glossário.

Exemplo inválido:

```text
O sistema deve permitir que o dispatcher atribua uma OS ao field agent.
```

se `dispatcher`, `OS` e `field agent` não estiverem definidos.

Exemplo válido:

```text
O sistema deve permitir que o Administrador atribua uma Ordem de Serviço a um Técnico.
```

---

## 4. Regras de Qualidade e Análise

### RV07 — Todo requisito não funcional deverá possuir um critério mensurável

O capítulo apresenta a **verificabilidade** como uma característica necessária para a qualidade de uma especificação.

Por isso, requisitos não funcionais relacionados a características mensuráveis deverão apresentar valores objetivos.

Exemplo inválido:

```text
RNF001 — O sistema deve ser rápido.
```

Exemplo válido:

```text
RNF001 — O sistema deve responder às operações de consulta
em até 2 segundos para 95% das requisições realizadas durante o teste.
```

### Critério de verificação

Um RNF que trate de desempenho, disponibilidade, capacidade, tempo, tamanho, compatibilidade ou outra característica mensurável deverá conter:

1. um valor numérico;
2. uma unidade ou escala de medida, quando aplicável;
3. a condição em que o valor será verificado.

Exemplos:

```text
2 segundos
99,0% de disponibilidade mensal
até 100 usuários simultâneos
360 px a 1920 px de largura
```

Não serão aceitos isoladamente termos como:

```text
rápido
seguro
amigável
eficiente
alta disponibilidade
boa usabilidade
```

---

### RV08 — Todo requisito deverá possuir origem identificada

O capítulo apresenta `Fonte` como atributo utilizado na documentação e análise de requisitos.

Para manter a rastreabilidade, todo requisito deverá informar de onde surgiu.

### Critério de verificação

Cada requisito deverá possuir um campo `Fonte` preenchido.

O campo não poderá ser vazio e deverá identificar pelo menos uma origem, por exemplo:

```text
Cliente
Administrador
Técnico
Regra de negócio
Professor da disciplina
Documento de contexto do produto
```

Exemplo:

```text
Fonte: Administrador da empresa
```

---

### RV09 — Todo requisito funcional deverá ser rastreável até um caso de uso

Para que a especificação seja rastreável, cada requisito funcional deverá possuir um caso de uso correspondente.

### Critério de verificação

Para cada `RFxxx` deverão existir:

1. um caso de uso com o mesmo identificador;
2. um caso de uso com nome idêntico ao título do requisito;
3. pelo menos um ator associado ao caso de uso.

Exemplo:

```text
RF002 — Cadastrar Cliente
```

deverá aparecer no diagrama como:

```text
Cadastrar Cliente
```

associado a pelo menos um ator autorizado.

---

### RV10 — Todo requisito utilizado no desenvolvimento deverá ser rastreável no backlog

Cada tarefa de implementação deverá indicar qual requisito está sendo atendido.

### Critério de verificação

Toda issue ou tarefa do backlog relacionada à implementação de requisito deverá possuir o identificador do requisito em seu título.

Exemplos:

```text
RF002 - Cadastrar Cliente - Banco de Dados
RF002 - Cadastrar Cliente - Backend
RF002 - Cadastrar Cliente - Frontend
RF002 - Cadastrar Cliente - Teste
```

Uma tarefa de implementação sem `RFxxx` ou `RNFxxx`, quando relacionada diretamente a um requisito, será considerada sem rastreabilidade.

---

## 5. Checklist de Verificação

Antes que um requisito seja considerado aprovado, deverá ser analisado utilizando o checklist abaixo.

| ID | Verificação | Conforme |
|---|---|---|
| RV01 | Possui identificador único no padrão `RFxxx` ou `RNFxxx`? | ☐ |
| RV02 | Se for RF, o título inicia com verbo no infinitivo? | ☐ |
| RV03 | Especifica somente uma ação ou restrição principal? | ☐ |
| RV04 | Não possui palavras ou expressões proibidas? | ☐ |
| RV05 | A descrição principal possui no máximo 30 palavras? | ☐ |
| RV06 | Todos os termos específicos pertencem ao vocabulário do projeto? | ☐ |
| RV07 | Se for RNF mensurável, contém valor, unidade e condição de verificação? | ☐ |
| RV08 | Possui fonte/origem identificada? | ☐ |
| RV09 | Se for RF, possui caso de uso correspondente e ligado a ator? | ☐ |
| RV10 | As tarefas relacionadas possuem o identificador do requisito no backlog? | ☐ |

O requisito somente será considerado **aprovado** quando todas as regras aplicáveis forem marcadas como conformes.

---

## 6. Exemplo de Aplicação das Regras

### Requisito inicialmente escrito

```text
O sistema deve permitir que o administrador cadastre clientes
e normalmente envie uma mensagem rapidamente após o cadastro.
```

Problemas identificados:

- contém mais de uma ação;
- utiliza a palavra `e`;
- utiliza `normalmente`;
- utiliza `rapidamente`;
- mistura cadastro de cliente com envio de mensagem.

### Requisitos corrigidos

```text
RF002 — Cadastrar Cliente

O sistema deve permitir ao Administrador cadastrar um Cliente.
```

Caso o envio de mensagem faça parte do escopo:

```text
RF017 — Enviar Confirmação de Cadastro

O sistema deve enviar uma confirmação após o cadastro do Cliente.
```

Se houver um requisito de desempenho relacionado ao envio:

```text
RNF005 — Tempo de Envio da Confirmação

O sistema deve iniciar o envio da confirmação em até 5 segundos
após a conclusão do cadastro.
```

---

## 7. Procedimento de Revisão

A revisão dos requisitos deverá ocorrer antes de uma versão do documento ser considerada baseline.

Para cada requisito, o revisor deverá:

1. localizar o requisito pelo identificador;
2. aplicar as regras RV01 a RV10 que forem pertinentes;
3. registrar cada item como conforme ou não conforme;
4. corrigir os requisitos não conformes;
5. executar novamente a verificação após as correções;
6. considerar aprovado somente o requisito que atender a todos os critérios aplicáveis.

Os resultados da verificação poderão ser registrados em uma tabela específica no documento de requisitos ou em arquivo separado dentro da documentação do projeto.

---

## 8. Referência Utilizada

MAGELA, Rogério. **Engenharia de Software Aplicada: Fundamentos**. Capítulo 1 — Análise de Requisitos.

Foram utilizadas principalmente as orientações apresentadas nas seções:

- **7.2 — Especificação de Requisitos**;
- **7.2.1 — Defina somente um requisito por vez**;
- **7.2.2 — Evite as palavras**;
- **7.2.3 — Evite frases grandes**;
- **7.2.4 — Utilize um vocabulário fechado**;
- **7.2.5 — Mantenha uma estrutura hierárquica dos requisitos**;
- **7.2.6 — Para cada novo requisito, atualize seus atributos**;
- **7.3 — Análise de Requisitos**;
- critérios de requisito correto, completo, não ambíguo, verificável, consistente, modificável e rastreável apresentados na seção de análise.

Os limites quantitativos e mecanismos automáticos descritos neste documento, como o máximo de 30 palavras, são regras operacionais adotadas especificamente pelo projeto FieldOps para tornar as recomendações do livro objetivamente verificáveis.
