# Dados para a Chrome Web Store

Aqui estão as informações sugeridas para preencher ao publicar sua extensão "Transcritor de Reuniões (Meet & Teams)" na Chrome Web Store.

## Informações do Item (Detalhes da Ficha)

### Nome (Máx. 45 caracteres)
Transcritor de Reuniões (Meet & Teams)

### Resumo (Máx. 132 caracteres)
Transcreva reuniões do Google Meet e Microsoft Teams em tempo real a partir das legendas e exporte tudo para um arquivo TXT.

### Descrição (Sem limite rígido, mas seja claro e objetivo)
O **Transcritor de Reuniões (Meet & Teams)** é uma extensão simples e poderosa que ajuda você a não perder nenhum detalhe das suas chamadas de vídeo. 

Através das legendas geradas automaticamente pelo Google Meet e pelo Microsoft Teams, a extensão captura o texto falado em tempo real e permite que você exporte o conteúdo completo da reunião para um arquivo `.txt` com apenas um clique.

**Principais Funcionalidades:**
- 🔴 **Captura em Tempo Real:** Lê as legendas ativas da sua reunião no Google Meet ou Microsoft Teams.
- 💾 **Exportação Fácil:** Salve a transcrição completa diretamente no seu computador em formato de texto (.txt).
- 🔒 **Privacidade Total:** Todo o processamento é feito localmente no seu navegador. Os dados da sua reunião não são enviados para nenhum servidor externo.
- ⚡ **Simples de Usar:** Basta ativar as legendas na sua reunião, abrir a extensão e iniciar a gravação.

**Como Usar:**
1. Entre em uma reunião no Google Meet ou Microsoft Teams.
2. Ative a opção de "Legendas" (Captions) na plataforma.
3. Abra a extensão e clique em "Iniciar Transcrição".
4. Ao final, clique em "Parar e Exportar" para baixar o arquivo.

Ideal para atas de reunião, estudantes, jornalistas e qualquer profissional que precise manter um registro escrito de suas conversas importantes!

---

## Detalhes da Categoria e Metadados

- **Categoria:** Produtividade (Productivity) ou Fluxo de trabalho e planejamento (Workflow & Planning)
- **Idioma principal:** Português (Brasil)

## Privacidade e Práticas de Dados (Declaração)

Você precisará preencher um formulário de privacidade. Com base nas permissões atuais do seu `manifest.json`, aqui estão as justificativas:

- **Propósito único (Single Purpose):** Transcrever reuniões capturando textos de legendas na tela e salvando em um arquivo local.
- **Uso de Permissões:**
  - `storage`: Usado para salvar temporariamente os textos capturados durante a reunião para que não se percam se você fechar o popup.
  - `downloads`: Usado exclusivamente para baixar o arquivo `.txt` contendo a transcrição final para a máquina do usuário.
  - `activeTab` e `scripting`: Usados para injetar o script na aba ativa do Meet ou Teams e conseguir ler o conteúdo do DOM (as legendas que aparecem na tela).
  - *Host Permissions* (`https://meet.google.com/*`, `https://teams.live.com/*`, `https://teams.microsoft.com/*`): Necessário para que a extensão tenha acesso restrito apenas aos sites onde a captura é suportada.

- **Coleta de Dados:** A extensão **NÃO** coleta dados pessoais, **NÃO** envia dados para a internet e **NÃO** vende informações. Tudo acontece localmente no navegador do usuário.

---

## Assets Visuais Necessários (O que você precisa criar/enviar)

- **Ícones da Extensão:** 16x16, 32x32, 48x48 e 128x128 pixels (já devem estar no seu projeto ou serão necessários para o upload).
- **Ícone da Loja:** 128x128 pixels.
- **Capturas de Tela (Screenshots):** Pelo menos 1 screenshot (recomendado de 3 a 5), tamanho exato de 1280x800 ou 640x400 pixels.
- **Banner Promocional (Marquee):** 1 banner de 440x280 pixels.
