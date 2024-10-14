export type MenuType = {
  id: number;
  name: string;
  category: string;
};

export type TableType = {
  id: number;
  name: string;
  x?: number;
  y?: number;
  min?: number;
  max?: number;
  is_bookable?: boolean;
  ordered?: boolean;
};
