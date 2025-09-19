import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Alert } from "react-native";

export type Product = {
  id: string; // uuid
  code: string; // código de barras/QR escaneado
  name: string; // nombre visible
  price: number; // precio
  stock: number; // cantidad
};

type State = {
  products: Product[];
  loading: boolean; // para loaders globales opcional
};

type Action =
  | { type: "ADD"; payload: Product }
  | { type: "UPDATE"; payload: Product }
  | { type: "DELETE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialProducts: Product[] = [
  {
    id: "p-1",
    code: "7791234567890",
    name: "Agua Mineral 500ml",
    price: 1200,
    stock: 50,
  },
  {
    id: "p-2",
    code: "QR-ABC-001",
    name: "Yerba Mate 1kg",
    price: 5200,
    stock: 20,
  },
];

const initialState: State = {
  products: initialProducts,
  loading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const ProductsContext = createContext<{
  products: Product[];
  loading: boolean;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
} | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [opInFlight, setOpInFlight] = useState(false); // loader de operación puntual

  const simulateDelay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

  const addProduct = async (p: Omit<Product, "id">) => {
    try {
      setOpInFlight(true);
      dispatch({ type: "SET_LOADING", payload: true });
      await simulateDelay();
      const id = `p-${Date.now()}`;
      dispatch({ type: "ADD", payload: { ...p, id } });
      Alert.alert("Éxito", "Producto agregado correctamente.");
    } catch (e) {
      Alert.alert("Error", "No se pudo agregar el producto.");
    } finally {
      setOpInFlight(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateProduct = async (p: Product) => {
    try {
      setOpInFlight(true);
      dispatch({ type: "SET_LOADING", payload: true });
      await simulateDelay();
      dispatch({ type: "UPDATE", payload: p });
      Alert.alert("Éxito", "Producto modificado.");
    } catch (e) {
      Alert.alert("Error", "No se pudo modificar el producto.");
    } finally {
      setOpInFlight(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setOpInFlight(true);
      dispatch({ type: "SET_LOADING", payload: true });
      await simulateDelay();
      dispatch({ type: "DELETE", payload: id });
      Alert.alert("Éxito", "Producto eliminado.");
    } catch (e) {
      Alert.alert("Error", "No se pudo eliminar el producto.");
    } finally {
      setOpInFlight(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value = useMemo(
    () => ({
      products: state.products,
      loading: state.loading || opInFlight,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [state.products, state.loading, opInFlight]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx)
    throw new Error("useProducts debe usarse dentro de ProductsProvider");
  return ctx;
};
