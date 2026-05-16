# Carbon Calculator

Uma página estática de calculadora de emissões de CO₂ com interface moderna, cards de resultado e deploy automático via GitHub Pages.

## 📌 Link do projeto

https://santanagabriela.github.io/Carbon-Calculator/

> Se o site ainda não estiver disponível, aguarde alguns minutos após o push e verifique novamente.

## ✨ Descrição

Esta aplicação permite calcular a emissão de CO₂ para viagens entre cidades brasileiras com base no modo de transporte selecionado. Ela traz:

- Autocomplete de cidades usando um banco de rotas local (`RoutesDB`).
- Preenchimento automático de distância quando a rota é conhecida.
- Cálculos de emissão por modo de transporte e comparação contra o carro.
- Estimativa de créditos de carbono e preço para compensação.
- Interface responsiva com cards limpos, emojis e contraste agradável.

## 🚀 Funcionalidades

- `RoutesDB`: base de dados de rotas brasileiras e busca de distância.
- `CONFIG`: fatores de emissão, modos de transporte e lógica de preenchimento.
- `Calculator`: cálculos de emissões, comparação, economia e créditos.
- `UI`: renderização de resultados, comparação e créditos em HTML.
- `app.js`: inicialização da página, validação de formulário e simulação de processamento.
- Deploy automático via GitHub Actions em cada `push` para `main`.

## 🧩 Estrutura do projeto

- `index.html` — estrutura semântica da página
- `css/style.css` — estilo moderno e responsivo
- `js/routes-data.js` — banco de dados de rotas
- `js/config.js` — configuração de fatores e autofill
- `js/calculator.js` — lógica de cálculo de emissões
- `js/ui.js` — renderização de cards UI
- `js/app.js` — inicialização e eventos de formulário
- `.github/workflows/deploy-pages.yml` — workflow de deploy automático

## 📁 Especificações do projeto

- HTML5 semântico com BEM
- CSS moderno com variáveis, sombras e animações
- Interface mobile-first e adaptativa
- Cards de resultados com emojis e contraste
- GitHub Pages para hospedagem gratuita

## 🛠️ How to run locally

```bash
cd "C:\Users\gabi1\Desktop\Carbon-Calculator"
# Abra index.html no navegador
```

## ✅ Deploy no GitHub Pages

O deploy já está configurado em `.github/workflows/deploy-pages.yml` e publicado automaticamente após cada push para `main`.

## 📎 Observações

- Caso a página não apareça imediatamente, aguarde a execução do workflow GitHub Actions.
- O link final utilizado neste README é o domínio padrão do GitHub Pages para o repositório.
