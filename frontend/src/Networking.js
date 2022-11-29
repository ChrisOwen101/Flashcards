import axios from "axios";

export async function getTags() {
  const response = await axios.get("http://localhost:3001/tags");
  return response.data;
}

export async function getCards() {
  const response = await axios.get("http://localhost:3001/cards");
  return response.data;
}

export async function getBatchCards(userId, module, tags) {
  let url = `http://localhost:3001/cards/batch?userid=${userId}`;

  if (module) {
    url += `&module=${module}`;
  }

  if (tags && tags.length > 0) {
    url += `&tags=${tags.map((tag) => tag.name).join(",")}`;
  }

  console.log(url);

  const response = await axios.get(url);
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

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export async function postCardCompleted(cardId, userId, result, mins) {
  console.log(cardId);
  const nextAvailable = addMinutes(new Date(), mins);
  const response = await axios.post("http://localhost:3001/cards/completed", {
    cardId,
    userId,
    result,
    nextAvailable,
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
