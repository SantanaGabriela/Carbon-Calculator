/*
  CONFIG - Configurações e utilitários para a Calculadora de Emissões

  Estrutura:
  - CONFIG.EMISSION_FACTORS: fatores de emissão (kg CO2 por km)
  - CONFIG.TRANSPORT_MODES: metadados de cada modo (label, icon, color)
  - CONFIG.CARBON_CREDIT: parâmetros para créditos de carbono
  - CONFIG.populateDatalist(): popula o <datalist id="cities-list"> usando RoutesDB.getAllCities()
  - CONFIG.setupDistanceAutofill(): configura listeners para preencher distância automaticamente

  Nota: este arquivo define uma única variável global `CONFIG`.
*/

var CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta", icon: "🚲", color: "#2e7d32" },
    car:     { label: "Carro",     icon: "🚗", color: "#1e88e5" },
    bus:     { label: "Ônibus",    icon: "🚌", color: "#6a1b9a" },
    truck:   { label: "Caminhão",  icon: "🚛", color: "#ff7043" }
  },

  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  /*
    populateDatalist: popula o elemento <datalist id="cities-list"> com opções
    obtidas a partir de RoutesDB.getAllCities().
  */
  populateDatalist: function () {
    if (typeof RoutesDB === 'undefined' || !RoutesDB.getAllCities) return;
    var cities = RoutesDB.getAllCities();
    var list = document.getElementById('cities-list');
    if (!list) return;
    // Limpar opções existentes
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    // Criar options
    for (var i = 0; i < cities.length; i++) {
      var opt = document.createElement('option');
      opt.value = cities[i];
      list.appendChild(opt);
    }
  },

  /*
    setupDistanceAutofill: configura listeners para origem/destino e checkbox manual
    - Preenche `#distance` automaticamente usando RoutesDB.findDistance()
    - Controla o estado readonly do input de distância conforme checkbox
  */
  setupDistanceAutofill: function () {
    var originEl = document.getElementById('origin');
    var destinationEl = document.getElementById('destination');
    var distanceEl = document.getElementById('distance');
    var manualCheckbox = document.getElementById('manual-distance');
    var helper = document.getElementById('distance-help');

    if (!distanceEl || !helper) return;

    // função auxiliar para tentar preencher a distância automaticamente
    function tryAutoFill() {
      if (!originEl || !destinationEl) return;
      var originVal = originEl.value ? originEl.value.trim() : '';
      var destVal = destinationEl.value ? destinationEl.value.trim() : '';

      // se modo manual ativado, não sobrescrever
      if (manualCheckbox && manualCheckbox.checked) {
        helper.textContent = 'Modo manual ativado — insira a distância (km).';
        helper.style.color = '#666666';
        return;
      }

      if (originVal && destVal) {
        var dist = null;
        if (typeof RoutesDB !== 'undefined' && RoutesDB.findDistance) {
          dist = RoutesDB.findDistance(originVal, destVal);
        }
        if (dist !== null && dist !== undefined) {
          distanceEl.value = dist;
          distanceEl.setAttribute('readonly', 'readonly');
          helper.textContent = 'Distância encontrada e preenchida automaticamente.';
          helper.style.color = '#4caf50'; // verde sucesso
        } else {
          distanceEl.value = '';
          distanceEl.setAttribute('readonly', 'readonly');
          helper.textContent = 'Rota não encontrada — marque "Inserir distância manualmente" para preencher manualmente.';
          helper.style.color = '#666666';
        }
      } else {
        // se algum campo está vazio, restaurar helper
        distanceEl.value = '';
        distanceEl.setAttribute('readonly', 'readonly');
        helper.textContent = 'A distância será preenchida automaticamente';
        helper.style.color = '#666666';
      }
    }

    // Listeners para origem/destino
    if (originEl) originEl.addEventListener('change', tryAutoFill);
    if (destinationEl) destinationEl.addEventListener('change', tryAutoFill);

    // Listener para checkbox manual
    if (manualCheckbox) {
      manualCheckbox.addEventListener('change', function () {
        if (manualCheckbox.checked) {
          distanceEl.removeAttribute('readonly');
          helper.textContent = 'Modo manual ativado — insira a distância (km).';
          helper.style.color = '#666666';
          distanceEl.focus();
        } else {
          // Re-tentar preencher automaticamente
          tryAutoFill();
        }
      });
    }

    // Tenta preencher ao inicializar (caso já existam valores)
    tryAutoFill();
  }
};
