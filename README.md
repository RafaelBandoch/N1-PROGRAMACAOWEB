# Sistema de Gestão de Caçambas

Sistema web para gerenciamento de entregas, coletas e trocas de caçambas, com foco em controle operacional, rastreabilidade e organização de rotas para empresas de locação.

---

## Descrição

A aplicação permite gerenciar toda a operação logística de caçambas, incluindo controle de tarefas, acompanhamento de status em tempo real e registro de histórico operacional.

---

## Objetivo do Sistema

Criar uma plataforma que permita:

- Gerenciar tarefas (entrega, coleta e troca)
- Acompanhar status em tempo real  
- Registrar histórico operacional  
- Organizar rotas por motorista e data  

---

## Modelagem do Banco de Dados

### Veículo
- id  
- placa  
- capacidade  

### Motorista
- id  
- nome  
- status (ativo/inativo)  

### Caçamba
- id  
- tamanho (grande ou médio)  
- status:
  - DISPONÍVEL  
  - ENTREGUE  
  - EM MANUTENÇÃO  
  - RESERVADA  

### Cliente
- id  
- nome  
- CPF/CNPJ  
- endereço  

### Tarefa
- id  
- tipo (ENTREGA | COLETA | TROCA)  
- cacamba_id  
- cliente_id  
- motorista_id  
- veiculo_id  
- endereco_execucao  
- data_agendada  
- status:
  - EM ANDAMENTO  
  - ENTREGUE  
  - COLETADO  
  - CANCELADO  
  - JUSTIFICADO  
- justificativa (opcional)  

### Rota
- id  
- data  
- motorista  
- lista de tarefas  
- status:
  - PLANEJADA  
  - EM EXECUÇÃO  
  - FINALIZADA  

---

## Requisitos Funcionais (RF)

- RF01 – Cadastro de caçambas  
- RF02 – Cadastro de motoristas  
- RF03 – Cadastro de veículos  
- RF04 – Cadastro de clientes  

- RF05 – Criar tarefa:
  - Entrega  
  - Coleta  
  - Troca  

- RF06 – Alterar status da tarefa:
  - EM ANDAMENTO  
  - ENTREGUE  
  - COLETADO  
  - CANCELADO  
  - JUSTIFICADO  

- RF07 – Criar rota diária  
- RF08 – Histórico da caçamba  

---

## Requisitos Não Funcionais (RNF)

- RNF01 – Responsividade  
- RNF02 – Segurança  

---

## Arquitetura

### Backend
Node.js + Express  

### Banco de Dados
MySQL  

### Frontend
HTML + TailwindCSS + JavaScript  

---

## Organização do Projeto

Desenvolvimento realizado em dupla utilizando:

- ClickUp  

---

## Modelo C4

### Nível 1 - Contexto
<img width="923" height="731" alt="contexto" src="https://github.com/user-attachments/assets/be72f0b3-61db-4397-9434-1fa39a895e25" />

### Nível 2 - Container
<img width="569" height="1038" alt="container" src="https://github.com/user-attachments/assets/28669d18-24ef-42df-917b-92e04268501f" />

---

## Planejamento de Tarefas

<img width="1629" height="581" alt="planejamento" src="https://github.com/user-attachments/assets/d7970e3b-165d-49a1-9a3b-69ad7bc3b20c" />
