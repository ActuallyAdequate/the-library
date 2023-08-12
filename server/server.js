import express from 'express';
import cors from 'cors';
import { Library } from './library.js';
import FileStore from './filestore.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../client/build"));

const keyStore = new FileStore(path.join(app.getPath('userData'), '/keys.json')); // need to get from DOcker container
const keys =  keyStore.LoadJSON();
const fileStore = new FileStore(path.join(app.getPath('documents'), '/libraryStore.json')); //need to get from Docker container

const library = new Library(fileStore, keys);

app.post('/library', (req, res) => {
    let json = request.body;

    res.json({ message: "Hello from server!" });
});

app.listen(5000, () => {
    console.log(`Server is running on port 5000.`);
  });