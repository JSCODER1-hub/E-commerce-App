import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { UserContext } from "../context/UserContext";

const Container = styled.div`
  width: 100vw;
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
  width: 40%;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0 0;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
`;

const Register = () => {
  let userContext = useContext(UserContext);

  let [state, setState] = useState({
    email: "",
    password: "",
    name: "",
  });

  let [errors, setErrors] = useState({
    email: [],
    password: [],
    name: [],
  });

  let [dirty, setDirty] = useState({
    email: false,
    password: false,
    name: false,
  });

  let [message, setMessage] = useState("");

  let nameRef = useRef();

  let isValid = () => {
    let valid = true;
    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
      return valid;
    }
  };
  let validate = () => {
    let errorsData = {};

    errorsData.email = [];

    if (!state.email) {
      errorsData.email.push("Email cannot be Empty");
    } else {
      const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!validEmailRegex.test(state.email)) {
        errorsData.email.push("Enter a propper email address");
      }
    }

    errorsData.password = [];

    if (!state.password) {
      errorsData.password.push("Password cannot be Empty");
    } else {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

      if (!passwordRegex.test(state.password)) {
        errorsData.password.push("Enter a propper password");
      }
    }

    errorsData.name = [];
    if (!state.name) {
      errorsData.name.push("Name cannot be Empty");
    }

    setErrors(errorsData);
  };

  let onRegisterClick = async (e) => {
    e.preventDefault();
    validate();
    console.log(isValid());
    if (isValid()) {
      try {
        let addResponse = await fetch(
          "https://api.escuelajs.co/api/v1/users/",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              ...state,
              avatar: "https://api.lorem.space/image/face?w=640&h=480&r=867",
            }),
          }
        );
        let addResponseBody = await addResponse.json();
        if (addResponse.ok) {
          setMessage(
            <span className="text-success">Successfully Registered</span>
          );
          console.log(addResponseBody);
          userContext.setUser({
            isLoggedIn: true,
            userName: addResponseBody.name,
            userId: addResponseBody.id,
          });
          document.location.href = "/store";
        }
      } catch (error) {
        setMessage(
          <span className="text-danger">Error in the internal server</span>
        );
      }
    } else {
      setMessage(
        <span className="text-danger">Email or Password is incorrect</span>
      );
    }
  };

  useEffect(validate, [state.email, state.password, state.name]);
  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input
            placeholder="name"
            ref={nameRef}
            name="name"
            value={state.name}
            onChange={(e) => {
              setState({ ...state, [e.target.name]: e.target.value });
            }}
            onFocus={(e) => {
              setDirty({ ...dirty, [e.target.name]: true });
            }}
          />

          <Input
            placeholder="email"
            value={state.email}
            name="email"
            onChange={(e) => {
              setState({ ...state, [e.target.name]: e.target.value });
            }}
            onFocus={(e) => {
              setDirty({ ...dirty, [e.target.name]: true });
            }}
          />

          <Input
            placeholder="password"
            name="password"
            value={state.password}
            onChange={(e) => {
              setState({ ...state, [e.target.name]: e.target.value });
            }}
            onFocus={(e) => {
              setDirty({ ...dirty, [e.target.name]: true });
            }}
          />

          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button
            onClick={(e) => {
              onRegisterClick(e);
            }}
          >
            CREATE
          </Button>
        </Form>
        {message}
      </Wrapper>
    </Container>
  );
};

export default Register;
