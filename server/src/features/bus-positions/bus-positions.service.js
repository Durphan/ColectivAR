export class BusPositionsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.fetchAll();
  }

  async getNumeros() {
    const data = await this.repository.fetchAll();
    return data.map((item) => item.route_short_name);
  }

  async getRutas() {
    const data = await this.repository.fetchAll();
    return data.map((item) => item.trip_headsign);
  }

  async getRutasByNumero(numero) {
    const data = await this.repository.fetchAll();
    return data
      .filter((item) => item.route_short_name === numero)
      .map((item) => item.trip_headsign);
  }

  async getByNumeroAndRuta(numero, ruta) {
    const data = await this.repository.fetchAll();
    return data.filter(
      (item) =>
        item.route_short_name === numero && item.trip_headsign === ruta,
    );
  }
}
