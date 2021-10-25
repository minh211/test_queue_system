import * as React from "react";
import axios from "axios";

import { apiUrl } from "./urls";

export function useAxios(accessToken: string | undefined) {
  const axiosInstance = React.useMemo(() => {
    return axios.create({
      baseURL: apiUrl,
      headers: accessToken ? { authorization: `Bearer ${accessToken}` } : undefined,
    });
  }, [accessToken]);

  const axiosGet = React.useCallback(
    async <Response = unknown>(url: string) => axiosInstance.get<Response>(url),
    [axiosInstance]
  );

  const axiosPost = React.useCallback(
    async <Payload = unknown, Response = unknown>(url: string, payload?: Payload) =>
      axiosInstance.post<Response>(url, payload),
    [axiosInstance]
  );

  const axiosDelete = React.useCallback(async (url: string) => axiosInstance.delete(url), [axiosInstance]);

  const axiosPatch = React.useCallback(
    async <Payload = unknown, Response = unknown>(url: string, payload: Payload) =>
      axiosInstance.patch<Response>(url, payload),
    [axiosInstance]
  );

  return {
    axiosGet,
    axiosDelete,
    axiosPatch,
    axiosPost,
  };
}
