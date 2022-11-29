import React, { useState } from "react";
import FlashcardList from "./FlashcardList";
import "./App.css";
import Header from "./Header";
import { useLocation, Navigate } from "react-router-dom";

function Play() {
  const location = useLocation();

  const [flashcards] = useState(location.state.flashcards ?? []);

  return (
    <>
      {(!flashcards || flashcards.length === 0) && (
        <Navigate to="/" replace={true} />
      )}

      <Header />
      <FlashcardList flashcards={flashcards} />
    </>
  );
}

export default Play;
