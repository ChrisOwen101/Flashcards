import axios from "axios";

export async function getTags() {
  const response = await axios.get("http://localhost:3001/tags");
  console.log(response);
  return response.data;
}

export async function getCards() {
  const response = await axios.get("http://localhost:3001/cards");
  console.log(response);
  return response.data;
}

export async function addCard(question, answer, module, tags) {
  const response = await axios.post("http://localhost:3001/cards", {
    question,
    answer,
    module,
    tags,
  });
  console.log(response);
  return response.data;
}

export async function createUser(email) {
  const response = await axios.post("http://localhost:3001/user", {
    email,
  });
  console.log(response);
  return response.data;
}
