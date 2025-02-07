export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  dateFrom: string;
  dateTo: string | null;
  locals: Local[];
}

export interface Local {
  id?: string;
  name: string | null;
  location?: string | null; // Consider changing to a more specific type, e.g., { lat: number; lng: number }
  address?: string;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  webpage?: string | null;
  imgURL?: string | null;
  dateFrom?: Date;
  dateTo?: Date | null;
  users?: User[];
  schedule?: LocalSchedule[];
  services?: Service[];
  localTypes?: LocalTypes | null;
  localTypeID?: string | null;
  product?: LocalProduct[];
  viewLocal?: ViewLocal[];
}

export interface LocalProduct {
  id?: string | null;
  local?: Local | null;
  localId?: string;
  product?: Product | null;
  productId?: string;
  price?: number | null;
  imgURL?: string | null;
  localProductDescription?: string | null;
  localProductCategory?: LocalProductCategory | null;
  localProductCategoryId?: string | null;
  localProductSubCategory?: LocalProductSubCategory | null;
  localProductSubCategoryId?: string | null;
  dateFrom: Date | null;
  dateTo?: Date | null;
}

export interface LocalProductCategory {
  id?: string | null; // Unique identifier, generated using cuid
  name: string; // Unique name for the category
  localProduct?: LocalProduct[] | null; // Array of related local products
}

export interface LocalProductSubCategory {
  id?: string | null; // Unique identifier, generated using cuid
  name: string; // Unique name for the subcategory
  product?: LocalProduct[] | null; // Array of related local products
}

export interface LocalSchedule {
  id?: string;
  local?: Local;
  localId?: string;
  dateFrom: Date;
  dateTo?: Date | null;
  dayNumber?: number;
  FirstShiftStart: string;
  FirstShiftFinish: string;
  SecondShiftStart: string | null;
  SecondShiftFinish: string | null;
  ThirdShiftStart: string | null;
  ThirdShiftFinish: string | null;
}

export interface LocalTypes {
  id: string;
  name: string;
  locals: Local[];
}

export interface ViewLocal {
  id: string;
  local: Local;
  localId: string;
}

export interface Product {
  id?: string;
  name: string;
  updatedAt?: Date;
  brand: string;
  measurement: string;
  imgURL?: string | null;
  price?: number | null;
  description: string;
  dateFrom: Date;
  dateTo?: Date | null;
  local?: LocalProduct[];
  type?: ProductType;
  productTypeId: string;
}

export interface ProductType {
  id?: string | null;
  name: string;
  product?: Product[] | null;
}

export interface Service {
  id?: string | null;
  local?: Local | null;
  localId: string;
  name: string;
  serviceType?: ServiceType | null;
  serviceTypeId: string;
  description: string;
  imgURL?: string | null;
  reservationURL: string | null;
  dateFrom: Date;
  dateTo?: Date | null;
  schedule?: LocalServiceSchedule[] | null;
}

export interface LocalServiceSchedule {
  id?: string;
  localServiceId?: string;
  dateFrom: Date;
  dateTo?: Date | null;
  dayNumber?: number;
  FirstShiftStart: string;
  FirstShiftFinish: string;
  SecondShiftStart: string | null;
  SecondShiftFinish: string | null;
  ThirdShiftStart: string | null;
  ThirdShiftFinish: string | null;
  localService?: Service;
}

export interface ServiceType {
  id?: string;
  localService?: Service[];
  name: string;
}

export interface LocalDisplay {
  id: string;
  name: string;
  location: string;
  whatsapp: number | null;
  instagram: string | null;
  facebook: string | null;
  webpage: string | null;
  imgURL?: string | null;
  dateFrom: Date;
  dateTo: Date | null;
  localType: string;
}
