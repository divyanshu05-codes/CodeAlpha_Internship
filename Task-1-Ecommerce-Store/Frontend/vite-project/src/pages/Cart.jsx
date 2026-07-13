import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="page-container empty-cart">
                <h1>Your cart is empty</h1>

                <p>
                    Add some products before proceeding to checkout.
                </p>

                <Link
                    to="/"
                    className="continue-shopping-button"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container cart-page">
            <div className="section-heading">
                <div>
                    <p className="section-label">
                        YOUR SHOPPING BAG
                    </p>

                    <h1>Shopping Cart</h1>
                </div>

                <span>
                    {cartItems.length} different products
                </span>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <article
                            className="cart-item"
                            key={item._id}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="cart-item-info">
                                <span className="category">
                                    {item.category}
                                </span>

                                <Link
                                    to={`/products/${item._id}`}
                                >
                                    <h2>{item.name}</h2>
                                </Link>

                                <strong>
                                    ₹
                                    {item.price.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                                <div className="quantity-controls">
                                    <button
                                        onClick={() =>
                                            decreaseQuantity(
                                                item._id
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(
                                                item._id
                                            )
                                        }
                                        disabled={
                                            item.quantity >=
                                            item.stock
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-right">
                                <strong>
                                    ₹
                                    {(
                                        item.price *
                                        item.quantity
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        removeFromCart(
                                            item._id
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="order-summary">
                    <p className="section-label">
                        ORDER SUMMARY
                    </p>

                    <div className="summary-row">
                        <span>Subtotal</span>

                        <strong>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>

                        <strong>Free</strong>
                    </div>

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="checkout-button"
                    >
                        Proceed to Checkout
                    </button>

                    <Link
                        to="/"
                        className="continue-link"
                    >
                        Continue Shopping
                    </Link>
                </aside>
            </div>
        </div>
    );
}

export default Cart;