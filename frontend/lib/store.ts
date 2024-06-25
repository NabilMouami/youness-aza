import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserType {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  avatar: string;
  id: string;
}

interface StoreType {
  // user
  currentUser: UserType | null;
  isLoading: boolean;
  isLoadProducts: boolean;
  products: any[] | [];

  getUserInfo: (dataUser: any) => Promise<void>;
  loadProducts: (loadProd: any) => Promise<void>;
  // cart
  cartProduct: any;
  addToCart: (product: any, size: string) => Promise<void>;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
  // favorite
  favoriteProduct: any;
  addToFavorite: (product: any) => Promise<void>;
  removeFromFavorite: (productId: number) => void;
  resetFavorite: () => void;
}

// Custom storage object
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const store = create<StoreType>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoading: true,
      isLoadProducts: true,
      products: [],
      cartProduct: [],
      favoriteProduct: [],
      getUserInfo: async (dataUser: any) => {
        if (!dataUser) return set({ currentUser: null, isLoading: false });

        set({
          currentUser: dataUser as UserType,
          isLoading: false,
        });
      },
      loadProducts: async (loadProd: any) => {
        if (!loadProd) return set({ products: [], isLoadProducts: false });

        set({
          products: loadProd as any,
          isLoadProducts: false,
        });
      },
      addToCart: (product: any, size: string) => {
        return new Promise<void>((resolve) => {
          set((state: StoreType) => {
            const existingProduct = state.cartProduct.find(
              (p: any) => p.id === product.id
            );

            if (existingProduct) {
              return {
                cartProduct: state.cartProduct.map((p: any) =>
                  p.id === product.id
                    ? { ...p, quantity: (p.quantity || 0) + 1 }
                    : p
                ),
              };
            } else {
              return {
                cartProduct: [
                  ...state.cartProduct,
                  { ...product, size: size, quantity: 1 },
                ],
              };
            }
          });
          resolve();
        });
      },
      decreaseQuantity: (productId: number) => {
        set((state: StoreType) => {
          const existingProduct = state.cartProduct.find(
            (p: any) => p._id === productId
          );

          if (existingProduct) {
            return {
              cartProduct: state.cartProduct.map((p: any) =>
                p.id === productId
                  ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
                  : p
              ),
            };
          } else {
            return state;
          }
        });
      },
      removeFromCart: (productId: number) => {
        set((state: StoreType) => ({
          cartProduct: state.cartProduct.filter(
            (item: any) => item.id !== productId
          ),
        }));
      },
      resetCart: () => {
        set({ cartProduct: [] });
      },
      addToFavorite: (product: any) => {
        return new Promise<void>((resolve) => {
          set((state: StoreType) => {
            const isFavorite = state.favoriteProduct.some(
              (item: any) => item.id === product.id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item: any) => item.id !== product.id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: number) => {
        set((state: StoreType) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item: any) => item.id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "store-storage-yazasnikers",
      storage: customStorage,
    }
  )
);
