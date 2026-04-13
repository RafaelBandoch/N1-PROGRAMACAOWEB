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

### Diagrama Entidade-Relacionamento (DER)

<img width="800" height="370" alt="DER" src="https://github.com/user-attachments/assets/477c741e-ec62-4e5e-b49c-2a7ce3cd8d7f" />

---

## 3. Requisitos Funcionais (RF)

| ID   | Descrição |
|------|-----------|
| RF01 | Cadastro de caçambas |
| RF02 | Cadastro de motoristas |
| RF03 | Cadastro de veículos |
| RF04 | Cadastro de clientes |
| RF05 | Criar tarefa - Entrega, Coleta ou Troca |
| RF06 | Alterar status da tarefa - EM ANDAMENTO, ENTREGUE, COLETADO, CANCELADO, JUSTIFICADO |
| RF07 | Criar rota diária |
| RF08 | Histórico da caçamba |

---

## 4. Requisitos Não Funcionais (RNF)

| ID    | Descrição |
|-------|-----------|
| RNF01 | Responsividade - Interface adaptada para desktop e dispositivos móveis |
| RNF02 | Segurança - Autenticação e controle de acesso |

---

## Arquitetura

| Camada        | Tecnologia               |
|---------------|--------------------------|
| Frontend      | HTML + TailwindCSS + JavaScript |
| Backend       | Node.js + Express        |
| Banco de Dados | MySQL                   |

---

## Modelo C4

### Nível 1 - Contexto
![Contexto](https://www.plantuml.com/plantuml/dsvg/XL9DRbCn4Dxd54DNgPGcGcB5gbLRMgIsYKXAnIgQ-4sJGNxsmsEdm8f3S074egkiECAx2ITXdCHHL53PZMVc-x4_7ql445DjEo_O6PigWaMCZRmU308-zESS5scMX8BnBfABVUFhGMFHPSoHnChoR73wwcYKMxVNLuCQ9LBGrlGq8px7VfFPErSd7uQta-baE9gU3UzkkeUbS_TsSZczEhyulpdJPYToj0HdZFE0DOBwsV9uwDwqgoLPU7a8lxzzXp6hqcRbWYIsF_rw6zj7h6SedSw8WdZNzGq5h7pemS5mMy99LRDJVC38It-WepV96VQk_H5OUH2eRW89zfMmmhm8nZAf4-b1xQCFYaQjbzIkJB9UWC0KRKK5HeWOw1xpn8SvElwA47pKyS5XCRUZKWlNfNxMptkMX3PpIThmGSLv3LK7utRcGQ8UHA6oy-6yMgmRlwU_lPGAdcwgh3qY4Ozmtww4ZN8b-9X2kwhOgFxOMpQiga9XoUsZLmq2XGQQwosCjnJNc1YymJmhpv9bE-ClERMkp8qA_IV2xEMaiPm9yko1Pl0f4Smfa3ECHLMAh01jPANebZYyqxxTHTBR1D4hhqImODN_5TXuM7-O_FXervRVaTtxH1ldvLTa2rnXHTd3SvddkrnE9gEnCcR2NV25SPjhsTyFyscKVxEL6FUvda8b_Hj_JAvAjVq3)

### Nível 2 - Container
![Container](https://www.plantuml.com/plantuml/dsvg/bLDBRXD14DtFAGglRE7O4cALLHBRv2D_J6QIY9LLdkvC6lLq3zqz3Wb2uX1S0B5086KLSOAv2IUXUYRjZrYWI5wKQ-gzgdhr-i0wDAxCPVH2g5IMZCEDSuNTx_SDtlOouMxAPMcvIRLoNBbUglD-8L5vp9vrJ8fbV_1wR-vJ5vDnFqVhkA7KOa0858gRNk7ve_7Xkzb5iaXcyyLmTZLjTqBcwZGvMOn7nwFfa9AH4qvo60hC3EO8DD6QoK9xMZsik8HN7VZpvIl4WherHSVSkkgxhkkn-e7v4cqKpGcaLLiNt23JfWkjsLC8XomNYl06dLZf5dqQ84F_7sXHmP1nsuNK20JIY5-Z1GxQPAZ4FOBH3cslrGaTSksq8JOadac8FUcbi2NA004cgc-UaWEwfxnr55gWtg7H5cyg1Kt3_NHDjCMvYwNK3a4Kttbn5aUwL0pDNTjcAM7_8rch0v-Y200sghUlJNryHkZ3GegKQZtiYY_zC2V9P0ml8K4XRuLYWpYcVsUumfYqAvml6IbdU8Q088Z8N6FA0JKeN56MRj43sZONZeFKcL2aUdE9UhJTOpIzAHzMxS8ggB7-L1ydIBpzePQhKMTtHIo4tsv-2kUZEF4pJpNZlVUMTXbzB0otrYVdHgSK8ZZj9QUVuHzAOGLr-Ctz7G0t2lNg1jNFl2aaFrC51yMpwZ4LkWjO-ZSLoca_AZTQyiseNSZMHrglTICezMX4gg4sDd4fbFzkDLossPAcFaALrWH34hlUOt8NlntxmBlC6sAzq4PkO1fiOvPzU38VpRCsDyMNl7f8Iwaf30QYC5c_blFmI3v7qJcNMyzmsrADeYk16qCqlahcCM49k7bTpqM6z_CiN0tSr3VUU8FtkyVsYBDuDkrljwjhQz77rI_WK0HzMP2UXEydWpdL7n1xcSk_)

### Nível 3 - Componentes
![Componentes](https://www.plantuml.com/plantuml/dsvg/bPRDRXit4CVlUeefJmugUm_jAQSuSj4Fs45YE-an62sd4XikkHYIIjsYGD-XJz1JWG8vvH7q9dsIagoqzbWhGp9yMFqry-CCvsFr8aJac3ex-SAurYPDi8on3y-RXl7ZsSB4PPgdGDnw5yd5izPtJM_H5P_J4BKrysRszUdh8hszkcmw394uI-zdlkkzApvzuK-YYPRWrVhJYYny1V_-yISC9XIUmqjiFv3JSFxw-ybavbr4uuZVl_J9QUIx4-pD5DG3ApY5LrxJsSy1leHlVkcPGb3FuBV91Ex99vZYyjgdI3o5-gVEimB_Iwfg6ts3kFzADVdCfW3KCy6C63v8vcrMZc0MG7W4vMBoaAhg1qbz2be1ZwajQWoH_G1MiuqYmNkfMq3cxjphbT7QqaTaccxlzLuQm3kIUeVMQ8JeSodXXnzl7yLCp9w_GwTjZRZ4LXJOI8Mo5ttB614A8S32-ZcQC1RvBB8TC3Noqd7ixKE-sj7KfLyO1mrOl_0fZhI519UsE0myktvx0PeW8jDFEDeR0the3O7PH_wMc5nh4DX73A3D-YyskAzFXaE6Ff74qTXn_JTsSvp2bO-UJOZvyHsjFxN9-YdCh2aZFbQ6crKx1L666-ALQKaCaTGsEI4Gh6eV3HqaAo7PfHA7iMyYnXIci3GXhZ-pQVqKc1QCeTJ7qMBzkJL-h43rH54WITzpuFc2Ku_RoaFl6RhjFUwfKZr9L4bYvJ5Yw0Xwuf3P19cO5KsZ4t9DlPSJKfHWekUxWQfsDFKc4HkgTvL2AhtcHueZwQKunz6VdfHA5uKGf0FWxEFU4IcESaGaIgAF7v5hiZjlhTrjssC8M9ebErMVUgz7-eYNpe4-Ew-K9tn4Gi98Bc55hiNEk6NsGYvTF-vLKZpUIspFWxtaHjprshZ9HCHIKodSusNevTEudGnMx1LX9yCJYw7OoG27eyHaIw08ISoej1CXYN6JTY8aEJiRkzyV_Cwxc9_eUVxcwkxcpILSOCGv1b9RfJoSSuU_aaE8Nli0-LzZUT0UwZxhQjBbQ9bbvThrFms5bcbLeHcPZOUfET1MPlkqhSnul-qBSZfrzZy0)

### Nível 4 - Código
![Código](https://www.plantuml.com/plantuml/dsvg/XL6zRhCm5DrvYZlowGjR9uOgYD0gLKAaXCoLYsyYgmxGwmjILFMHElKHycArZLGPEdJY_1pE0NjfM13t5nsnOerGtZu7r7072UItBwdERGfR2thTWaIe1E59c2YgjJ36KlEQjmrJgpKIl4S0_sj2mUYScF1j0OJcdzFxJbhzm89xCtNEo2uUgX_XmW5fK3M6zR7j4hzhbLo0yT1xMXcE7Ke6eLMGyvdvp1wxrYXkwJek6J5WpDRuS-Ua6fbf7SyAVKsYP0fDVtb1Seol7QPWc5HpTdniINr-B7TghHKsl9wyAKaDI5DjF0oPSGeh2zmyMZTeyzzGR9-pSfLjYxBQMMeV--BnM5YOxpP5bQsSccTbNcn6_7GyLEk7TMwPwvnTSvBSX_SI1TXviyECflGduNN7mdzVOYFxY_u6)
