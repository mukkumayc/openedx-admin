import { create } from "domain";
import React, { useState } from "react";

const MakeRequest = () => {
  const [body, setBody] = useState("");
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div>
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value || "")}
        />
        <button
          onClick={() => {
            try {
              JSON.parse(body);
            } catch (err) {
              console.log(err);
              // alert(err.toString());
              return;
            }
          }}
        >
          Make
        </button>
      </div>
    </div>
  );
};

export default MakeRequest;
