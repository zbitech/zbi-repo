import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import factoryService from "./services/factory.service";

dotenv.config();

if(!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = factoryService.getDatabase();

app.get('/', (req, res) => {
    res.send({message: "Hello World!"});
});
  
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
