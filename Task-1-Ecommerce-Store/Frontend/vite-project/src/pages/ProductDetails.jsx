import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../api/axios";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/products/${id}`
                );

                setProduct(response.data.product);
            } catch (error) {
                console.error(error);

                setError("Unable to load product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1500);
    };

    if (loading) {
        return (
            <p className="status-message">
                Loading product...
            </p>
        );
    }

    if (error || !product) {
        return (
            <div className="page-container placeholder-page">
                <p className="form-error">
                    {error || "Product not found."}
                </p>

                <Link to="/">
                    Return to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container product-details-page">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <div className="product-details">
                <div className="product-details-image-container">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />
                </div>

                <div className="product-details-content">
                    <span className="category">
                        {product.category}
                    </span>

                    <h1>{product.name}</h1>

                    <p className="product-details-description">
                        {product.description}
                    </p>

                    <p className="product-stock">
                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Out of stock"}
                    </p>

                    <strong className="product-details-price">
                        ₹
                        {product.price.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                    <div className="product-details-actions">
                        <button
                            type="button"
                            className="add-cart-button"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            {added
                                ? "Added to Cart ✓"
                                : "Add to Cart"}
                        </button>

                        <Link
                            to="/cart"
                            className="view-cart-button"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;