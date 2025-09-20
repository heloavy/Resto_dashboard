import express from 'express';
import cors from 'cors';
import menuRouter from './routes/menu.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/menu', menuRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
