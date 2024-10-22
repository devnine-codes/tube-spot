import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetails, getChannelVideos } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';

const Channel: React.FC = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const CACHE_TTL = 3600 * 1000;
    const CACHE_KEY = `channel_${id}`;

    // 로컬스토리지에서 데이터를 가져오는 함수
    const getCachedData = (key: string) => {
        const cached = localStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                return data;
            }
        }
        return null;
    };

    const cacheData = (key: string, data: any) => {
        const cacheObject = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
    };

    const checkFavoriteStatus = (id: string) => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.includes(id);
    };

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.includes(id)) {
            const updatedFavorites = favorites.filter((favId: string) => favId !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorite(false);
        } else {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    useEffect(() => {
        const fetchChannelData = async () => {
            if (!id) return;

            const cachedData = getCachedData(CACHE_KEY);
            if (cachedData) {
                setChannel(cachedData.channel);
                setVideos(cachedData.videos);
            } else {
                try {
                    const channelData = await getChannelDetails(id);
                    setChannel(channelData);

                    const playlistId = channelData.contentDetails.relatedPlaylists.uploads;
                    const videoData = await getChannelVideos(playlistId);

                    setVideos(videoData);

                    cacheData(CACHE_KEY, { channel: channelData, videos: videoData });
                } catch (error) {
                    console.error('Error fetching channel or videos:', error);
                }
            }

            setIsFavorite(checkFavoriteStatus(id));
        };

        fetchChannelData();
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
            <div className="w-full mx-auto p-6">
                {selectedVideoId ? (
                    <VideoPlayer videoId={selectedVideoId} />
                ) : (
                    <>
                        {channel && (
                            <div className="channel-details text-center">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    {channel.snippet.title}
                                    <button
                                        onClick={toggleFavorite}
                                        className={`ml-4 px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                                    >
                                        {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                                    </button>
                                </h2>
                                <p className="text-gray-300 mb-6">{channel.snippet.description}</p>
                                <img
                                    src={channel.snippet.thumbnails.high.url}
                                    alt={channel.snippet.title}
                                    className="mx-auto max-w-lg w-full h-auto rounded-lg object-contain"
                                />
                            </div>
                        )}

                        <h3 className="text-2xl font-bold mt-8 text-white">업로드된 영상</h3>
                        <div className="video-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <div
                                    key={video.snippet.resourceId.videoId}
                                    className="card cursor-pointer bg-gray-700 hover:bg-gray-600 transition duration-200"
                                    onClick={() => setSelectedVideoId(video.snippet.resourceId.videoId)}
                                >
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                    <h4 className="mt-2 text-lg font-semibold text-white">{video.snippet.title}</h4>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Channel;
