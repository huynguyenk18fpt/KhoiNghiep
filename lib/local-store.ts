import { products, type Product } from "@/lib/data/products";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: "password" | "google";
};

export type GoogleLoginProfile = {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutInfo = {
  fullName: string;
  phone: string;
  address: string;
  saveAddress: boolean;
  paymentMethod: "cod" | "qr" | "card";
  shippingMethod: "standard" | "express";
  couponCode?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  customer: CheckoutInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: "processing";
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Không thể kết nối máy chủ.");
  }

  return data;
}

export const demoAuthStore = {
  async getSession(): Promise<DemoUser | null> {
    const data = await requestJson<{ user: DemoUser | null }>("/api/auth/session");
    return data.user;
  },
  async signup(name: string, email: string, password: string): Promise<DemoUser> {
    const data = await requestJson<{ user: DemoUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    return data.user;
  },
  async login(email: string, password: string): Promise<DemoUser> {
    const data = await requestJson<{ user: DemoUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data.user;
  },
  async loginWithGoogle(profile: GoogleLoginProfile): Promise<DemoUser> {
    const data = await requestJson<{ user: DemoUser }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(profile),
    });
    return data.user;
  },
  async updateProfile(nextUser: DemoUser): Promise<DemoUser> {
    const data = await requestJson<{ user: DemoUser }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: nextUser.name,
        avatar: nextUser.avatar,
      }),
    });
    return data.user;
  },
  async logout() {
    await requestJson<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },
};

export const cartStore = {
  async getItems(): Promise<CartItem[]> {
    const data = await requestJson<{ items: CartItem[] }>("/api/cart");
    return data.items;
  },
  async setItems(items: CartItem[]): Promise<CartItem[]> {
    const data = await requestJson<{ items: CartItem[] }>("/api/cart", {
      method: "PUT",
      body: JSON.stringify({ items: items.filter((item) => item.quantity > 0) }),
    });
    return data.items;
  },
  async add(productId: string, quantity = 1): Promise<CartItem[]> {
    const data = await requestJson<{ items: CartItem[] }>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    return data.items;
  },
  async clear(): Promise<CartItem[]> {
    return this.setItems([]);
  },
};

export function hydrateCart(items: CartItem[]) {
  return items
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItem & { product: Product } => Boolean(item));
}

export const orderStore = {
  async getCheckoutDraft(): Promise<Partial<CheckoutInfo>> {
    const data = await requestJson<{ draft: Partial<CheckoutInfo> }>("/api/checkout-draft");
    return data.draft;
  },
  async setCheckoutDraft(draft: Partial<CheckoutInfo>) {
    await requestJson<{ draft: Partial<CheckoutInfo> }>("/api/checkout-draft", {
      method: "PUT",
      body: JSON.stringify({ draft }),
    });
  },
  async getLastOrder(): Promise<DemoOrder | null> {
    const data = await requestJson<{ order: DemoOrder | null }>("/api/orders/last");
    return data.order;
  },
  async createOrder(info: CheckoutInfo, shippingFee: number, discount: number): Promise<DemoOrder> {
    const data = await requestJson<{ order: DemoOrder }>("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: info,
        shippingFee,
        discount,
      }),
    });
    return data.order;
  },
};
