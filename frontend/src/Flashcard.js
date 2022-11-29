import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Flashcard({ flashcard, onClick }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");
  const navigate = useNavigate();

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height * 3;
    const backHeight = backEl.current.getBoundingClientRect().height * 3;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(() => {
    setMaxHeight();
    setFlip(false);
  }, [flashcard.question, flashcard.answer]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  function onEditClicked() {
    console.log(flashcard);
    navigate("/addcard", {
      state: flashcard,
    });
  }

  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      style={{ height: height }}
      onClick={() => {
        if (!flip) {
          setFlip(!flip);
          onClick();
        }
      }}
    >
      <div className="front" ref={frontEl}>
        <h1>{flashcard.question}</h1>
        <div>
          <h6>
            Tags:{" "}
            {flashcard.tags ? (
              flashcard.tags
                .map((tag) => {
                  return tag.name;
                })
                .join(", ")
            ) : (
              <></>
            )}
          </h6>
          <button
            onClick={() => {
              onEditClicked();
            }}
          >
            Edit Card
          </button>
        </div>
      </div>
      <div className="back" ref={backEl}>
        <h1>{flashcard.answer}</h1>
      </div>
    </div>
  );
}
