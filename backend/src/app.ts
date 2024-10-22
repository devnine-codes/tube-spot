import express, { Request, Response, NextFunction } from 'express';
import youtubeRoutes from './routes/youtube'
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`API 요청: ${req.method} ${req.url}`);
    next();
});

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
