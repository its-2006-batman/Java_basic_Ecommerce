import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import unplugged from "../assets/unplugged.png";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get(`${baseUrl}/api/products`);
        console.log("cart", cart);
        setCartItems(cart);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;

    if (base64String.startsWith("data:")) {
      return base64String;
    }

    if (base64String.startsWith("http")) {
      return base64String;
    }

    return `data:${mimeType};base64,${base64String}`;
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;

        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData);

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios
          .put(`${baseUrl}/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="cart-shell container-fluid py-5">
      <div className="cart-orb cart-orb-left"></div>
      <div className="cart-orb cart-orb-right"></div>

      <div className="container cart-layout">
        <div className="cart-head d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <p className="cart-kicker mb-1">Your Basket</p>
            <h2 className="cart-title mb-2">Shopping Cart</h2>
            <p className="cart-subtitle mb-0">Review items, update quantities, and checkout when ready.</p>
          </div>
          <div className="cart-pill">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="cart-panel">
          {cartItems.length === 0 ? (
            <div className="cart-empty text-center py-5">
              <i className="bi bi-cart-x fs-1"></i>
              <h4 className="mt-3">Your cart is empty</h4>
              <p className="mb-4">Looks like you haven&apos;t added anything yet.</p>
              <Link to="/" className="btn cart-action-btn">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="table-responsive d-none d-md-block">
                <table className="table cart-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={convertBase64ToDataURL(item.imageData)}
                              alt={item.name}
                              className="cart-item-image"
                            />
                            <div>
                              <h6 className="mb-0 fw-semibold">{item.name}</h6>
                              <small className="text-muted">{item.brand}</small>
                            </div>
                          </div>
                        </td>
                        <td className="fw-medium">₹ {item.price}</td>
                        <td>
                          <div className="input-group input-group-sm cart-qty-group">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleDecreaseQuantity(item.id)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input
                              type="text"
                              className="form-control text-center"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleIncreaseQuantity(item.id)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold">₹ {(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-md-none d-grid gap-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-mobile-item">
                    <div className="d-flex gap-3">
                      <img
                        src={convertBase64ToDataURL(item.imageData)}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{item.name}</h6>
                        <p className="text-muted small mb-2">{item.brand}</p>
                        <div className="d-flex justify-content-between small">
                          <span>Price</span>
                          <span>₹ {item.price}</span>
                        </div>
                        <div className="d-flex justify-content-between small fw-semibold mt-1">
                          <span>Total</span>
                          <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="input-group input-group-sm cart-qty-group">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
                <div>
                  <p className="mb-1 text-muted">Order total</p>
                  <h4 className="mb-0">₹ {totalPrice.toFixed(2)}</h4>
                </div>
                <Button
                  className="cart-action-btn"
                  size="lg"
                  onClick={() => setShowModal(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;