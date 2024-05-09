import { useState } from "react";
import "./App.css";
import axios, { AxiosResponse } from "axios";

function App() {
  const [response, setResponse] = useState<any>(null);
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!value) {
      setLoading(false);
      alert("Please enter a query");
      return;
    }

    axios
      .post("http://51.159.14.163:8001/api/text_query", {
        network: "Bitcoin",
        user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        prompt: value,
      })
      .then((res: AxiosResponse) => {
        console.log(res.data);
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);

        if (err.response && err.response?.status < 500) {
          if (
            typeof err.response.data === "object" &&
            err.response.data &&
            "detail" in err.response.data
          ) {
            const responseData = err.response.data as { detail: string };

            setResponse(
              `Error: ${responseData.detail || "Something Went Wrong"}`
            );
            return;
          }
        }
        setResponse("Error: Something Went Wrong");
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" value={value} onChange={handleChange} />
        <button
          type="submit"
          disabled={loading}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "submitting" : "Submit"}
        </button>
      </form>
      <div className="response-container">
        {response?.miner_id ? (
          <>
            <p>Miner ID: {response.miner_id}</p>
            <pre>{response.text}</pre>
          </>
        ) : (
          <pre>{response}</pre>
        )}
      </div>
    </div>
  );
}

export default App;
