/*
  Calculator - Biblioteca de cálculos de emissões de CO₂

  Estrutura:
  - calculateEmission(distanceKm, transportMode): calcula emissão para um modo de transporte
  - calculateAllModes(distanceKm): compara emissões de todos os modos com o carro
  - calculateSavings(emission, baselineEmission): calcula economia em kg e percentual
  - calculateCarbonCredits(emissionKg): calcula créditos de carbono necessários
  - estimateCreditPrice(credits): calcula faixa de preço de créditos de carbono

  Nota: este arquivo define apenas a variável global `Calculator`.
*/

var Calculator = {
  /*
    Calcula a emissão de CO₂ em kg para uma distância e modo de transporte.
    Usa o fator de emissão definido em CONFIG.EMISSION_FACTORS.
  */
  calculateEmission: function (distanceKm, transportMode) {
    var factor = 0;
    if (CONFIG && CONFIG.EMISSION_FACTORS && CONFIG.EMISSION_FACTORS.hasOwnProperty(transportMode)) {
      factor = CONFIG.EMISSION_FACTORS[transportMode];
    }
    var emission = Number(distanceKm) * Number(factor);
    return Math.round(emission * 100) / 100;
  },

  /*
    Calcula emissões para todos os modos de transporte e compara com o carro.
    Retorna um array ordenado pela emissão (menor primeiro).
  */
  calculateAllModes: function (distanceKm) {
    var results = [];
    var carEmission = this.calculateEmission(distanceKm, 'car');

    for (var mode in CONFIG.EMISSION_FACTORS) {
      if (CONFIG.EMISSION_FACTORS.hasOwnProperty(mode)) {
        var emission = this.calculateEmission(distanceKm, mode);
        var percentageVsCar = carEmission > 0 ? (emission / carEmission) * 100 : 0;
        results.push({
          mode: mode,
          emission: emission,
          percentageVsCar: Math.round(percentageVsCar * 100) / 100
        });
      }
    }

    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  /*
    Calcula quanto é economizado em relação a um baseline.
    Retorna kg salvos e percentual de economia.
  */
  calculateSavings: function (emission, baselineEmission) {
    var savedKg = Number(baselineEmission) - Number(emission);
    if (savedKg < 0) {
      savedKg = 0;
    }
    var percentage = baselineEmission > 0 ? (savedKg / Number(baselineEmission)) * 100 : 0;
    return {
      savedKg: Math.round(savedKg * 100) / 100,
      percentage: Math.round(percentage * 100) / 100
    };
  },

  /*
    Converte a emissão em kg CO₂ para créditos de carbono,
    usando CONFIG.CARBON_CREDIT.KG_PER_CREDIT.
  */
  calculateCarbonCredits: function (emissionKg) {
    var creditsPerKg = 0;
    if (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.KG_PER_CREDIT) {
      creditsPerKg = Number(CONFIG.CARBON_CREDIT.KG_PER_CREDIT);
    }
    var credits = creditsPerKg > 0 ? Number(emissionKg) / creditsPerKg : 0;
    return Math.round(credits * 10000) / 10000;
  },

  /*
    Estima o preço mínimo, máximo e médio para os créditos de carbono calculados.
  */
  estimateCreditPrice: function (credits) {
    var minPrice = 0;
    var maxPrice = 0;
    if (CONFIG && CONFIG.CARBON_CREDIT) {
      minPrice = Number(CONFIG.CARBON_CREDIT.PRICE_MIN_BRL || 0);
      maxPrice = Number(CONFIG.CARBON_CREDIT.PRICE_MAX_BRL || 0);
    }
    var totalMin = credits * minPrice;
    var totalMax = credits * maxPrice;
    var average = (totalMin + totalMax) / 2;
    return {
      min: Math.round(totalMin * 100) / 100,
      max: Math.round(totalMax * 100) / 100,
      average: Math.round(average * 100) / 100
    };
  }
};
