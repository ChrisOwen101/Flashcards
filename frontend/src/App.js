import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./Header";
import { getBatchCards } from "./Networking";
import ReactTags from "react-tag-autocomplete";
import { getTags } from "./Networking";
import { useNavigate } from "react-router-dom";

function App() {
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [module, setModule] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const tags = await getTags();
      setTagSuggestions(tags);
    };
    load();
  }, []);

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((_, i) => i !== tagIndex));
    },
    [tags]
  );

  const onAddition = useCallback(
    async (newTag) => {
      setTags([...tags, newTag]);
    },
    [tags]
  );

  async function onPlayClicked() {
    const userId = localStorage.getItem("id");
    const flashcards = await getBatchCards(userId, module, tags);
    navigate("/play", { state: { flashcards } });
  }

  return (
    <>
      <Header />
      <div className="module">
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">Module & Week:</span>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                setModule(e.target.value);
              }}
            >
              <option value="-1">-</option>
              <option value="Fundamentals: Week 1">Fundamentals: Week 1</option>
              <option value="Fundamentals: Week 2">Fundamentals: Week 2</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <ReactTags
            style={{ width: "100%", padding: "100px" }}
            minQueryLength={3}
            tags={tags}
            suggestions={tagSuggestions}
            onDelete={onDelete}
            onAddition={onAddition}
            allowNew={false}
            newTagText={"Add new tag: "}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={onPlayClicked}
        >
          Play!
        </button>
      </div>
    </>
  );
}

export default App;
