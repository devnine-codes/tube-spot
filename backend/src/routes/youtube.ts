import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/categories', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videoCategories`, {
            params: {
                part: 'snippet',
                regionCode: 'KR',
                hl: 'ko',
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '카테고리 정보를 가져오는 데 실패했습니다.' });
    }
});

// YouTube 채널 검색
router.get('/search-channel', async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: query,
                type: 'channel',
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search channel' });
    }
});

// YouTube 채널 세부 정보 가져오기
router.get('/channel/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: id,
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data.items[0]);
    } catch (error) {
        console.error('Failed to fetch channel details:', error);
        res.status(500).json({ message: 'Failed to fetch channel details' });
    }
});

// YouTube 채널 업로드 영상 목록 가져오기
router.get('/channel/videos/:playlistId', async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
                part: 'snippet',
                playlistId: playlistId,
                maxResults: 10,
                key: YOUTUBE_API_KEY,
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error('Failed to fetch channel videos:', error);
        res.status(500).json({ message: 'Failed to fetch channel videos' });
    }
});

// YouTube 동영상 댓글 가져오기
router.get('/comments/:videoId', async (req: Request, res: Response) => {
    const { videoId } = req.params;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: {
                part: 'snippet',
                videoId: videoId,
                maxResults: 10,
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});

export default router;
