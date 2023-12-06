import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ipcRenderer} from 'electron';

export const requèteHttp = async (
  url: string,
  config: AxiosRequestConfig,
): Promise<AxiosResponse['data']> => {
  return ipcRenderer.invoke('requèteHttp', {url, config});
};
