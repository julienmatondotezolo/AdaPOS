export type MenuType = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  asides?: string[];
  selectedAside?: string;
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
