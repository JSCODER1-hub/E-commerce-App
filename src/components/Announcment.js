import React from 'react'
import styled from 'styled-components'

const Conatiner = styled.div`
height:30px;
background-color:teal;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-weight:500; 
font-size:14px;
`
const Announcment = () => {
  return (
    <Conatiner>
        Super Deal! Free Shipping on Orders Over $50
    </Conatiner>
  )
}

export default Announcment