import React, { useState, useId } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("What are the recent sport events?");
  const [tools, setTools] = useState([
    "Twitter Search",
    "Google Search",
    "Google News Search",
    "Google Image Search",
    "Bing Search",
    "ArXiv Search",
    "Wikipedia Search",
    "Youtube Search",
    "Hacker News Search",
    "Reddit Search",
  ]);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  const toolsId = useId();
  const queryId = useId();
  const uidId = useId();

  const handleClick = async () => {
    const baseUrl = "https://api.smartscrape.ai";

    // Tools array are converted to string
    const toolsString = JSON.stringify(tools);
    const url = `${baseUrl}/search?query=${query}&tools=${toolsString}${
      uid ? `&uid=${uid}` : ""
    }`;

    console.log("Fetching data with url...", url);

    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("DATA: ", data);
    } catch (error) {
      console.log("ERROR: ", error);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div className="form-group">
        <label htmlFor={toolsId}>Tool Names</label>
        <textarea
          id={toolsId}
          onChange={(e) => setTools(e.target.value.split("\n"))}
          value={tools.join("\n")}
          rows={10}
        />
      </div>

      <div className="form-group">
        <label htmlFor={queryId}>Query</label>
        <input
          id={queryId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor={uidId}>Uid (Optional)</label>
        <input
          id={uidId}
          type="text"
          onChange={(e) => setUid(e.target.value)}
          value={uid}
        />
      </div>

      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          opacity: loading ? "0.6" : "1.0",
        }}
      >
        {loading ? "Fetching data..." : "Fetch data"}
      </button>

      <p>Check browser console for data</p>
    </div>
  );
}

export default App;
