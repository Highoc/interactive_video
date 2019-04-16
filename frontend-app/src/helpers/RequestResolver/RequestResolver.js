import axios from 'axios/index';
import { backend as backendURL, centrifuge as centrifugeURL } from './urls';

export default class RequestResolver {
  static getBackend() {
    return headers => axios.create({
      baseURL: backendURL,
      timeout: 50000,
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        ...headers,
      },
    });
  }

  static getCentrifuge() {
    return headers => axios.create({
      baseURL: centrifugeURL,
      timeout: 50000,
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        ...headers,
      },
    });
  }

  static getGuest() {
    return headers => axios.create({
      baseURL: backendURL,
      timeout: 50000,
      headers,
    });
  }

  static getAWS() {
    return headers => axios.create({
      timeout: 50000,
      responseType: 'arraybuffer',
      headers,
    });
  }
}
