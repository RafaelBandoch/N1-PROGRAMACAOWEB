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

## Modelo C4

### Nível 1 - Contexto
![Contexto](https://www.plantuml.com/plantuml/dpng/XLDDJXjB4DxFAUhnDaOozdiHKX9aMH18o0Am5Tk9ihBACyMueMTgw1y34OiS8XU8ic3bLOumDyb9KZtss9Oim0lKqrtVJrLz75g7nlbCH_-eFDO-8PWwLzY3TjlWRIjLRkedtfA9ENUKkrRCMRlGc0VCddM9LfFsyVvUFroDpi_Q6Lf7Hgx6nm5nvrf5O8_EZhxsHiFniDSVd_I-N3HseyWffmbE5AO6CmIHNa8O6XVbV4OQ_j-5Fzz_m409wQBabAmhVt5LZUKZPXEqKTGdOpblS4464pPDsEajZt2KP2eNl46dPhmZJnzy7YlEovz62Gy2POKXYoqXJ30KGgmLYHFRX8mT6q6Zd6TKpcElsG91N6iBoYW4XuOkCRomIJ5Ntn0CEtdUsQtDhQZ4mdbzVjRFPsKzwi1b_O8F4XNAK7JGBTyOh9CFAr2xyf6pMCmAtj1VDYM2nujJqEwJjOnmMSwjYeNBmvKtvJoHZnOCMAjOEP4dCrFb8ui6WK0DfT95p9fSXN661Poinn9aey5zs5h3fh48lR32uEMe43cv26-tD84RJv2I8PaErggsbhL02zdAq-OwM2fPhrRIN2oYMKz90gv4_xTHCKCLc31yr1kMn-_lN1XNVEsBQbno6XNLgiX8LiKBmW1n0CdQORYjUYeCNv5ZiJAoc20K96Rengj2tj1WdP1bfqesONA4980jvJFMCrMHLOu-aTw8zMAMgvnAbKfGO3ALvr8Oh7yS3li3OHJ2THHhndNIglhDU6s5Qukj3jQQQnjg_TFuTNlhcP_MUwzRsXxF9asaAQKy0QFIgOi07g0ZCM5pS3jLZhgT2SRN1uRlKK-qfox8hzCEbzrEkohi2cJvl_3m5FxV_zxilthzxWbq7V2-KMAyGFqCqTlgzmAHX522mK8ZdItwYmxbZy_qNm00)

### Nível 2 - Container
![Container](https://www.plantuml.com/plantuml/dsvg/bLFDJlD65DtxAMxf9gWXBWYrA8eY8A4_A3ykDg2kqBKzEDEEPzoPSIY8HH-YBr1rKRKIAzGdy9lqINh7nd6ou9D0ABg-Sy-vSuwFJur5RSjSU9zncOWoPR2ojZ13tzVuCCYuNPLnQPXEbBHCsa6YShyGA1tcmDXKyDYV71y4hdKzd_av6iiqjUucX40kcHuKZdzszkFoEhgBbi7TT7cxwErxbbl1OCenqvWZqEeDn41lKRsicO2ZVVZljzyXv4JR37tBZAt-LFKyLdzX7gFnl810IlPKmJIcIlTXR_bMmbcQSqbuZPQlrHuTJJ15zmoaYAUOCjE7H7C4CeFTem46IcSe-HE2LXRDO6-_tP0hgpIn8V7CszgHtd1JecWXaFBg3qV90ErRtrWg3T3kTj4MRo8u8ulTxPfgbtCBIwqT0czZM-zUKybaIj2pGl24_75MtRBOiNqNpMVm1KJ8nGENwIGCwUaIrnYI-CAwaGjfDSiG43WHwNjC6A02YMlgafa3eElct38GAkEIR6kih5_7hflDRkgtT-t3kfNJ7ZNkTXvr1urU9wzJXmLtmeBluUeYZDnr5ofbWvyCoRZujT3C6DSCj4geHB3AsKN_clrISiE9_5_cF0Jip1dKgQl-pfj1og9n-oNBgjU4gpvWwOBVZfCq6jTAiEwMVSZQJ7QALfnQhved2kfG4fT4iIDe6lVIc2vyZZAfiLEok9OmVmn_cBd2XSD5lzEoCHbI1VLPZaDeCkEStsIIwXjMlIIbK5IsdmgLqIRaLssslIicjhwTxHWrLguvTY5eiXG58I49s7qI7qQseVyehXjlCl4DFks-P0Uu39SBVnjLpzQEpwf_W47HcfkslfFhVZG9d2E2PRG0DCzMrWDuXb6YXDB3XnMtR3oACVbvgDKZYbYKR0pqD_9TSppowy4nGG9IeX2UtyD__kN9yT7Nv--WDpdv1C7XuLSdvzDt27PpHImag97bdT9FcOl_0G00)

---

## Planejamento de Tarefas

<img width="1629" height="581" alt="planejamento" src="https://github.com/user-attachments/assets/d7970e3b-165d-49a1-9a3b-69ad7bc3b20c" />
