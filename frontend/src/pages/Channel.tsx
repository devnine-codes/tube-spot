import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'; // 쿠키 라이브러리
import { getChannelDetails, getChannelVideos } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';

const Channel: React.FC = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false); // 즐겨찾기 여부

    useEffect(() => {
        const fetchChannelData = async () => {
            if (id) {
                const channelData = await getChannelDetails(id);
                setChannel(channelData);

                const playlistId = channelData.contentDetails.relatedPlaylists.uploads;
                const videoData = await getChannelVideos(playlistId);
                setVideos(videoData);
            }
        };
        fetchChannelData();
        checkFavoriteStatus(); // 즐겨찾기 상태 확인
    }, [id]);

    // 쿠키에서 즐겨찾기 상태 확인
    const checkFavoriteStatus = () => {
        const favorites = Cookies.get('favorites'); // 쿠키에서 'favorites' 가져오기
        const favoriteList = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoriteList.includes(id));
    };

    // 즐겨찾기 추가/삭제 함수
    const toggleFavorite = () => {
        const favorites = Cookies.get('favorites');
        let favoriteList = favorites ? JSON.parse(favorites) : [];

        if (favoriteList.includes(id)) {
            // 즐겨찾기에 이미 있으면 삭제
            favoriteList = favoriteList.filter((favId: string) => favId !== id);
        } else {
            // 없으면 추가
            favoriteList.push(id);
        }

        Cookies.set('favorites', JSON.stringify(favoriteList), { expires: 365 }); // 쿠키에 1년간 저장
        setIsFavorite(!isFavorite); // 상태 업데이트
    };

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
