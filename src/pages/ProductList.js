import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcment";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { UserContext } from "../context/UserContext";
import { Search } from "@mui/icons-material";

const Container = styled.div``;
const Title = styled.h1`
  margin: 20px;
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;
const SearchContainer = styled.div`
  border: 0.5px solid lightgrey;
  display: flex;
  height: auto;
  justify-content: center;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  font-size: 20px;
  ${mobile({ width: "50px" })};
`;
const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;
const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  ${mobile({ margin: "10px 0" })}
`;
const Option = styled.option``;

const ProductList = () => {
  let userContext = useContext(UserContext);
  let [products, setProducts] = useState([]);
  let [search, setSearch] = useState("");
  let [sortBy, setSortBy] = useState("price");
  let [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    (async () => {
      let productsResponse = await fetch(
        `http://localhost:5000/products?category_like=clothing&title_like=${search}&_sort=price&_order=ASC`
      );
      let productsResponseBody = await productsResponse.json();

      setProducts(productsResponseBody);
    })();
  }, [search]);

  useEffect(() => {
    let newArray = [...products];
    if (products && sortOrder != "") {
      newArray.sort((a, b) => {
        if (a[sortBy] && b[sortBy]) {
          return a[sortBy] - b[sortBy];
        }
      });
      if (sortOrder === "DESC") {
        newArray.reverse();
      }
    }
    setProducts(newArray);
  }, [sortOrder]);
  return (
    <Container>
      <Announcement />
      <Title>Products</Title>
      <FilterContainer>
        <SearchContainer>
          <Input
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search style={{ color: "gray", fontSize: 16 }} />
        </SearchContainer>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <Option selected value={""} disabled>
              Newest
            </Option>
            <Option value={"ASC"}>Price (asc)</Option>
            <Option value={"DESC"}>Price (desc)</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products products={products} />
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default ProductList;
