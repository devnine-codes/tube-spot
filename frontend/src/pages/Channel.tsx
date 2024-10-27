import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetails, getChannelVideos } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import styles from '../styles/Channel.module.css';

const Channel: React.FC = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showMore, setShowMore] = useState(false); // 더보기 모달 상태

    const CACHE_EXPIRATION = 3 * 60 * 60 * 1000; // 캐시 만료 시간: 3시간

    // 특정 키의 캐시된 데이터를 가져오고, 만료되었을 경우 null 반환
    const getCachedData = (key: string) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const parsedData = JSON.parse(cached);
        if (Date.now() - parsedData.timestamp > CACHE_EXPIRATION) {
            localStorage.removeItem(key); // 만료된 데이터 삭제
            return null;
        }
        return parsedData.data; // 만료되지 않았을 경우 데이터 반환
    };

    // 캐시 데이터 저장 함수
    const cacheData = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    };

    // 채널 및 비디오 데이터 가져오기
    const fetchChannelData = async () => {
        if (!id) return;

        let channelData = getCachedData(`channel_${id}`);
        if (!channelData) {
            try {
                channelData = await getChannelDetails(id);
                cacheData(`channel_${id}`, channelData); // 새 데이터 캐시에 저장
            } catch (error) {
                console.error('Error fetching channel:', error);
            }
        }
        setChannel(channelData);

        let videoData = getCachedData(`videos_${id}`);
        if (!videoData) {
            try {
                const playlistId = channelData.contentDetails.relatedPlaylists.uploads;
                videoData = await getChannelVideos(playlistId);
                cacheData(`videos_${id}`, videoData); // 새 데이터 캐시에 저장
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        }
        setVideos(videoData);
    };

    // 즐겨찾기 상태 토글
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = isFavorite
            ? favorites.filter((favId: string) => favId !== id)
            : [...favorites, id];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(!isFavorite);
    };

    // 초기 로드 시 데이터 및 즐겨찾기 상태 확인
    useEffect(() => {
        fetchChannelData();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
            <div className="w-full mx-auto p-6">
                {channel && (
                    <div className={styles['channel-details']}>
                        <img src={channel.snippet.thumbnails.high.url} alt={channel.snippet.title} />
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {channel.snippet.title}
                                <button
                                    onClick={toggleFavorite}
                                    className={`ml-4 px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                                >
                                    {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                                </button>
                            </h2>
                            <p className={`${styles['description']} ${showMore ? styles['expanded'] : ''}`}>
                                {channel.snippet.description}
                            </p>
                            {channel.snippet.description.length > 100 && (
                                <span
                                    className={styles['more-button']}
                                    onClick={() => setShowMore(!showMore)}
                                >
                                    {showMore ? '접기' : '더보기'}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {selectedVideoId && (
                    <div className="mt-8">
                        <VideoPlayer videoId={selectedVideoId} />
                    </div>
                )}

                <h3 className="text-2xl font-bold mt-8 text-white">업로드된 영상</h3>
                <div className={styles['video-grid']}>
                    {videos.map((video) => (
                        <div
                            key={video.snippet.resourceId.videoId}
                            className={styles.card}
                            onClick={() => setSelectedVideoId(video.snippet.resourceId.videoId)}
                        >
                            <img
                                src={video.snippet.thumbnails.medium.url}
                                alt={video.snippet.title}
                                className="w-full h-40 object-cover"
                            />
                            <h4 className="mt-2 text-lg font-semibold text-white">{video.snippet.title}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* 더보기 모달 */}
            {showMore && (
                <div>
                    <div className={styles['modal-overlay']} onClick={() => setShowMore(false)}></div>
                    <div className={styles.modal}>
                        <h2>{channel.snippet.title} - 설명</h2>
                        <p>{channel.snippet.description}</p>
                        <button onClick={() => setShowMore(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Channel;
