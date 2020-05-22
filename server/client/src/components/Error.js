import React from "react";
import styled from "styled-components";

const Error = ({ error }) => {
  return (
    <Container>
      <div>Error: {error}</div>
    </Container>
  );
};

const Container = styled.div`
  border: 3px solid red;
  width: 100%;
  height: 120px;
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin: 1em 0;
  div {
    padding: 0 10px;
    color: #ee6e73;
    font-size: 26px;
  }
`;

export default Error;
