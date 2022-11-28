import React, { useState, useEffect } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardList({ flashcards }) {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  return (
    <div>
      {flashcards[currentFlashcard] ? (
        <Flashcard flashcard={flashcards[currentFlashcard]} />
      ) : (
        <div></div>
      )}
    </div>
  );
}
