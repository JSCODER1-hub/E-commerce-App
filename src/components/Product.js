import {
  FavoriteBorderOutlined,
  Money,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;
const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  flex-direction: column;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #f5fbfd;

  &:hover ${Info} {
    opacity: 1;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;
const Image = styled.img`
  height: 75%;
  width: 75%;
  z-index: 2;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: white;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Product = ({ product }) => {
  let userContext = useContext(UserContext);
  let cartContext = useContext(CartContext);

  let onBuyClick = async (e) => {
    e.stopPropagation();
    if (window.confirm("Do You Want To Add This Item")) {
      let products = cartContext.cart.products;
      let flag = false;
      products = products.map((prod) => {
        if (prod.productId == product.id) {
          prod.quantity = prod.quantity + 1;
          flag = true;
        }
        return prod;
      });
      products = flag
        ? products
        : [...products, { productId: product.id, quantity: 1 }];

      let addItemResponse = await fetch(
        `http://localhost:5000/carts/${cartContext.cart.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...cartContext.cart,
            products: products,
          }),
          headers: { "Content-type": "application/json" },
        }
      );
      let addItemResponseBody = addItemResponse.json();

      sessionStorage.setItem("products", JSON.stringify(products));
      cartContext.setCart({ ...cartContext.cart, products: products });
    }
  };

  return (
    <Container key={product.id}>
      <Circle />
      <Image src={product.image} />
      <Money />
      <span>${product.price}</span>
      <Info onClick={(e) => (window.location.hash = `/product/${product.id}`)}>
        <Icon onClick={(e) => onBuyClick(e)}>
          <ShoppingCartOutlined />
        </Icon>
      </Info>
    </Container>
  );
};

export default Product;
