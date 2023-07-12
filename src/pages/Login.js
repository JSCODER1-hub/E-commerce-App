import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";

const Container = styled.div`
  width: auto;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    )
    url() center;
  display: flex;
  background-size: cover;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  padding: 20px;
  width: 25%;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  color: white;
  background-color: teal;
  margin-bottom: 10px;
`;
const Link = styled.a`
  margin: 5px 0;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Login = () => {
  let userContext = useContext(UserContext);
  let cartContext = useContext(CartContext);

  let [email, setEmail] = useState("john@gmail.com");
  let [password, setPassword] = useState("m38rmF$");

  let [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  let [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  let [message, setMessage] = useState("");

  let emailRef = useRef();

  let validate = () => {
    let errorsData = {};

    errorsData.email = [];

    if (!email) {
      errorsData.email.push("Email cannot be Empty");
    } else {
      // const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      // if (!validEmailRegex.test(email)) {
      //   errorsData.email.push("Enter a propper email address");
      // }
    }

    errorsData.password = [];

    if (!password) {
      errorsData.password.push("Password cannot be Empty");
    } else {
    }

    setErrors(errorsData);
  };

  useEffect(() => {
    emailRef.current.focus();
  }, []);
  useEffect(() => {
    validate();
  }, [email, password]);

  let isValid = () => {
    let valid = true;

    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  let onLoginClick = async (e) => {
    e.preventDefault();
    validate();

    if (isValid()) {
      let loginResponse = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      let loginResponseBody = await loginResponse.json();
      if (loginResponse.ok) {
        userContext.setUser({
          isLoggedIn: true,
          userName: loginResponseBody[0].username,
          userId: loginResponseBody[0].id,
        });
        let cartResponse = await fetch(
          `http://localhost:5000/carts?userId=${loginResponseBody[0].id}`
        );
        let cartResponseBody = await cartResponse.json();

        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("userName", loginResponseBody[0].username);
        sessionStorage.setItem("userId", loginResponseBody[0].id);

        sessionStorage.setItem("id", cartContext.cart.id);
        sessionStorage.setItem("userId", cartContext.cart.userId);
        sessionStorage.setItem("date", cartContext.cart.date);
        sessionStorage.setItem(
          "products",
          JSON.stringify(cartContext.cart.products)
        );
        sessionStorage.setItem("__v", 0);

        cartContext.setCart(cartResponseBody[0]);
        window.location.hash = "/store";
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            placeholder="email"
            type="text"
            value={email}
            name="email"
            onBlur={(e) => {
              setDirty({ ...dirty, [e.target.name]: true });
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            ref={emailRef}
          />
          {errors.email && dirty.email
            ? errors.email.map((err) => {
                return <span className="text-danger">{err}</span>;
              })
            : ""}
          <Input
            placeholder="password"
            type="text"
            value={password}
            onBlur={(e) => {
              setDirty({ ...dirty, [e.target.name]: true });
            }}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {errors.password && dirty.password
            ? errors.password.map((err) => {
                return <span className="text-danger">{err}</span>;
              })
            : ""}
          {errors.password.length > 0 && dirty.password
            ? errors.password.forEach((err) => (
                <span className="text-danger">{err}</span>
              ))
            : ""}
          <Button
            onClick={(e) => {
              onLoginClick(e);
            }}
          >
            LOGIN
          </Button>
          <Link>DO NOT YOU REMMEMBER THE PASSWORD</Link>
          <Link>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
