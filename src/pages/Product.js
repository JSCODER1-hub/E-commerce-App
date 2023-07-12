import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Announcment from "../components/Announcment";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Add, Remove } from "@mui/icons-material";
import { mobile } from "../responsive";
import { useParams } from "react-router";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;
const ImageContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  padding: 100px 50px;
  flex: 1;
  ${mobile({ padding: "10px " })}
`;
const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 30px 0;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 50px 0;
  align-items: center;
  justify-content: flex-start;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const Amount = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px 5px;
`;

const Button = styled.span`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;
const Stars = styled.div`
  display: block;
  margin: 30px 0px;
`;
const Product = () => {
  let userContext = useContext(UserContext);
  let cartContext = useContext(CartContext);
  const routeParams = useParams();

  console.log(routeParams.id);
  let [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    (async () => {
      let productResponse = await fetch(
        `http://localhost:5000/products?id=${routeParams.id}`
      );
      let productResponseBody = await productResponse.json();

      setProductDetails(productResponseBody[0]);
    })();
  }, [routeParams]);

  let onAddClick = async (e) => {
    if (window.confirm("Do you Want To Add This Item")) {
      e.preventDefault();

      let newCart = { ...cartContext.cart };

      if (newCart.products.find((prod) => prod.productId == routeParams.id)) {
        newCart.products.map((prod) => {
          if (prod.productId == routeParams.id) {
            prod.quantity++;
          }
          return prod;
        });
      } else {
        newCart.products = [
          ...newCart.products,
          { productId: routeParams.id, quantity: 1 },
        ];
      }

      sessionStorage.setItem("products", JSON.stringify(newCart.products));
      cartContext.setCart(newCart);
    }
  };
  return (
    <Container>
      <Announcment />
      {productDetails.title ? (
        <Wrapper>
          <ImageContainer>
            <Image src={productDetails.image} />
          </ImageContainer>
          <InfoContainer>
            <Title>{productDetails.title}</Title>
            <Desc>{productDetails.description}</Desc>
            <Price>$ {productDetails.price}</Price>
            <Stars>
              {[...Array(Math.round(productDetails.rating.rate)).keys()].map(
                (n) => {
                  return <i className="fa fa-star text-warning" key={n}></i>;
                }
              )}
              {[
                ...Array(5 - Math.round(productDetails.rating.rate)).keys(),
              ].map((n) => {
                return <i className="fa fa-star-o text-warning" key={n}></i>;
              })}
            </Stars>
            <AddContainer>
              <Button onClick={(e) => onAddClick(e)}>ADD TO CART</Button>
            </AddContainer>
          </InfoContainer>
        </Wrapper>
      ) : (
        ""
      )}
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;
