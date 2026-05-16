/*
  UI - Funções de renderização e utilitários de interface

  Estrutura:
  - formatNumber(number, decimals): formata número com separador de milhar
  - formatCurrency(value): formata valor em reais no padrão pt-BR
  - showElement(elementId): mostra elemento removendo classe hidden
  - hideElement(elementId): esconde elemento adicionando classe hidden
  - scrollToElement(elementId): rola suavemente até elemento
  - renderResults(data): renderiza HTML do card de resultados
  - renderComparison(modesArray, selectedMode): renderiza cards de comparação por modo
  - renderCarbonCredits(creditsData): renderiza cards de créditos de carbono
  - showLoading(buttonElement): ativa estado de loading no botão
  - hideLoading(buttonElement): restaura texto do botão

  Nota: este arquivo define apenas a variável global `UI`.
*/

var UI = {
  /* Formata um número com casas decimais e separadores de milhar no padrão pt-BR. */
  formatNumber: function (number, decimals) {
    var value = Number(number) || 0;
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /* Formata um valor como moeda em reais no padrão pt-BR. */
  formatCurrency: function (value) {
    var amount = Number(value) || 0;
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  /* Exibe um elemento removendo a classe hidden. */
  showElement: function (elementId) {
    var element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
    }
  },

  /* Oculta um elemento adicionando a classe hidden. */
  hideElement: function (elementId) {
    var element = document.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    }
  },

  /* Rola suavemente até o elemento especificado. */
  scrollToElement: function (elementId) {
    var element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /*
    Renderiza o HTML de resultados principais.
    data: { origin, destination, distance, emission, mode, savings }
  */
  renderResults: function (data) {
    var modeMeta = CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[data.mode] ? CONFIG.TRANSPORT_MODES[data.mode] : {};
    var savingsHtml = '';

    if (data.mode !== 'car' && data.savings && data.savings.savedKg > 0) {
      savingsHtml = "<div class='results__card results__card--savings'>" +
        "<strong>Economia:</strong> " +
        UI.formatNumber(data.savings.savedKg, 2) + " kg (<span>" + UI.formatNumber(data.savings.percentage, 2) + "%</span>)" +
        "</div>";
    }

    return "<div class='results__grid'>" +
      "<div class='results__card'>" +
        "<h3>Rota</h3>" +
        "<p>" + data.origin + " ➔ " + data.destination + "</p>" +
      "</div>" +
      "<div class='results__card'>" +
        "<h3>Distância</h3>" +
        "<p>" + UI.formatNumber(data.distance, 0) + " km</p>" +
      "</div>" +
      "<div class='results__card'>" +
        "<h3>Emissão</h3>" +
        "<p>🌿 " + UI.formatNumber(data.emission, 2) + " kg CO₂</p>" +
      "</div>" +
      "<div class='results__card'>" +
        "<h3>Transporte</h3>" +
        "<p>" + (modeMeta.icon || '') + " " + (modeMeta.label || data.mode) + "</p>" +
      "</div>" +
      savingsHtml +
    "</div>";
  },

  /*
    Renderiza a comparação de todos os modos de transporte.
    modesArray: [{ mode, emission, percentageVsCar }]
  */
  renderComparison: function (modesArray, selectedMode) {
    if (!Array.isArray(modesArray)) {
      return '';
    }

    var maxEmission = modesArray.reduce(function (max, item) {
      return item.emission > max ? item.emission : max;
    }, 0) || 1;

    var html = "<div class='comparison__list'>";

    modesArray.forEach(function (item) {
      var modeMeta = CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[item.mode] ? CONFIG.TRANSPORT_MODES[item.mode] : {};
      var selectedClass = item.mode === selectedMode ? ' comparison__item--selected' : '';
      var badgeHtml = item.mode === selectedMode ? "<span class='comparison__badge'>Selecionado</span>" : '';
      var progressWidth = Math.round((item.emission / maxEmission) * 100);

      html += "<div class='comparison__item" + selectedClass + "'>" +
        "<div class='comparison__header'>" +
          "<span class='comparison__icon'>" + (modeMeta.icon || '') + "</span>" +
          "<div>" +
            "<strong>" + (modeMeta.label || item.mode) + "</strong>" +
            "<p>" + UI.formatNumber(item.emission, 2) + " kg CO₂</p>" +
          "</div>" +
          badgeHtml +
        "</div>" +
        "<div class='comparison__stats'>" +
          "<span>" + UI.formatNumber(item.percentageVsCar, 0) + "% do carro</span>" +
        "</div>" +
        "<div class='comparison__bar'>" +
          "<div class='comparison__bar-fill' style='width: " + progressWidth + "%'></div>" +
        "</div>" +
      "</div>";
    });

    html += "</div>";
    return html;
  },

  /*
    Renderiza a seção de créditos de carbono com cards e botão de ação.
  */
  renderCarbonCredits: function (creditsData) {
    var credits = UI.formatNumber(creditsData.credits, 4);
    var averagePrice = UI.formatCurrency(creditsData.price.average);
    var minPrice = UI.formatCurrency(creditsData.price.min);
    var maxPrice = UI.formatCurrency(creditsData.price.max);

    return "<div class='carbon-credits__grid'>" +
      "<div class='carbon-credits__card'>" +
        "<h3>Créditos necessários</h3>" +
        "<p class='carbon-credits__value'>" + credits + "</p>" +
        "<p class='carbon-credits__helper'>1 crédito = 1000 kg CO₂</p>" +
      "</div>" +
      "<div class='carbon-credits__card'>" +
        "<h3>Preço estimado</h3>" +
        "<p class='carbon-credits__value'>" + averagePrice + "</p>" +
        "<p class='carbon-credits__helper'>Faixa: " + minPrice + " - " + maxPrice + "</p>" +
      "</div>" +
      "</div>" +
      "<div class='carbon-credits__info'>" +
        "<p>Créditos de carbono ajudam a compensar as emissões gerando equivalentes ambientais. Use este valor como referência para ações sustentáveis.</p>" +
      "</div>" +
      "<button class='carbon-credits__button' type='button'>🛒 Compensar Emissões</button>";
  },

  /*
    Mostra estado de carregamento em um botão e preserva o texto original.
  */
  showLoading: function (buttonElement) {
    if (!buttonElement) return;
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /*
    Restaura o texto original do botão após o carregamento.
  */
  hideLoading: function (buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  }
};
