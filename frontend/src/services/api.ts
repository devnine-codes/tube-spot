import axios from 'axios';

// YouTube 카테고리 목록 가져오기
export const getCategories = async () => {
    const response = await axios.get('/api/youtube/categories');
    return response.data;
};

// YouTube 채널 검색
export const searchChannel = async (query: string) => {
    const response = await axios.get('/api/youtube/search-channel', {
        params: { query }
    });
    return response.data;
};

// YouTube 채널 세부 정보 가져오기
export const getChannelDetails = async (channelId: string) => {
    const response = await axios.get(`/api/youtube/channel/${channelId}`);  // 채널 ID를 경로로 전달
    return response.data;
};

// 채널의 업로드된 영상 목록을 백엔드 API에서 가져오기
export const getChannelVideos = async (playlistId: string) => {
    const response = await axios.get(`/api/youtube/channel/videos/${playlistId}`);
    return response.data;
};