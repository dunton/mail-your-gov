import React, { useState } from "react";
import styled from "styled-components";

const Venmo = (props) => {
  const [active, toggleActive] = useState(false);
  return (
    <Container>
      buy me a coffee
      <br />
      with Venmo
    </Container>
  );
};

const Container = styled.div`
  background: blue;
  color: white;
  border-radius: 5px;
  width: 200px;
  position: fixed;
  right: 15px;
  bottom: 15px;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  border: 1px solid blue;
  &:hover {
    background: white;
    color: blue;
  }
`;

export default Venmo;
