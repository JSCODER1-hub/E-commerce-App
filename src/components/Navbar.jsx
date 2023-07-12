import { Search, ShoppingCartCheckoutOutlined } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Badge } from "@mui/material";
import { Mail } from "@mui/icons-material";
import { mobile } from "../responsive";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
const Container = styled.div`
  height: 70px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const Language = styled.span`
  font-size: 40px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;
const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;
const MenuItem = styled.div`
  font-size: 15px;
  cursor: pointer;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  let userContext = useContext(UserContext);
  let cartContext = useContext(CartContext);

  let onLogoutClick = () => {
    sessionStorage.clear();
    userContext.setUser({
      isLoggedIn: false,
      userName: "",
      userId: "",
    });
    window.location.hash = "/";
  };
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
        </Left>

        <Center>
          <Logo>LAMA.</Logo>
        </Center>
        {!userContext.user.isLoggedIn ? (
          <Right>
            <MenuItem>
              <Link to="/register">REGISTER</Link>
            </MenuItem>
            <MenuItem style={{ marginLeft: 25 }}>
              <Link to="/">SIGN IN</Link>
            </MenuItem>
          </Right>
        ) : (
          ""
        )}
        {userContext.user.isLoggedIn ? (
          <Right>
            <MenuItem
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                marginRight: "25px",
              }}
              onClick={(e) => {
                document
                  .querySelector(".user-panel")
                  .classList.toggle("active");
              }}
            >
              <i className="fa fa-user"></i>
              <p style={{ fontSize: "20px" }}>{userContext.user.userName}</p>
              <div className="user-panel">
                <span className="logout" onClick={onLogoutClick}>
                  Logout
                </span>
              </div>
            </MenuItem>
            <MenuItem>
              <Link to="/cart">
                <Badge
                  badgeContent={cartContext.cart.products.length}
                  color="primary"
                >
                  <ShoppingCartCheckoutOutlined />
                </Badge>
              </Link>
            </MenuItem>
          </Right>
        ) : (
          ""
        )}
      </Wrapper>
    </Container>
  );
};

export default Navbar;
