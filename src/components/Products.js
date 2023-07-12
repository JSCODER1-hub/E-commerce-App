import React from "react";
import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Product from "./Product";
import { Css } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Products = ({ products }) => {
  return (
    <Container>
      <TransitionGroup component={null}>
        {products.map((product) => {
          return (
            <CSSTransition classNames="item" timeout={500} key={product.id}>
              <Product product={product} key={product.id} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </Container>
  );
};

export default Products;
