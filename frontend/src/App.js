import React, { useState, useEffect } from "react";
import FlashcardList from "./FlashcardList";
import "./App.css";
import Header from "./Header";
import { getCards } from "./Networking";

function App() {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const load = async () => {
      const cards = await getCards();
      setFlashcards(cards);
    };
    load();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
