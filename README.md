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
![Componentes](https://www.plantuml.com/plantuml/dsvg/bLN1ZkD44BtdAufSrYF8MB2SHWAjnyxkPEN4mNPcu1Hrt3r9exOxwcxFi48h8N7W1_W1n049QKvyGlw4Bw4wySI9fmF1f_YvtgkgLrsTDzeGPUfIz3xXLI5goc1bp5fV-RuYZvTBRbRrejPC5R8oh3ANXIpzjI2LvGoqeO8l_F3BmTH2it7ibqGRfX2QXx9SoyforbQ_5mVV9RDydYVJUPJSJRoBP-HkbD_Cu-6xuIH2i6Uu4GmYJfQAb0GeWxqIq-1DDayFJC3h2_ZxfryXc8uW7MOvUBTC6LuGWGglu2lxG1YCWoY0pw_WRPfCSjJVVUY5s0pX5LFUlThsHJ-3Vh0MoD_yiVbTmXrRz16woSSnV0evuUAHLpJCCdnxJnv8LYY-DZPaX7HrJme6L4AjwyrlYilB_iiglhYonNOBc5_Bkg94VV38cgFSlX_Rt4HITlcznfp37zQAQTs_W1zxFS3d5Gm60mXcs5G-2eFDBvkV4_3GsmGm5wfSs81jg95BPbPC8HLsJskeHsgpiiKeAGHJjW04e4LiYqroI6LjTaWibxm21iX6aMVNi6btWZ6dLB17ejXpWXOvID11RudWj9d7-xkyKVzus7-8KqsJE1wc6KH32D7d387pMYy4jqVggFjmXtKC2DDP14suTdPPIYCLruOSgOsVKPVUdk9MV62yg8KyqhjbcoSBkkGUcc_wltnAfiCq24V991XbPnf52b8koB5HE1W4kvszOzhOUL46HHFXRiyGnUwF9NCB_OlWZkAMKx9ZVOh0QIaRxXPQSMt7KXmRVyEH-fU5EvhufcjXIElwnnUB__eAheD9c7HNFrfuT84QrwGgjbL5X4fjLSSViczY-sFAbBQf_wmAJWxlbBVnxDi4ReUfNVwuKKwPc4VoiJgur5wizpJ9Sl25tL_KSp1SM-4te7PJt8VVtyCdQAuJxZVW2Ohh9FeDU8BYE6Z-3Zj1U76KV4HE1RkFYx-7TpDhxpMe99ICI_2mPa89S1HI9QFS_c-GDaVdtdJFPOgLiINhdwIvPtC6qJMTCsYk2Pr1Sqxf31P6_6-EUs8j4SVLVj4m-1gs-zaAEWQnNMDSsSEyJkDTWGwZNM4EOrrXNIFTKLtZN36jKUx0DwoYTId-0G00)

### Nível 4 - Código
![Código](https://www.plantuml.com/plantuml/dsvg/RPBDRXCn58NtVWgp8X59i-bg5gWXhH1IVr0RLWXLD_PjSi5Z3_RrjEL7uY5u3LOyGj-49y5coaoST3NMEUUU-Qxiey3WETP6F2EhJDGeDynDg6Op3xS7Q-9DNCM0NZdBQFb0kNhM6B1vPXfO6rhD5eVJjrbwTtOwgo4m-YHT7zzRg4aTDBbT22OsA8y9rXvga1hbuk6tfhMJe_E7NoqQUJYMVtxyb4lmU0DouInxPmnw8Pul38I0GQZyVKmC0VbLIFb2UGBVMIEFdoVIOnXdmr3W_queBU08Xhw0l-9qt34r6kGdAh-BWkCAVKiAjo166hGBu-enC32CUktzXwT-JteYmx_ZH7wCWUc6532rC7GDN2cTvDQHpcARYdHVr9KaU-MSGR2xp9VOk43i_7s77Q354MUh_DKDMJqtfkJkv5VtRtH2AEAnqS2ujym-FGxmksWT4EbAnjYjnjIuIfwSBozFNi_bDxcuE3rPviFoyc8npma52keLN6zFAKDe6GkjTkmy1IwJBPAAnXKQMeqUbRl6ErHHGG88xCckiwaXDS0wPK139VFEMUwMtGuMTzWR_SBpo9ipqjhWBNZi5c_HvmdmI_S9RV_g9jBY7O_pxDxhdqvVxZp5IgeDr20AjSyLrr_91dsWm2Zsl64WnMgmr4G3egJkGmLIQlMESOqoVI288xGwrkOl)
