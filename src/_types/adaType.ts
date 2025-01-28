export type Waiter = {
  id: string;
  name: string;
  password: string;
};

export type MenuType = {
  id: number;
  names: any;
  price: number;
  category: string;
  quantity: number;
  asides?: string[];
  sideDishIds?: string[];
  selectedAside?: any;
  selectedSauce?: any;
  selectedSupplement?: any;
  selectedCooking?: any;
};

export type TableType = {
  id: number;
  name: string;
  couvert: number;
  x?: number;
  y?: number;
  min?: number;
  max?: number;
  is_bookable?: boolean;
  ordered?: boolean;
};

export type zenchefTableType = {
  id: number;
  width: number;
  height: number;
  shape: string;
};

export type zenchefTable = {
  id: number;
  name: string;
  couvert: number;
  x?: number;
  y?: number;
  min?: number;
  max?: number;
  is_bookable?: boolean;
  ordered?: boolean;
  table_type?: zenchefTableType;
};

// Define the Note type
export interface Note {
  id: string;
  content: string;
  category?: string;
}

export interface NotesState {
  notes: Note[];
}

export type TicketTitle = "BAR" | "KEUKEN" | "PIZZERIA";
