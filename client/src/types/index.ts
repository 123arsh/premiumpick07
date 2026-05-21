export interface Product {
  _id: string;
  name: string;
  hoverTitle: string;
  imageUrl: string;
  affiliateLink: string;
  category?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

export interface AdminUser {
  id: string;
  username: string;
}

export interface ApiError {
  success: false;
  message: string;
}
