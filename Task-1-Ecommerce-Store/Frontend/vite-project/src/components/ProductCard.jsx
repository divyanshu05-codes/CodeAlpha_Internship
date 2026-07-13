import { Link } from "react-router-dom";

function ProductCard({ product }) {
    return (
        <article className="product-card">
            <img
                src={product.image}
                alt={product.name}
                className="product-image"
            />

            <div className="product-card-content">
                <span className="category">
                    {product.category}
                </span>

                <h2>{product.name}</h2>

                <p className="description">
                    {product.description}
                </p>

                <div className="product-card-bottom">
                    <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                    </strong>

                    <Link
                        to={`/products/${product._id}`}
                        className="view-button"
                    >
                        View Product
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;