import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchChannel } from '../services/api';
import styles from '../styles/Search.module.css'; // CSS 모듈 임포트

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Search: React.FC = () => {
    const query = useQuery().get('query') || '';
    const [channels, setChannels] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(query);
    const navigate = useNavigate();

    // 캐시된 검색 결과 가져오기
    const getCachedSearchResults = (query: string) => {
        const cachedData = localStorage.getItem(`search_${query}`);
        return cachedData ? JSON.parse(cachedData) : null;
    };

    // 검색 결과를 캐시에 저장
    const cacheSearchResults = (query: string, data: any) => {
        localStorage.setItem(`search_${query}`, JSON.stringify(data));
    };

    useEffect(() => {
        const fetchChannels = async () => {
            if (query) {
                const cachedResults = getCachedSearchResults(query);
                if (cachedResults) {
                    setChannels(cachedResults);
                } else {
                    const data = await searchChannel(query);
                    const validChannels = data.filter(
                        (channel: any) => channel?.snippet?.thumbnails?.medium
                    );
                    setChannels(validChannels);
                    cacheSearchResults(query, validChannels);
                }
            }
        };
        fetchChannels();
    }, [query]);

    const handleChannelClick = (channelId: string) => {
        navigate(`/channel/${channelId}`);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${searchInput}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">검색 결과</h2>
            {channels.length > 0 ? (
                <div className={styles['grid-cols-5']}>
                    {channels.map((channel) => {
                        const thumbnailUrl = channel.snippet?.thumbnails?.medium?.url || 'default-thumbnail.jpg';
                        const title = channel.snippet?.title || '제목 없음';
                        const description = channel.snippet?.description?.slice(0, 80) || '설명 없음';

                        return (
                            <div
                                key={channel.id.channelId}
                                className={styles.card}
                                onClick={() => handleChannelClick(channel.id.channelId)}
                            >
                                <img
                                    src={thumbnailUrl}
                                    alt={title}
                                    className={styles['card-img']}
                                />
                                <h3>{title}</h3>
                                <p>{description}...</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-white">검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default Search;
