import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../client/build"))

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(5000, () => {
    console.log(`Server is running on port 5000.`);
  });