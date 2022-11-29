import React, { useState } from "react";
import Flashcard from "./Flashcard";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { postCardCompleted } from "./Networking";

export default function FlashcardList({ flashcards }) {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [currentFlashcardShown, setCurrentFlashcardShown] = useState(false);

  async function onButtonClicked(result, mins) {
    await postCardCompleted(
      flashcards[currentFlashcard].id,
      localStorage.getItem("id"),
      result,
      mins
    );

    if (currentFlashcard < flashcards.length) {
      setCurrentFlashcard(currentFlashcard + 1);
      setCurrentFlashcardShown(false);
    }
  }

  return (
    <div className="container">
      <Carousel
        showArrows={false}
        showIndicators={false}
        showStatus={false}
        showThumbs={false}
        selectedItem={currentFlashcard}
      >
        {flashcards
          .map((flashcard) => {
            return (
              <Flashcard
                flashcard={flashcard}
                key={flashcard.key}
                onClick={() => {
                  setCurrentFlashcardShown(true);
                }}
              />
            );
          })
          .concat([<div key="end">Cards Done</div>])}
      </Carousel>
      {currentFlashcardShown ? (
        <div className="buttonContainer">
          <button
            type="button"
            class="btn btn-secondary btn-response"
            onClick={async () => {
              await onButtonClicked("Again", 25);
            }}
          >
            Again (25m)
          </button>
          <button
            type="button"
            class="btn btn-danger btn-response"
            onClick={async () => {
              await onButtonClicked("Hard", 12 * 60);
            }}
          >
            Hard (12h)
          </button>
          <button
            type="button"
            class="btn btn-warning btn-response"
            onClick={async () => {
              await onButtonClicked("Good", 24 * 60);
            }}
          >
            Good (1d)
          </button>
          <button
            type="button"
            class="btn btn-success btn-response"
            onClick={async () => {
              await onButtonClicked("Easy", 4 * 24 * 60);
            }}
          >
            Easy (4d)
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
