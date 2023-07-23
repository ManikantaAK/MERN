import React, { useState } from "react";
import "./FormComponent.css"; // Import your custom CSS file for styling

const FormComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [method, setMethod] = useState("GET");
  const [getRequestResult, setGetRequestResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    let data = {};

    if (method === "POST") {
      if (!lastName || !firstName) {
        console.error("Missing input field value");
        return;
      }
      data = {
        fname: firstName,
        lname: lastName,
      };
    } else if (method === "PUT") {
      if (!newFirstName || !firstName) {
        console.error("Missing input field value");
        return;
      }
      data = {
        fname: firstName,
        newFname: newFirstName,
      };
    } else if (method === "DELETE") {
      if (!firstName) {
        console.error("Missing input field value");
        return;
      }
      data = {
        fname: firstName,
      };
    } else {
      data = null;
    }

    setIsSubmitting(true);
    fetch("http://localhost:8080/", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "GET" ? null : JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
        if (method === "GET")
          setGetRequestResult(data);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  const GetRequestOutput = ({ data }) => {
    const parsedData = JSON.parse(data);
  
    return (
      <div className="get-request-output">
        <h3>GET Request Output:</h3>
        {Array.isArray(parsedData) ? (
          <ul>
            {parsedData.map((item) => (
              <li key={item._id}>
                {item.fname} {item.lname}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
  };
  
  
  return (
    <div className="form-container">
      <h2>PUT Request Example</h2>
      <form className="form" onSubmit={submitForm}>
        <label htmlFor="fname">First Name:</label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lname">Last Name:</label>
        <input
          type="text"
          id="lname"
          name="lname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="newFirstName">New First Name:</label>
        <input
          type="text"
          id="newFname"
          name="newFirstName"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />

        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        {/* ... (unchanged from previous code) */}
        <button type="submit" className="submit-button">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {/* Display GET request output at the bottom */}
      {method === "GET" && getRequestResult && (
        <GetRequestOutput data={getRequestResult} />
      )}
    </div>
  );
};

export default FormComponent;
