import React from "react";

const Button = ({ done, handleSubmit, sending }) => {
  return (
    <>
      {!done && (
        <button
          className="btn waves-effect waves-light"
          type="submit"
          onClick={handleSubmit}
        >
          Send{sending && "ing"} Email&nbsp;
          <i className="material-icons right">send</i>
        </button>
      )}
      {done && (
        <button className="btn waves-effect waves-light">
          Sent<i className="material-icons">done</i>
        </button>
      )}
    </>
  );
};

export default Button;
