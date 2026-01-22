export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'business';
    avatar?: string;
    token?: string;
    createdAt: string;
    updatedAt: string;
    phone?: string;
    jobTitle?: string;
    experience?: number;
    location?: {
        lat: number;
        lng: number;
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip?: string;
    };
}

export interface Category {
    _id: string;
    name: string;
    nameAr?: string;
    slug: string;
    image?: string;
    imageUrl?: string;
    description?: string;
    descriptionAr?: string;
    isPublished?: boolean;
    brand?: string | Brand;
}

export interface Brand {
    _id: string;
    name: string;
    nameAr?: string;
    slug: string;
    image?: string;
    logoUrl?: string;
    description?: string;
    descriptionAr?: string;
    isPublished?: boolean;
    category?: string | Category;
}

export interface Product {
    _id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: number;
    category: Category | string;
    brand: Brand | string;
    images: string[];
    imageUrl?: string;
    stock: number;
    rating: number;
    numReviews: number;
    createdAt: string;
    updatedAt: string;
    salePrice?: number;
    isDiscountActive?: boolean;
    sku?: string;
    tags?: string[];
    isPublished?: boolean;
    slug?: string;
    attributes?: Record<string, string>;
}

export interface DiscountSchedule {
    _id: string;
    product: Product;
    type: 'percentage' | 'fixed';
    value: number;
    startTime: string;
    endTime: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    [key: string]: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponseBase {
    page: number;
    pages: number;
    total: number;
}

export interface UserPaginatedResponse extends PaginatedResponseBase {
    users: User[];
}

export interface OrderPaginatedResponse extends PaginatedResponseBase {
    orders: Order[];
}

export interface Portfolio {
    _id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    client?: string;
    clientAr?: string;
    completedAt?: string;
    images: string[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    category?: string;
}

export interface PortfolioOwnerResponse {
    owner: User & { 
        jobTitle?: string; 
        jobTitleAr?: string;
        bio?: string; 
        bioAr?: string; 
        skills?: Array<{
            name: string;
            nameAr: string;
            level: string;
            icon: string;
        }>;
        experience?: number;
        isHiring?: boolean;
        location?: { lat: number; lng: number };
        address?: { city: string; state: string };
        phone?: string;
    };
    portfolios: Portfolio[];
}

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string | Product;
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    _id: string;
    user: User;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    shipping?: {
        address: string;
        cost: number;
    };
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    total?: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface Config {
    language: string;
    currency: string;
    vodafoneCashNumber: string;
    instapayNumber: string;
    creditCardNumber: string;
    taxiAmount: number;
    minProductImages: number;
    maxProductImages: number;
    [key: string]: unknown;
}
