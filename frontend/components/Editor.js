import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Error from "./Error";
import Button from "./Button";

const Editor = (props) => {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("rico bosco");
  const [location, setLocation] = useState(false);
  const [foundLocation, setFoundLocation] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [dropdown, toggleDropdown] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [sending, setSending] = useState(false);

  const stateData = [
    { state: "Alabama", gov_name: "Kay Ivey", gov_email: "" },
    { state: "Alaska", gov_name: "", gov_email: "" },
    { state: "Arizona", gov_name: "Douglas Ducey", gov_email: "" },
    { state: "Arkansas", gov_name: "Asa Hutchinson", gov_email: "" },
    { state: "California", gov_name: "Gavin Newsom", gov_email: "" },
    { state: "Colorado", gov_name: "Jared Polis", gov_email: "" },
    { state: "Connecticut", gov_name: "Edward Lamont", gov_email: "" },
    { state: "Delaware", gov_name: "John Carney", gov_email: "" },
    { state: "Florida", gov_name: "Ronald DeSantis", gov_email: "" },
    { state: "Georgia", gov_name: "Nathan Deal", gov_email: "" },
    { state: "Hawaii", gov_name: "", gov_email: "" },
    { state: "Idaho", gov_name: "", gov_email: "" },
    { state: "Illinois", gov_name: "", gov_email: "" },
    { state: "Iowa", gov_name: "", gov_email: "" },
    { state: "Kansas", gov_name: "", gov_email: "" },
    { state: "Kentucky", gov_name: "", gov_email: "" },
    { state: "Lousiana", gov_name: "", gov_email: "" },
    { state: "Maine", gov_name: "", gov_email: "" },
    { state: "Maryland", gov_name: "", gov_email: "" },
    { state: "Massachusetts", gov_name: "", gov_email: "" },
    { state: "Michigan", gov_name: "", gov_email: "" },
    { state: "Minnesota", gov_name: "", gov_email: "" },
    { state: "Mississippi", gov_name: "", gov_email: "" },
    { state: "Missouri", gov_name: "", gov_email: "" },
    { state: "Montana", gov_name: "", gov_email: "" },
    { state: "Nevada", gov_name: "", gov_email: "" },
    { state: "New Hampshire", gov_name: "", gov_email: "" },
    { state: "New Jersey", gov_name: "", gov_email: "" },
    { state: "New Mexico", gov_name: "", gov_email: "" },
    { state: "New York", gov_name: "Andrew Cuomo", gov_email: "cuomo@govs" },
    { state: "North Carolina", gov_name: "", gov_email: "" },
    { state: "North Dakota", gov_name: "", gov_email: "" },
    { state: "Ohio", gov_name: "", gov_email: "" },
    { state: "Oklahoma", gov_name: "", gov_email: "" },
    { state: "Oregon", gov_name: "", gov_email: "" },
    { state: "Rhode Island", gov_name: "", gov_email: "" },
    { state: "South Carolina", gov_name: "", gov_email: "" },
    { state: "South Dakota", gov_name: "", gov_email: "" },
    { state: "Tennessee", gov_name: "", gov_email: "" },
    { state: "Texas", gov_name: "", gov_email: "" },
    { state: "Utah", gov_name: "", gov_email: "" },
    { state: "Vermont", gov_name: "", gov_email: "" },
    { state: "Virginia", gov_name: "", gov_email: "" },
    { state: "Washington", gov_name: "", gov_email: "" },
    { state: "West Virginia", gov_name: "", gov_email: "" },
    { state: "Wisconsin", gov_name: "", gov_email: "" },
    { state: "Wyoming", gov_name: "", gov_email: "" },
  ];

  const stateArr = stateData.map((info) => info.state);

  // get location if possible
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(async ({ coords }) => {
  //       const { latitude } = coords;
  //       const { longitude } = coords;

  //       const res = await axios
  //         .get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPS_GEOLOCATION_KEY}`
  //         )
  //         .then(({ data }) => {
  //           const { results } = data;
  //           if (!results[0]) {
  //             throw "no results";
  //           }
  //           const { address_components } = results[0];
  //           let stateContact = null;
  //           const locationObj = address_components.find(({ long_name }) => {
  //             if (stateArr.indexOf(long_name.toLowerCase()) > -1) {
  //               stateContact =
  //                 stateData[stateArr.indexOf(long_name.toLowerCase())];
  //             }
  //             return stateArr.indexOf(long_name.toLowerCase()) > -1;
  //           });

  //           setLocation(locationObj.long_name);
  //           setFoundLocation(true);
  //           const { gov_name, gov_email } = stateContact;
  //           setContactInfo({ gov_email, gov_name });
  //         })
  //         .catch((err) => console.log(err));
  //     });
  //   } else {
  //     console.error("Geolocation not supported");
  //   }
  // }, []);

  const filterEmail = (content) => {
    const filteredWords = ["fuck", "shit", "gay", "fag", "ass"];
    const checkWords = (word) => {
      const value = filteredWords.some((badWord) => {
        if (word.includes(badWord)) {
          return true;
        }
      });

      return value;
    };

    const result = content.split(" ").filter(checkWords);
    if (result.length) {
      return false;
    }

    return true;
  };

  const sendEmail = () => {
    axios
      .post("/api/sendEmail", { subject, content, name })
      .then(({ data }) => {
        const { success } = data;
        if (success) {
          setSending(false);
          setDone(true);
        } else {
          setError("Issue with delivering email, please try again");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    const approved = filterEmail(content) && filterEmail(subject);
    if (!approved) {
      setError(
        "Email content not approved. Please check for profanity and try again"
      );
      return;
    }

    const govEmails = stateData.map((info) => info.gov_email);
    if (govEmails.indexOf(contactInfo.gov_email) === -1) {
      setError("Bad email input, refresh and try page again");
      return;
    }

    if (!subject || !content) {
      setError(
        "Please make sure you've filled out both the subject line and email content fields"
      );
      return;
    }

    setError(false);
    setSending(true);
    sendEmail();
  };

  const handleDropdownClick = (state) => {
    setLocation(state);
    toggleDropdown(!dropdown);
    const stateObj = stateData.find((info) => {
      return info.state === state;
    });
    const { gov_name, gov_email } = stateObj;
    setContactInfo({ gov_name, gov_email });
  };

  return (
    <Container>
      <div>
        <div className="headline">
          <h1>Email Your Governor</h1>
        </div>

        <p>
          This is a site to easily email your governor with whatever thoughts
          you may have. There are two ways to use this webpage
        </p>
        <ol>
          <li>
            You can find your governor's email address below and email him from
            your personal email. This is recommended because getting a flurry of
            emails from mailyourgov.com may seem like spam.
          </li>
          <li>
            You can fill out the form below email your governor, which will send
            an email from mailyourgov@gmail.com. The only data I will be saving
            from each email is who it was sent to.
          </li>
        </ol>
        <p>All fields are required.</p>
        <p>Note: I have done my best to filter out profanity.</p>
      </div>

      <div>
        <h4>{!location && "Select your state!"}</h4>
        <div className="submission-fields">
          <div>
            <div className="state-dropdown">
              <div>State:&nbsp;</div>
              <div>
                {location || (
                  <div
                    className="location-field"
                    onClick={() => toggleDropdown(!dropdown)}
                  >
                    <i className="material-icons">arrow_downward</i>
                  </div>
                )}
                <div className="dropdown">
                  {dropdown &&
                    stateData.map(({ state }) => {
                      return (
                        <div
                          key={state}
                          onClick={() => handleDropdownClick(state)}
                        >
                          {state}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          {location && (
            <div>
              Governor Name:{" "}
              {contactInfo && <span>{contactInfo.gov_name}</span>}
            </div>
          )}
          {location && (
            <div>
              Governor Email:{" "}
              {contactInfo && <span>{contactInfo.gov_email}</span>}
            </div>
          )}
        </div>
        {location && (
          <div className="input-fields">
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder={"Name..."}
              value={name}
            />

            <input
              onChange={(e) => setSubject(e.target.value)}
              placeholder={"Subject..."}
              value={subject}
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Write your email here..."
            ></textarea>
          </div>
        )}
        {error && <Error error={error} />}
        <div>
          {location && contactInfo && (
            <Button done={done} handleSubmit={handleSubmit} sending={sending} />
          )}
        </div>
      </div>
    </Container>
  );
};

const bob = keyframes`
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(5px);
  }
`;

const Container = styled.div`
  width: 80%;
  margin: auto;
  padding-bottom: 80px;
  .headline {
    border-bottom: 1px solid grey;
    h1 {
      text-align: left;
      font-size: 48px;
      color: #ee6e73;
    }
  }

  p,
  li {
    font-size: 20px;
  }

  li {
    margin: 1em 0;
  }

  h4 {
    color: #ee6e73;
    font-size: 36px;
  }

  .input-fields {
    margin-top: 40px;
  }

  textarea {
    margin: 1em 0;
    min-height: 400px;
    height: auto;
    padding: 20px;
    border: 1px solid grey;
  }
  .submission-fields {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    button {
      background: aqua;
      color: white;
      cursor: pointer;
    }

    span {
      color: #ee6e73;
    }
    .state-dropdown {
      display: inline-flex;
      .location-field {
        border-bottom: 2px solid pink;
        width: 184px;
        text-align: right;
        cursor: pointer;
        i {
          height: 24px;
          width: 24px;
          color: green;
          animation: ${bob} 1s alternate infinite;
        }
      }
      .dropdown {
        background: white;
        color: black;
        max-height: 300px;
        overflow-y: scroll;
        div {
          padding: 10px;
          border-bottom: 2px solid #ee6e73;
          cursor: pointer;
        }
      }
    }
  }
`;

export default Editor;
