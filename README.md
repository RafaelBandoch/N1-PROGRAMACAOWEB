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
![Contexto](https://www.plantuml.com/plantuml/dsvg/XL8zJbj14EvzYWcLaOojIAbIWO109C1MR0UbiiQxWrcoR-UnFuQaoY5oWIW5bQiSuTqa9ycittks9HBIhMRc-zblvZ14z34LjlFAE6MJ9hYDiGnl1mEF3_s5YRTfdW9vnIwIYtt5nQ2qw3Bc84HjpNnm_EPWb4lJouj1WI6IbzBiE2CUOx_Cx9sBeq_3wMGs6Ovc9yFhg-v-Mxb-FpcVNPoUdLwTIB4JJRG49mON7Wi4yTFmC7IlgjMIBBpUXz_VliFOY58zSaOXLZzvFOtL4nPp39tEY7nWr-MIF6hsFTWRDayuqeLnWlSOpPBtfFKkEMNOLJ-y4Hu4AafF0Vj2g34FWhA6n4deGS6HlQ1HtakgLYfP3a2WMcr1UOCGqTCDvWxx1Jhp5S5pbFRU_iRTXaiyNBRl5mrzD26XpMGXrOIWJHv34SBOz1Y49wOWqB0nubWy5YNl6cY-9Oh7zIkBZoW4HhYfLi4e8KjmbtorqaQ9WJ5ReqmKVV9BKprnoC4BrDD2lg7OKbnZecS1wsqmQztnbxotRbWe4VhF4hENezAQJ91x3pI7-qIm84yI3xQgePKDGBNisjFkGjX9tMwMqgjNqMjZahitel_B6yMmFfcSFjeToxFJnvZZKfzJcUFAhscvtXLvZuLuGHWZZa5l7UOgvqBf-OuYYvLfG8rGafYX-sHAwQ77zaQQdneNoJi4dS61t9BjqcIoUdaVoEuSTftbvb9bocZKb5DvwGwpzVF9P3GMHY7StcBBs9nQExzxNy-kwnbRUrXRhkVGaFwDttvlc_bPasgB-KiykpI7v7Ggx1y0)

### Nível 2 - Container
![Container](https://www.plantuml.com/plantuml/dsvg/bLDBRXD14DtFAGglRE7O4cALLHBRv2D_J6QIY9LLdkvC6lLq3zqz3Wb2uX1S0B5086KLSOAv2IUXUYRjZrYWI5wKQ-gzgdhr-i0wDAxCPVH2g5IMZCEDSuNTx_SDtlOouMxAPMcvIRLoNBbUglD-8L5vp9vrJ8fbV_1wR-vJ5vDnFqVhkA7KOa0858gRNk7ve_7Xkzb5iaXcyyLmTZLjTqBcwZGvMOn7nwFfa9AH4qvo60hC3EO8DD6QoK9xMZsik8HN7VZpvIl4WherHSVSkkgxhkkn-e7v4cqKpGcaLLiNt23JfWkjsLC8XomNYl06dLZf5dqQ84F_7sXHmP1nsuNK20JIY5-Z1GxQPAZ4FOBH3cslrGaTSksq8JOadac8FUcbi2NA004cgc-UaWEwfxnr55gWtg7H5cyg1Kt3_NHDjCMvYwNK3a4Kttbn5aUwL0pDNTjcAM7_8rch0v-Y200sghUlJNryHkZ3GegKQZtiYY_zC2V9P0ml8K4XRuLYWpYcVsUumfYqAvml6IbdU8Q088Z8N6FA0JKeN56MRj43sZONZeFKcL2aUdE9UhJTOpIzAHzMxS8ggB7-L1ydIBpzePQhKMTtHIo4tsv-2kUZEF4pJpNZlVUMTXbzB0otrYVdHgSK8ZZj9QUVuHzAOGLr-Ctz7G0t2lNg1jNFl2aaFrC51yMpwZ4LkWjO-ZSLoca_AZTQyiseNSZMHrglTICezMX4gg4sDd4fbFzkDLossPAcFaALrWH34hlUOt8NlntxmBlC6sAzq4PkO1fiOvPzU38VpRCsDyMNl7f8Iwaf30QYC5c_blFmI3v7qJcNMyzmsrADeYk16qCqlahcCM49k7bTpqM6z_CiN0tSr3VUU8FtkyVsYBDuDkrljwjhQz77rI_WK0HzMP2UXEydWpdL7n1xcSk_)

---

## Planejamento de Tarefas

<img width="1629" height="581" alt="planejamento" src="https://github.com/user-attachments/assets/d7970e3b-165d-49a1-9a3b-69ad7bc3b20c" />
