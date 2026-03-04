# Sistema de Gestão de Caçambas

Sistema web para gerenciamento de entregas, coletas e trocas de caçambas, permitindo controle operacional, rastreabilidade e organização de rotas e tarefas para empresas de locação de caçambas.

---

## Objetivo do Sistema
Criar uma plataforma que permita:

- Gerenciar tarefas (entrega, coleta, troca)
- Acompanhar status em tempo real  
- Registrar histórico operacional  

---

## 2. Modelagem do BD

### Veículo

- id  
- placa  
- capacidade 

---

### Motorista

- id  
- nome
- status (ativo/inativo)  

---

### Caçamba

- id da caçamba
- tamanho (Grande ou médio) 
- status:
  - DISPONÍVEL  
  - ENTREGUE  
  - EM MANUTENÇÃO  
  - RESERVADA  

---

### Cliente

- id  
- nome  
- CPF/CNPJ  
- endereço  

---

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

---

### Rota

- id  
- data  
- motorista  
- lista de tarefas  
- status (PLANEJADA | EM EXECUÇÃO | FINALIZADA)  

---

## 3. Requisitos Funcionais (RF)

### RF01 – Cadastro de Caçambas
### RF02 – Cadastro de Motoristas  
### RF03 – Cadastro de Veículos  
### RF04 – Cadastro de Clientes  
### RF05 – Criar Tarefa  
Permitir criar tarefas de:
- Entrega  
- Coleta  
- Troca
### RF06 – Alterar Status da Tarefa  
O motorista ou operador poderá atualizar:
- EM ANDAMENTO  
- ENTREGUE  
- COLETADO  
- CANCELADO  
- JUSTIFICADO  
### RF07 – Criar Rota Diária  
Organizar tarefas por motorista e data.
### RF08 – Histórico da Caçamba  

---

## 4. Requisitos Não Funcionais (RNF)
### RNF01 – Responsividade  
### RNF02 – Segurança  

---

## 5. Arquiteturas
### Backend
**Node.js + Express**

---

### Banco de Dados
**MySQL**

---

### Frontend
**HTML + TailwindCSS + JavaScript**

## 6. Organização Simples de Tarefas (Dupla)

**Ferrametas**
- Clickup

<img width="1629" height="581" alt="image" src="https://github.com/user-attachments/assets/d7970e3b-165d-49a1-9a3b-69ad7bc3b20c" />

---

## Modelo C4
### Nível 1 - Contexto

<img width="923" height="731" alt="contexto" src="https://github.com/user-attachments/assets/be72f0b3-61db-4397-9434-1fa39a895e25" />

### Nível 2 - Conatiner

<img width="569" height="1038" alt="container" src="https://github.com/user-attachments/assets/28669d18-24ef-42df-917b-92e04268501f" />



