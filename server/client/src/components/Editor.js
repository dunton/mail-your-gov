import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Error from "./Error";
import Button from "./Button";
import { mobileBreakpoint } from "../config";
import { stateData } from "../lib/stateData";

const Editor = (props) => {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState(false);
  const [foundLocation, setFoundLocation] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [dropdown, toggleDropdown] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [sending, setSending] = useState(false);

  const stateArr = stateData.map((info) => info.state);

  // get location if possible
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude } = coords;
        const { longitude } = coords;

        const res = await axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPS_GEOLOCATION_KEY}`
          )
          .then(({ data }) => {
            const { results } = data;
            if (!results[0]) {
              throw "no results";
            }
            const { address_components } = results[0];
            let stateContact = null;
            const locationObj = address_components.find(({ long_name }) => {
              if (stateArr.indexOf(long_name.toLowerCase()) > -1) {
                stateContact =
                  stateData[stateArr.indexOf(long_name.toLowerCase())];
              }
              return stateArr.indexOf(long_name.toLowerCase()) > -1;
            });

            setLocation(locationObj.long_name);
            setFoundLocation(true);
            const { gov_name, gov_email } = stateContact;
            populateContactFields(gov_email, gov_name);
          })
          .catch((err) => console.log(err));
      });
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const populateContactFields = (gov_email, gov_name) => {
    if (!gov_email) {
      setContactInfo({ gov_email, gov_name });
      setError(
        `No direct email found, contact page be opened in another tab. If not you can visit the contact form at `
      );
      openContactForm();
    } else {
      setContactInfo({ gov_email, gov_name });
    }
  };

  // if no gov_email open tab to contact_form
  const openContactForm = () => {
    window.open("https://google.com", "blank");
  };

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
      .post("/api/sendEmail", {
        subject,
        content,
        name,
        ...contactInfo,
        location,
      })
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
    populateContactFields(gov_email, gov_name);
  };

  return (
    <Container mobileBreakpoint={mobileBreakpoint}>
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
            from each email is what governor it was sent to.
          </li>
        </ol>
        <p>
          If we don't have your govenor's direct email address we will open
          their contact page in a new window.
        </p>
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
                {(location && (
                  <span onClick={() => toggleDropdown(!dropdown)}>
                    {location}
                  </span>
                )) || (
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
            <div className="contact-field-label">
              Governor&nbsp;Name:&nbsp;
              <br />
              {contactInfo && <span>{contactInfo.gov_name}</span>}
            </div>
          )}
          {location && (
            <div className="contact-field-label">
              Governor&nbsp;Email:&nbsp;
              <br />
              {contactInfo && <span>{contactInfo.gov_email}</span>}
            </div>
          )}
        </div>
        {location && contactInfo.gov_email && (
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
  @media screen and (max-width: 978px) {
    width: 100%;
    padding: 0 20px 50px;
  }
  .headline {
    border-bottom: 1px solid #26a69a;
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

  .contact-field-label br {
    display: none;
    @media screen and (max-width: 978px) {
      display: block;
    }
  }

  input {
    font-size: 26px !important;
    margin: 0 0 1em !important;
  }

  textarea {
    margin: 1em 0;
    min-height: 400px;
    height: auto;
    padding: 20px;
    border: 1px solid grey;
    font-size: 26px;
    &:focus {
      outline-color: #26a69a;
    }
  }
  .submission-fields {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    margin-top: 2.5em;
    @media screen and (max-width: ${(props) => props.mobileBreakpoint}px) {
      flex-direction: column;
    }
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
          color: #26a69a;
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
