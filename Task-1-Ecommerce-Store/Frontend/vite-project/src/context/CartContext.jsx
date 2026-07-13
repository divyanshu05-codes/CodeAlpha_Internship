import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const CartContext = createContext(null);

const getInitialCart = () => {
    try {
        const savedCart = localStorage.getItem("shopnest-cart");

        return savedCart ? JSON.parse(savedCart) : [];
    } catch {
        return [];
    }
};

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(getInitialCart);

    useEffect(() => {
        localStorage.setItem(
            "shopnest-cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((currentItems) => {
            const existingProduct = currentItems.find(
                (item) => item._id === product._id
            );

            if (existingProduct) {
                return currentItems.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  product.stock
                              ),
                          }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    };

    const increaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item._id === productId &&
                item.quantity < item.stock
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                      }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item._id === productId
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item._id !== productId
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
}