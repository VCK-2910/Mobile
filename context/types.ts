// types.ts
export interface FoodDoc {
    $id: string;
    namefood: string;
    price: number;
    imageUrl: string;       // fileId trong bucket Storage
    category: string;
  }
  
  export interface CartItem {
    foodDocId : string;
    name      : string;
    price     : number;
    quantity  : number;
    imageUrl  : string;
        // tiện tra cứu sau này
  }
  
  export interface Booking {
    id?: string;
    userId: string;
    date: string;
    time: string;
    guests: number;
    notes: string;
    createdAt: Date;
    status?: 'pending' | 'confirmed' | 'cancelled';
  }