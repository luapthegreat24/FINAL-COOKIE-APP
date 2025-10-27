import React, { useState } from "react";
import { IonContent, IonHeader, IonPage, IonIcon } from "@ionic/react";
import {
  heartOutline,
  heart,
  filterOutline,
  gridOutline,
  reorderTwoOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  categories,
  getProductsByCategory,
  getProductImage,
} from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Products.css";

const Products: React.FC = () => {
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"one-column" | "two-column">(
    "two-column"
  );
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const navigateToProduct = (productId: string) => {
    history.push(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const product = filteredProducts.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  // Filter products by category
  const filteredProducts = getProductsByCategory(selectedCategory);

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>
      <IonContent fullscreen>
        {/* Main Content */}
        <div className="products-main-content">
          {/* Page Header */}
          <div className="products-page-header">
            <h1 className="products-page-title">Our Cookie Collection</h1>
            <p className="products-page-subtitle">
              Handcrafted with love, baked fresh daily!
            </p>
          </div>

          {/* Filter and View Controls */}
          <div className="products-controls">
            <div className="filter-dropdown-container">
              <IonIcon icon={filterOutline} className="filter-icon" />
              <select
                className="category-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="view-toggle-container">
              <span className="view-label">View:</span>
              <button
                className={`view-btn ${
                  viewMode === "one-column" ? "active" : ""
                }`}
                onClick={() => setViewMode("one-column")}
                title="One Column"
              >
                <IonIcon icon={reorderTwoOutline} />
              </button>
              <button
                className={`view-btn ${
                  viewMode === "two-column" ? "active" : ""
                }`}
                onClick={() => setViewMode("two-column")}
                title="Two Columns"
              >
                <IonIcon icon={gridOutline} />
              </button>
            </div>
          </div>

          {/* Products Count */}
          <div className="products-count">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "cookie" : "cookies"}
          </div>

          {/* Products Grid */}
          <div className={`cookie-cards-grid ${viewMode}`}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cookie-card"
                onClick={() => navigateToProduct(product.id)}
              >
                <button
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <IonIcon
                    icon={isInWishlist(product.id) ? heart : heartOutline}
                  />
                </button>
                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
                <div className="card-sketch-border"></div>
                {[
                  "chocolate-chip",
                  "butter-cookie",
                  "double-chocolate",
                  "peanut-butter",
                  "red-velvet",
                ].includes(product.id) && (
                  <div className="product-badge-sketch">
                    <span>Best Seller</span>
                  </div>
                )}
                <div className="cookie-illustration">
                  <img
                    src={`/images/cookies/${getProductImage(product.id)}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="card-footer">
                    <span className="price">
                      ₱
                      {(product.boxPrices?.regular || product.price).toFixed(2)}
                    </span>
                    <button
                      className="add-btn"
                      onClick={(e) => handleAddToCart(e, product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="card-doodles">
                  <span className="doodle d1"></span>
                  <span className="doodle d2"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Products;
