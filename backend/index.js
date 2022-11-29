const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
var cors = require("cors");

(async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const port = 3001;

  // open the database
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  try {
    await db.exec(
      "CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
    );
    await db.exec(
      "CREATE TABLE cards (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, module TEXT)"
    );
    await db.exec(
      "CREATE TABLE tags_merge_cards (tag_id INTEGER, card_id INTEGER)"
    );
    await db.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT)"
    );
    await db.exec(
      "CREATE TABLE card_response (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, card_id INTEGER, result TEXT, next_available DATE)"
    );
  } catch (e) {
    console.log(e);
  }

  app.get("/tags", async (req, res) => {
    const tags = await db.all("SELECT * FROM tags");
    res.send(tags);
  });

  async function getCards(module) {
    let result;
    if (module) {
      result = await db.all("SELECT * FROM cards WHERE module = ?", module);
    } else {
      result = await db.all("SELECT * FROM cards");
    }

    for (let i = 0; i < result.length; i++) {
      result[i].tags = [];

      const tagIds = await db.all(
        "SELECT * FROM tags_merge_cards WHERE card_id = ?",
        result[i].id
      );

      for (let j = 0; j < tagIds.length; j++) {
        const tagId = tagIds[j].tag_id;
        const tags = await db.get("SELECT * FROM tags WHERE id = ?", tagId);
        result[i].tags.push(tags);
      }
    }

    return result;
  }

  app.get("/cards", async (req, res) => {
    const module = queryParams.module;
    const result = await getCards(module);
    res.send(result);
  });

  app.get("/cards/batch", async (req, res) => {
    const queryParams = req.query;
    const userid = queryParams.userid;
    const tags = queryParams.tags ? queryParams.tags.split(",") : undefined;
    const module = queryParams.module;
    const date = new Date();

    let cards = await getCards(module);

    if (tags) {
      console.log(tags);
      cards = cards.filter((card) => {
        let containsTag = false;
        card.tags.forEach((cardTag) => {
          tags.forEach((tag) => {
            if (cardTag.name === tag) {
              containsTag = true;
            }
          });
        });
        return containsTag;
      });
    }

    const card_response = await db.all(
      "SELECT * FROM card_response WHERE user_id = ?",
      [userid]
    );

    const responseCards = [];

    cards.forEach((card) => {
      let shouldAdd = true;

      card_response.forEach((response) => {
        if (card.id === response.card_id) {
          if (new Date(response.next_available) > date) {
            shouldAdd = false;
          }
        }
      });

      if (shouldAdd) {
        responseCards.push(card);
      }
    });

    res.send(responseCards);
  });

  app.post("/cards/completed", async (req, res) => {
    const { cardId, userId, result, nextAvailable } = req.body;

    await db.run(
      "INSERT INTO card_response (card_id, user_id, result, next_available) VALUES (?,?,?,?)",
      [cardId, userId, result, nextAvailable]
    );
    res.send({ success: "Card Response Submitted" });
    return;
  });

  app.post("/user", async (req, res) => {
    const { email } = req.body;

    const userExists = await db.get(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    if (userExists) {
      res.send({ error: "User already exists" });
      return;
    }

    await db.run("INSERT INTO users (email) VALUES (?)", [email]);
    res.send({ success: "User created" });
    return;
  });

  app.post("/cards", async (req, res) => {
    const { question, answer, tags, module } = req.body;

    const card = await db.run(
      "INSERT INTO cards (question, answer, module) VALUES (?, ?, ?)",
      [question, answer, module]
    );
    const cardId = card.lastID;

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const tagExists = await db.get("SELECT * FROM tags WHERE name = ?", tag);
      if (!tagExists) {
        await db.run("INSERT INTO tags (name) VALUES (?)", tag);
      }

      const result = await db.get("SELECT * FROM tags WHERE name = ?", tag);
      const tagId = result.id;

      await db.run(
        "INSERT INTO tags_merge_cards (tag_id, card_id) VALUES (?,?)",
        [tagId, cardId]
      );
    }

    res.send({ success: true });
  });

  app.listen(port, () =>
    console.log(`Hello world app listening on port ${port}!`)
  );
})();
