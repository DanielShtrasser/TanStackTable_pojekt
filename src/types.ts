export type MenuInfo = {
  max_pages: number;
  data: Menu[];
};

export type Menu = {
  id: number;
  name: string;
  filial: Filial;
  tt: Tt;
  active: boolean;
  export: string[];
};

export type Filial = {
  id: number;
  name: string;
};

type Tt = {
  id: number;
  name: string;
};

export type SideMenuBtn = Record<string, string>;
