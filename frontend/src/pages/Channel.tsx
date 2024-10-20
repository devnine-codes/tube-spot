import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetails, getChannelVideos } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';

const Channel: React.FC = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    // 캐시된 비디오 데이터를 로컬 스토리지에서 가져오는 함수
    const getCachedVideos = (channelId: string) => {
        const cachedData = localStorage.getItem(`videos_${channelId}`);
        return cachedData ? JSON.parse(cachedData) : null;
    };

    // 비디오 데이터를 로컬 스토리지에 저장하는 함수
    const cacheVideos = (channelId: string, data: any) => {
        localStorage.setItem(`videos_${channelId}`, JSON.stringify(data));
    };

    const fetchChannelData = async () => {
        if (!id) return;

        const cachedVideos = getCachedVideos(id);
        if (cachedVideos) {
            setVideos(cachedVideos);
        } else {
            try {
                const channelData = await getChannelDetails(id);
                setChannel(channelData);

                const playlistId = channelData.contentDetails.relatedPlaylists.uploads;
                const videoData = await getChannelVideos(playlistId);

                setVideos(videoData);
                cacheVideos(id, videoData);
            } catch (error) {
                console.error('Error fetching channel or videos:', error);
            }
        }
    };

    useEffect(() => {
        fetchChannelData();
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
            <div className="w-full mx-auto p-6">
                {/* 채널 정보 표시 */}
                {channel && (
                    <div className="channel-details text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {channel.snippet.title}
                        </h2>
                        <p className="text-gray-300 mb-6">{channel.snippet.description}</p>
                        <img
                            src={channel.snippet.thumbnails.high.url}
                            alt={channel.snippet.title}
                            className="mx-auto max-w-lg w-full h-auto rounded-lg object-contain"
                        />
                    </div>
                )}

                {/* 비디오 플레이어 */}
                {selectedVideoId && (
                    <div className="mt-8">
                        <VideoPlayer videoId={selectedVideoId} />
                    </div>
                )}

                {/* 업로드된 영상 목록 */}
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
            </div>
        </div>
    );
};

export default Channel;
