# Sistema de Gestão de Caçambas

Sistema web para gerenciamento de entregas, coletas e trocas de caçambas, com foco em controle operacional, rastreabilidade e organização de rotas para empresas de locação.

> **Observação:** Este documento é um planejamento inicial e está sujeito a alterações ao longo do desenvolvimento. Funcionalidades, entidades e requisitos podem ser adicionados, removidos ou modificados conforme o projeto evolui.

---

## 1. Domínio do Problema

No setor de locação de caçambas, é comum perder o controle sobre entregas, coletas e trocas, o que gera desorganização operacional e falta de rastreabilidade. Ferramentas genéricas não oferecem a visibilidade necessária para o fluxo logístico da empresa.

---

## Objetivo do Sistema

Criar uma aplicação web que permita:

- Gerenciar tarefas (entrega, coleta e troca)
- Acompanhar status em tempo real
- Registrar histórico operacional
- Organizar rotas por motorista e data

---

## 2. Modelagem

### Entidades

#### Veículo

| Campo      | Tipo   |
|------------|--------|
| id         | uuid   |
| placa      | string |
| capacidade | string |

#### Motorista

| Campo  | Tipo                  |
|--------|-----------------------|
| id     | uuid                  |
| nome   | string                |
| status | `ATIVO` \| `INATIVO`  |

#### Caçamba

| Campo   | Tipo                                                        |
|---------|-------------------------------------------------------------|
| id      | uuid                                                        |
| tamanho | `GRANDE` \| `MÉDIO`                                         |
| status  | `DISPONÍVEL` \| `ENTREGUE` \| `EM MANUTENÇÃO` \| `RESERVADA` |

#### Cliente

| Campo     | Tipo   |
|-----------|--------|
| id        | uuid   |
| nome      | string |
| cpf_cnpj  | string |
| endereco  | string |

#### Tarefa

| Campo             | Tipo                                                                          |
|-------------------|-------------------------------------------------------------------------------|
| id                | uuid                                                                          |
| tipo              | `ENTREGA` \| `COLETA` \| `TROCA`                                              |
| cacamba_id        | uuid (FK)                                                                     |
| cliente_id        | uuid (FK)                                                                     |
| motorista_id      | uuid (FK)                                                                     |
| veiculo_id        | uuid (FK)                                                                     |
| endereco_execucao | string                                                                        |
| data_agendada     | date                                                                          |
| status            | `EM ANDAMENTO` \| `ENTREGUE` \| `COLETADO` \| `CANCELADO` \| `JUSTIFICADO`   |
| justificativa     | string (opcional)                                                             |

#### Rota

| Campo          | Tipo                                       |
|----------------|--------------------------------------------|
| id             | uuid                                       |
| data           | date                                       |
| motorista_id   | uuid (FK)                                  |
| tarefas        | lista de Tarefa                            |
| status         | `PLANEJADA` \| `EM EXECUÇÃO` \| `FINALIZADA` |

---

## 3. Requisitos Funcionais (RF)

| ID   | Descrição |
|------|-----------|
| RF01 | Cadastro de caçambas |
| RF02 | Cadastro de motoristas |
| RF03 | Cadastro de veículos |
| RF04 | Cadastro de clientes |
| RF05 | Criar tarefa — Entrega, Coleta ou Troca |
| RF06 | Alterar status da tarefa — EM ANDAMENTO, ENTREGUE, COLETADO, CANCELADO, JUSTIFICADO |
| RF07 | Criar rota diária |
| RF08 | Histórico da caçamba |

---

## 4. Requisitos Não Funcionais (RNF)

| ID    | Descrição |
|-------|-----------|
| RNF01 | Responsividade — Interface adaptada para desktop e dispositivos móveis |
| RNF02 | Segurança — Autenticação e controle de acesso |

---

## Arquitetura

| Camada        | Tecnologia               |
|---------------|--------------------------|
| Frontend      | HTML + TailwindCSS + JavaScript |
| Backend       | Node.js + Express        |
| Banco de Dados | MySQL                   |

---

## Organização do Projeto

Desenvolvimento realizado em dupla utilizando:

- **ClickUp** — Gerenciamento de tarefas e planejamento do projeto

---

## Modelo C4

### Nível 1 - Contexto
![Contexto](https://www.plantuml.com/plantuml/dpng/XLDDJXjB4DxFAUhnDaOozdiHKX9aMH18o0Am5Tk9ihBACyMueMTgw1y34OiS8XU8ic3bLOumDyb9KZtss9Oim0lKqrtVJrLz75g7nlbCH_-eFDO-8PWwLzY3TjlWRIjLRkedtfA9ENUKkrRCMRlGc0VCddM9LfFsyVvUFroDpi_Q6Lf7Hgx6nm5nvrf5O8_EZhxsHiFniDSVd_I-N3HseyWffmbE5AO6CmIHNa8O6XVbV4OQ_j-5Fzz_m409wQBabAmhVt5LZUKZPXEqKTGdOpblS4464pPDsEajZt2KP2eNl46dPhmZJnzy7YlEovz62Gy2POKXYoqXJ30KGgmLYHFRX8mT6q6Zd6TKpcElsG91N6iBoYW4XuOkCRomIJ5Ntn0CEtdUsQtDhQZ4mdbzVjRFPsKzwi1b_O8F4XNAK7JGBTyOh9CFAr2xyf6pMCmAtj1VDYM2nujJqEwJjOnmMSwjYeNBmvKtvJoHZnOCMAjOEP4dCrFb8ui6WK0DfT95p9fSXN661Poinn9aey5zs5h3fh48lR32uEMe43cv26-tD84RJv2I8PaErggsbhL02zdAq-OwM2fPhrRIN2oYMKz90gv4_xTHCKCLc31yr1kMn-_lN1XNVEsBQbno6XNLgiX8LiKBmW1n0CdQORYjUYeCNv5ZiJAoc20K96Rengj2tj1WdP1bfqesONA4980jvJFMCrMHLOu-aTw8zMAMgvnAbKfGO3ALvr8Oh7yS3li3OHJ2THHhndNIglhDU6s5Qukj3jQQQnjg_TFuTNlhcP_MUwzRsXxF9asaAQKy0QFIgOi07g0ZCM5pS3jLZhgT2SRN1uRlKK-qfox8hzCEbzrEkohi2cJvl_3m5FxV_zxilthzxWbq7V2-KMAyGFqCqTlgzmAHX522mK8ZdItwYmxbZy_qNm00)

### Nível 2 - Container
![Container](https://www.plantuml.com/plantuml/dsvg/bLFDJlD65DtxAMxf9gWXBWYrA8eY8A4_A3ykDg2kqBKzEDEEPzoPSIY8HH-YBr1rKRKIAzGdy9lqINh7nd6ou9D0ABg-Sy-vSuwFJur5RSjSU9zncOWoPR2ojZ13tzVuCCYuNPLnQPXEbBHCsa6YShyGA1tcmDXKyDYV71y4hdKzd_av6iiqjUucX40kcHuKZdzszkFoEhgBbi7TT7cxwErxbbl1OCenqvWZqEeDn41lKRsicO2ZVVZljzyXv4JR37tBZAt-LFKyLdzX7gFnl810IlPKmJIcIlTXR_bMmbcQSqbuZPQlrHuTJJ15zmoaYAUOCjE7H7C4CeFTem46IcSe-HE2LXRDO6-_tP0hgpIn8V7CszgHtd1JecWXaFBg3qV90ErRtrWg3T3kTj4MRo8u8ulTxPfgbtCBIwqT0czZM-zUKybaIj2pGl24_75MtRBOiNqNpMVm1KJ8nGENwIGCwUaIrnYI-CAwaGjfDSiG43WHwNjC6A02YMlgafa3eElct38GAkEIR6kih5_7hflDRkgtT-t3kfNJ7ZNkTXvr1urU9wzJXmLtmeBluUeYZDnr5ofbWvyCoRZujT3C6DSCj4geHB3AsKN_clrISiE9_5_cF0Jip1dKgQl-pfj1og9n-oNBgjU4gpvWwOBVZfCq6jTAiEwMVSZQJ7QALfnQ
