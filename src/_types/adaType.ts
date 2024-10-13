export type MenuType = {
  id: number;
  name: string;
  category: string;
};

export type TableType = {
  id: number;
  name: string;
  min: number;
  max: number;
  is_bookable: boolean;
  ordered: boolean;
};
