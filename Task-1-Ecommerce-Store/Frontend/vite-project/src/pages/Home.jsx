import { useEffect, useState } from "react";

import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products");

                setProducts(response.data.products);
            } catch (error) {
                console.error("Fetch Products Error:", error);

                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <section className="hero">
                <p className="hero-label">
                    SIMPLE. MODERN. SECURE.
                </p>

                <h1>
                    Find products you'll love.
                </h1>

                <p>
                    Explore our latest products and shop with ease.
                </p>
            </section>

            <section>
                <div className="section-heading">
                    <div>
                        <p className="section-label">
                            OUR COLLECTION
                        </p>

                        <h2>Featured Products</h2>
                    </div>

                    {!loading && !error && (
                        <span>
                            {products.length} products
                        </span>
                    )}
                </div>

                {loading && (
                    <p className="status-message">
                        Loading products...
                    </p>
                )}

                {error && (
                    <p className="status-message error">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <p className="status-message">
                            No products available.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
            </section>
        </div>
    );
}

export default Home;