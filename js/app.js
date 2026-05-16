/*
  App - Inicialização e manipulação de eventos do formulário

  Este arquivo configura a lista de cidades, ativa o preenchimento automático
  da distância e gerencia o envio do formulário para calcular emissões.
*/

(function () {
  function init() {
    // Preenche a lista de cidades para autocomplete
    if (CONFIG && typeof CONFIG.populateDatalist === 'function') {
      CONFIG.populateDatalist();
    }

    // Configura auto-preenchimento de distância baseado nas cidades escolhidas
    if (CONFIG && typeof CONFIG.setupDistanceAutofill === 'function') {
      CONFIG.setupDistanceAutofill();
    }

    var form = document.getElementById('calculator-form');
    if (!form) {
      console.error('Formulário de calculadora não encontrado.');
      return;
    }

    form.addEventListener('submit', handleFormSubmit);
    console.log('✅ Calculadora inicializada!');
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    var originInput = document.getElementById('origin');
    var destinationInput = document.getElementById('destination');
    var distanceInput = document.getElementById('distance');
    var selectedTransport = document.querySelector('input[name="transport"]:checked');
    var submitButton = event.currentTarget.querySelector('button[type="submit"]');

    var originValue = originInput ? originInput.value.trim() : '';
    var destinationValue = destinationInput ? destinationInput.value.trim() : '';
    var distanceValue = distanceInput ? parseFloat(distanceInput.value) : NaN;
    var transportMode = selectedTransport ? selectedTransport.value : '';

    if (!originValue || !destinationValue || !transportMode || !distanceInput) {
      alert('Por favor, preencha origem, destino e selecione o modo de transporte.');
      return;
    }

    if (isNaN(distanceValue) || distanceValue <= 0) {
      alert('A distância deve ser um número válido maior que zero.');
      return;
    }

    if (submitButton && typeof UI.showLoading === 'function') {
      UI.showLoading(submitButton);
    }

    if (typeof UI.hideElement === 'function') {
      UI.hideElement('results');
      UI.hideElement('comparison');
      UI.hideElement('carbon-credits');
    }

    setTimeout(function () {
      try {
        var emissionValue = Calculator.calculateEmission(distanceValue, transportMode);
        var carBaselineEmission = Calculator.calculateEmission(distanceValue, 'car');
        var savingsResult = Calculator.calculateSavings(emissionValue, carBaselineEmission);
        var modesComparison = Calculator.calculateAllModes(distanceValue);
        var credits = Calculator.calculateCarbonCredits(emissionValue);
        var creditPriceEstimate = Calculator.estimateCreditPrice(credits);

        var resultsData = {
          origin: originValue,
          destination: destinationValue,
          distance: distanceValue,
          emission: emissionValue,
          mode: transportMode,
          savings: savingsResult
        };

        var comparisonHtml = '';
        var resultsHtml = '';
        var creditsHtml = '';

        if (typeof UI.renderResults === 'function') {
          resultsHtml = UI.renderResults(resultsData);
        }

        if (typeof UI.renderComparison === 'function') {
          comparisonHtml = UI.renderComparison(modesComparison, transportMode);
        }

        if (typeof UI.renderCarbonCredits === 'function') {
          creditsHtml = UI.renderCarbonCredits({
            credits: credits,
            price: creditPriceEstimate
          });
        }

        var resultsContainer = document.getElementById('results-content');
        var comparisonContainer = document.getElementById('comparison-content');
        var carbonCreditsContainer = document.getElementById('carbon-credits-content');

        if (resultsContainer) {
          resultsContainer.innerHTML = resultsHtml;
        }
        if (comparisonContainer) {
          comparisonContainer.innerHTML = comparisonHtml;
        }
        if (carbonCreditsContainer) {
          carbonCreditsContainer.innerHTML = creditsHtml;
        }

        if (typeof UI.showElement === 'function') {
          UI.showElement('results');
          UI.showElement('comparison');
          UI.showElement('carbon-credits');
        }

        if (typeof UI.scrollToElement === 'function') {
          UI.scrollToElement('results');
        }

        if (submitButton && typeof UI.hideLoading === 'function') {
          UI.hideLoading(submitButton);
        }
      } catch (error) {
        console.error('Erro ao processar o cálculo:', error);
        alert('Ocorreu um erro ao calcular as emissões. Tente novamente.');
        if (submitButton && typeof UI.hideLoading === 'function') {
          UI.hideLoading(submitButton);
        }
      }
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();