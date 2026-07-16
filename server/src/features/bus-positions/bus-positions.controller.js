export class BusPositionsController {
  constructor(service) {
    this.service = service;
  }

  async getAll() {
    return this.service.getAll();
  }

  async getNumeros() {
    return this.service.getNumeros();
  }

  async getRutas() {
    return this.service.getRutas();
  }

  async getRutasByNumero(numero) {
    return this.service.getRutasByNumero(numero);
  }

  async getByNumeroAndRuta(numero, ruta) {
    return this.service.getByNumeroAndRuta(numero, ruta);
  }
}
