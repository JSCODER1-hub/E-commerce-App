import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcment from "../components/Announcment";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Footer from "../components/Footer";
import { Add, Remove } from "@mui/icons-material";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ paddding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;

  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;
const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;
const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;
const Image = styled.img`
  width: 200px;
`;
const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 30px;
`;
const ProductName = styled.span``;
const ProductId = styled.span``;
const ProductColor = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;
const ProductSize = styled.span``;
const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const ProductAmout = styled.div`
  font-size: 25px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;
const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;
const Hr = styled.hr`
  background-color: #eee;
  border: none;
  margin: 25px 0;
  height: 1px;
`;
const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgrey;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;
const SummaryTitle = styled.h1`
  font-weight: 200;
  padding: 2;
`;

const SummaryItem = styled.div`
    margin:30px 0px; 
    display:flex;
    justify-content:space-between;
    font-weight:${(props) => props.type == "total" && "500"}
    font-size:${(props) => props.type == "total" && "24px"}
`;
const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;
const Cart = () => {
  let cartContext = useContext(CartContext);
  let [products, setProducts] = useState([]);
  let [items, setItems] = useState([]);
  let [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      let productsResponse = await fetch(`http://localhost:5000/products`);
      let productsResponseBody = await productsResponse.json();

      let myProducts = productsResponseBody.filter((prod) =>
        cartContext.cart.products.find(
          (element) => element.productId == prod.id && element.quantity > 0
        )
      );
      //   Calculating The Total Price
      let priceOfAllItems = 0;

      if (myProducts.length > 0) {
        myProducts.forEach((prod) => {
          let current = cartContext.cart.products.find(
            (product) => product.productId == prod.id
          );
          priceOfAllItems += current.quantity * prod.price;
        });
      }

      setTotal(priceOfAllItems);
      setProducts(productsResponseBody);
      setItems(myProducts);
    })();
  }, [cartContext.cart]);

  let onPlusOrMinus = async (e, id, operation) => {
    let updatedCart = { ...cartContext.cart };

    //  Increasing the Amount or Decreasing it

    if (operation == "+") {
      updatedCart.products = updatedCart.products.map((prod) => {
        if (id == prod.productId) prod.quantity++;
        return prod;
      });
    } else {
      updatedCart.products = updatedCart.products.map((prod, i) => {
        if (id == prod.productId) prod.quantity--;

        return prod;
      });
    }

    // Filtering the 0 quantity items

    let newUpdatedProducts = updatedCart.products.filter(
      (prod) => prod.quantity > 0
    );
    let newItems = products.filter((item) =>
      newUpdatedProducts.find((prod) => prod.productId == item.id)
    );
    let cartUpdateResponse = await fetch(
      `http://localhost:5000/carts/${cartContext.cart.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...cartContext.cart,
          products: newUpdatedProducts,
        }),
        headers: { "Content-type": "application/json" },
      }
    );
    sessionStorage.setItem("products", JSON.stringify(newUpdatedProducts));
    cartContext.setCart({ ...updatedCart, products: newUpdatedProducts });
    setItems(newItems);
  };
  return (
    <Container>
      <Announcment />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to="/store">
            <TopButton className="styled-button">CONTINUE SHOPPING</TopButton>
          </Link>

          <TopTexts>
            <TopText>Shopping Bag({items.length})</TopText>
          </TopTexts>
          <TopButton type="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            <TransitionGroup component={null}>
              {items.map((item) => (
                <CSSTransition classNames="item" timeout={500} key={item.id}>
                  <>
                    {console.log(cartContext.cart.products)}
                    <Product>
                      <ProductDetail>
                        <Image src={item.image} />
                        <Details>
                          <ProductName>
                            <b>Product:</b>
                            {item.title}
                          </ProductName>
                          <ProductId>
                            <b>ID:</b> {item.id}
                          </ProductId>
                        </Details>
                      </ProductDetail>
                      <PriceDetail>
                        <ProductAmountContainer>
                          <Add
                            onClick={(e) => {
                              onPlusOrMinus(e, item.id, "+");
                            }}
                          />
                          <ProductAmout>
                            {
                              cartContext.cart.products.find(
                                (prod) => prod.productId == item.id
                              ).quantity
                            }
                          </ProductAmout>
                          <Remove
                            onClick={(e) => {
                              onPlusOrMinus(e, item.id, "-");
                            }}
                          />
                        </ProductAmountContainer>
                        <ProductPrice>
                          $
                          {item.price *
                            cartContext.cart.products.find(
                              (prod) => prod.productId == item.id
                            ).quantity}
                        </ProductPrice>
                      </PriceDetail>
                    </Product>
                    <Hr />
                  </>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {total}</SummaryItemPrice>
            </SummaryItem>
            <Button>CHECKOUT NOW</Button>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
