/*
  RoutesDB - Banco de dados local de rotas

  Estrutura:
  - RoutesDB.routes: array de objetos { origin, destination, distanceKm }
    origin/destination: strings com cidade e estado (ex: "São Paulo, SP")
    distanceKm: número (distância em km)

  Métodos:
  - getAllCities(): retorna array único e ordenado de nomes de cidades
  - findDistance(origin, destination): busca a distância entre duas cidades (busca em ambas as direções)

  Observação: este arquivo define apenas a variável global `RoutesDB`.
*/

var RoutesDB = (function () {
  var db = {
    routes: [
      { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
      { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
      { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
      { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
      { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
      { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
      { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKm: 710 },
      { origin: "Porto Alegre, RS", destination: "Florianópolis, SC", distanceKm: 450 },
      { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
      { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 800 },
      { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 320 },
      { origin: "Recife, PE", destination: "Natal, RN", distanceKm: 300 },
      { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 540 },
      { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1420 },
      { origin: "Belém, PA", destination: "São Luís, MA", distanceKm: 920 },
      { origin: "Brasília, DF", destination: "Belo Horizonte, MG", distanceKm: 720 },
      { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 200 },
      { origin: "Goiânia, GO", destination: "São Paulo, SP", distanceKm: 830 },
      { origin: "Campinas, SP", destination: "Ribeirão Preto, SP", distanceKm: 245 },
      { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
      { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 440 },
      { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 408 },
      { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKm: 525 },
      { origin: "Fortaleza, CE", destination: "São Luís, MA", distanceKm: 630 },
      { origin: "Manaus, AM", destination: "Porto Velho, RO", distanceKm: 740 },
      { origin: "Belém, PA", destination: "Macapá, AP", distanceKm: 575 },
      { origin: "João Pessoa, PB", destination: "Recife, PE", distanceKm: 120 },
      { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 260 },
      { origin: "Maceió, AL", destination: "Aracaju, SE", distanceKm: 230 },
      { origin: "Natal, RN", destination: "João Pessoa, PB", distanceKm: 180 },
      { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 313 },
      { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 540 },
      { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 260 },
      { origin: "Campinas, SP", destination: "São José dos Campos, SP", distanceKm: 100 },
      { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1410 },
      { origin: "Florianópolis, SC", destination: "Curitiba, PR", distanceKm: 300 }
    ],

    // Retorna array único e ordenado de cidades (origem + destino)
    getAllCities: function () {
      var arr = [];
      for (var i = 0; i < this.routes.length; i++) {
        arr.push(this.routes[i].origin);
        arr.push(this.routes[i].destination);
      }
      // Remover duplicatas
      var unique = arr
        .map(function (s) {
          return s.trim();
        })
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      // Ordenar alfabeticamente considerando português
      unique.sort(function (a, b) {
        return a.localeCompare(b, 'pt-BR');
      });
      return unique;
    },

    // Encontra distância entre duas cidades (busca em ambas as direções)
    findDistance: function (origin, destination) {
      if (!origin || !destination) return null;
      var o = origin.trim().toLowerCase();
      var d = destination.trim().toLowerCase();
      for (var i = 0; i < this.routes.length; i++) {
        var r = this.routes[i];
        var ro = r.origin.trim().toLowerCase();
        var rd = r.destination.trim().toLowerCase();
        if ((ro === o && rd === d) || (ro === d && rd === o)) {
          return r.distanceKm;
        }
      }
      return null;
    }
  };

  return db;
})();
