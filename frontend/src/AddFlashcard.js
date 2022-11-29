import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Header from "./Header";
import ReactTags from "react-tag-autocomplete";
import { getTags, addCard } from "./Networking";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function AddFlashcard() {
  const location = useLocation();
  const inputState = location.state ?? { tags: [] };

  const [tags, setTags] = useState(inputState.tags);
  const [suggestions, setSuggestions] = useState([]);
  const [question, setQuestion] = useState(inputState.question);
  const [answer, setAnswer] = useState(inputState.answer);
  const [module, setModule] = useState(inputState.module);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const tags = await getTags();
      setSuggestions(tags);
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

  const onSubmit = async () => {
    if (!validate()) {
      console.log("All fields must be filled");
      return;
    }
    const newTags = tags.map((tag) => {
      return tag.name;
    });

    await addCard(question, answer, module, newTags);
    setSubmitted(true);
  };

  const validate = () => {
    if (tags.length === 0) {
      return false;
    }

    if (question.length < 10) {
      return false;
    }

    if (answer.length < 3) {
      return false;
    }

    return true;
  };

  return (
    <>
      {submitted && <Navigate to="/" replace={true} />}

      <Header />
      <div className="module">
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">Question</span>
            <textarea
              className="form-control"
              aria-label="Question"
              rows="5"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">Answer</span>
            <textarea
              className="form-control"
              aria-label="Answer"
              rows="5"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
              }}
            ></textarea>
          </div>
        </div>
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
            suggestions={suggestions}
            onDelete={onDelete}
            onAddition={onAddition}
            allowNew={true}
            newTagText={"Add new tag: "}
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </>
  );
}

export default AddFlashcard;
