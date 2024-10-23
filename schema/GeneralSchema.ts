export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  locals: Local[];
  localFavorites: LocalFavorites[];
  productFavorites: ProductFavorites[];
  reservations?: Reservations;
}

export interface LocalFavorites {
  id: string;
  user: User;
  userId: string;
  local: Local;
  localId: string;
  dateFrom: Date;
  dateTo: Date;
}

export interface ProductFavorites {
  id: string;
  user: User;
  userId: string;
  product: Product;
  productId: string;
  dateFrom: Date;
  dateTo: Date;
}

export interface Reservations {
  id: string;
  user: User;
  userId: string;
  service: LocalService;
  serviceId: string;
  dateTime: Date;
  comment: string;
}

export interface Local {
  id?: string;
  name: string;
  location: string; // Consider changing to number if needed
  whatsapp?: number;
  instagram?: string;
  facebook?: string;
  webpage?: string;
  image?: string;
  dateFrom: Date;
  dateTo?: Date;
  users?: User[];
  hours?: LocalHours;
  localFavorites?: LocalFavorites[];
  services?: LocalService[];
  localTypes?: LocalTypes;
  localTypeID?: string;
  product?: LocalProduct[];
  localDiscountDeal?: LocalDiscountDeal[];
  viewLocal?: ViewLocal[];
}

export interface LocalDisplay {
  id: string;
  name: string;
  location: string;
  whatsapp: number | null;
  instagram: string | null;
  facebook: string | null;
  webpage: string | null;
  image: string | null;
  dateFrom: Date;
  dateTo: Date | null;
  localType: string;
}

export interface LocalProduct {
  id: string;
  local: Local;
  localId: string;
  product: Product;
  productId: string;
  dateFrom: Date;
  dateTo: Date;
}

export interface LocalHours {
  id?: string;
  local?: Local;
  localId?: string;
  dateFrom: Date;
  dateTo?: Date;
  dayNumber: number;
  AMHourFrom: string;
  AMHourTo: string;
  PMHourFrom: string;
  PMHourTo: string;
  EXHourFrom: string;
  EXHourTo: string;
}

export interface LocalTypes {
  id: string;
  name: string;
  locals: Local[];
}

export interface LocalDiscountDeal {
  id: string;
  local: Local;
  localId: string;
  dealDiscount: string;
  dateFrom: Date;
  dateTo: Date;
  active: boolean;
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
  mesurement: string;
  imgURL?: string;
  price?: number;
  description: string;
  dateFrom?: Date;
  dateTo?: Date;
  productFavorites?: ProductFavorites[];
  local?: LocalProduct[];
  type?: ProductType;
  productDiscountDeal?: ProductDiscountDeal[];
  productTypeId?: string;
}

export interface ProductType {
  id: string;
  name: string;
  product: Product[];
  dateTo?: Date;
}

export interface ProductDiscountDeal {
  id: string;
  product: Product;
  productId: string;
  dealDiscount: string;
  dateFrom: Date;
  dateTo: Date;
  active: boolean;
}

export interface LocalService {
  id: string;
  name: string;
  local: Local;
  localId: string;
  service: Service;
  serviceId: string;
  dateFrom: Date;
  dateTo: Date;
  AMHourFrom: string;
  AMHourTo: string;
  PMHourFrom: string;
  PMHourTo: string;
  EXHourFrom: string;
  EXHourTo: string;
  reservations: Reservations[];
}

export interface Service {
  id: string;
  localService: LocalService[];
  reservationURL: string;
  description: string;
}
