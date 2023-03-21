import { Axios } from 'axios';
import { useStore } from '../store';

export function createAxios(): Axios {
  const idToken = useStore.getState().idToken;

  if (idToken === undefined) {
    return new Axios();
  }

  return new Axios({
    headers: {
      authorization: `Bearer ${idToken}`,
    },
    validateStatus: status => status >= 200 && status < 300,
  });
}
