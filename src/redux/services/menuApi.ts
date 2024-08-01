import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Filial, MenuInfo } from "../../types";
import { addSearchParams } from "../../helpers";

interface getAllMenuRequestInfo {
  filialId: number;
  //для фиольтрации на стороне сервера
  params?: {
    name: string;
    filial: string;
    tt: string;
    active: string;
  };
}

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://testjob.checkport.ru/" }),
  endpoints: (builder) => ({
    getFilials: builder.query<Filial[], void>({
      query: () => "filial",
    }),
    getAllMenu: builder.query<MenuInfo, getAllMenuRequestInfo>({
      query: ({ filialId, params }) => {
        const url = new URL(
          `filial/${filialId}/menu/`,
          "https://testjob.checkport.ru/"
        );

        const existParams = params
          ? Object.entries(params).filter(([_, val]) => !!val)
          : [];
        const urlWithParams = addSearchParams(url, existParams);

        if (filialId) {
          return `${urlWithParams.pathname}${
            existParams.length > 0 ? urlWithParams.search : ""
          }`;
        } else return "";
      },
    }),
  }),
});
