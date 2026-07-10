import { useState } from "react";
import API from "../services/api";

function Test() {
  const [message, setMessage] = useState("");

  const connectBackend = async () => {
    try {
      const res = await API.get("/");
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Backend Connection Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Interview</h1>

      <button onClick={connectBackend}>Test Backend Connection</button>

      <h2>{message}</h2>
    </div>
  );
}

export default Test;
