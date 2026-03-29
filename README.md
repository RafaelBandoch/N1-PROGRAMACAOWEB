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
<[img width="923" height="731" alt="contexto" src="https://github.com/user-attachments/assets/be72f0b3-61db-4397-9434-1fa39a895e25" /](https://www.plantuml.com/plantuml/png/bLFThjj44BxtKmpX9X5fJAiAgYYAUf8SVghyc6Et5LVHsDxZBAntpUuwXvGYyH2y0E82WTIhYYVmc_0apDgrdGWTgXuTHUFP-RxPxvlPfyQYjcKkl8-uJ4IPCZXOMvYfxskycsJS7iguD4mdIbecxIHHkLy8b0xpmDXKyDXVFduGkDJppThFqLYcARLV4WAvP7fIE7vlVVNjxdcqZtR1VhLxkHsEFCzoAnYiE6OQSmHgte4C3BVLcoCJy6W4__poAuISY9kYBvcnrU-ghiVg3ynZD9uN44Z9eIgOnbJfCGnsxqAuIdCk2Q_HygCQqD4IKtJVG9fuYYapOqWqHo0xs2qQOA1qXfA_Gj3AefaCHcs7N5cbYGs9PzF6ZlG5DoMA5W8fhtvpb0pGliiRIw41wjqqkk1D16TaihjT4rrodc4fTK7WXITdpdwXIfcYFWrDbX3sFPODHl2J1m2zwSDRNOyv9V1L8NX2fGxraiNkBbz5cpLy0X5oSSTbkWn3-dg6Hmp9kiAwacjfDSiG43WHwLjC6A02YKVAqYWcG69pRXa8bN59fZU3g6zsEOkcD-LRfMCujcPqH_LiUeVxWyOjPywbGYou4nTy3JVNOUIkl5KfctndIChrZuLcnhXae5L28O9Lpd3wr-o7aXjE3VvcRWg0lK6Jka7rPzuKPXgfWe5aMVKsuMeCMBh7qvQJF2hNIh3-fcF8kX5rgWwSKcyrJnJKQqrS4iL_HAtYOHhJfHSeang_8gjh6PjJ-CtQ1Mx5t3RqUZgp8LLWcasPGhDvRWBTPbFyWbLlab8e2jljeJ3gdifD-q9-zhmR9ixUuFb2DOOUEVRhq6nL58I49M3_j3uOsJsU3yJrvSrcV86lBaVj0C_2tTO_HzMrjUVhwYzWKBJsfgtpvBiVBGFtE0NBg05edXsi1_0QPeaIIa_l3joo-Ip6vFkfLYSKiIZP7EXlvhlaVERNXNE21AH48Ro-3__nfqyUF_fySG-wsvJ_8NZuyBCdYzKz19URHImag97bFQMVCXV_0W00)>

### Nível 2 - Container
<img width="569" height="1038" alt="container" src="https://github.com/user-attachments/assets/28669d18-24ef-42df-917b-92e04268501f" />

---

## Planejamento de Tarefas

<img width="1629" height="581" alt="planejamento" src="https://github.com/user-attachments/assets/d7970e3b-165d-49a1-9a3b-69ad7bc3b20c" />
