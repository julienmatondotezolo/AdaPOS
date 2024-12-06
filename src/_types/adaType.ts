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
  selectedAside?: string;
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
}

export interface NotesState {
  note: Note | null; // Only one note allowed
}

export type TicketTitle = "BAR" | "KEUKEN" | "PIZZERIA";
