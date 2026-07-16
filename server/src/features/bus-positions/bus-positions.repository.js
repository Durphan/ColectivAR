import axios from "axios";

export class ColectivoRepository {
  constructor(config) {
    this.config = config;
  }

  async fetchAll() {
    const response = await axios.get(this.config.fullUrl);
    return response.data;
  }
}
