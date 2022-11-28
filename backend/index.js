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
      "CREATE TABLE card_response (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, card_id INTEGER, result TEXT)"
    );
  } catch (e) {
    console.log(e);
  }

  app.get("/tags", async (req, res) => {
    const tags = await db.all("SELECT * FROM tags");
    res.send(tags);
  });

  app.get("/cards", async (req, res) => {
    const result = await db.all(
      "SELECT cards.id, cards.question, cards.answer FROM cards"
    );

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

    res.send(result);
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
      console.log();
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
