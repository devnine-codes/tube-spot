import express, { Request, Response } from 'express';
import youtubeRoutes from './routes/youtube'

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/youtube', youtubeRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send();
});

app.get('/api', (req: Request, res: Response) => {
    res.send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
