import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchChannel } from '../services/api';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Search: React.FC = () => {
    const query = useQuery().get('query') || '';
    const [channels, setChannels] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(query);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChannels = async () => {
            if (query) {
                const data = await searchChannel(query);
                const validChannels = data.filter(
                    (channel: any) => channel?.snippet?.thumbnails?.medium
                );
                setChannels(validChannels);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {channels.map((channel) => {
                        const thumbnailUrl = channel.snippet?.thumbnails?.medium?.url || 'default-thumbnail.jpg';
                        const title = channel.snippet?.title || '제목 없음';
                        const description = channel.snippet?.description?.slice(0, 80) || '설명 없음';

                        return (
                            <div
                                key={channel.id.channelId}
                                className="card cursor-pointer transition hover:shadow-lg bg-gray-800 text-white"
                                onClick={() => handleChannelClick(channel.id.channelId)}
                            >
                                <img
                                    src={thumbnailUrl}
                                    alt={title}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                                <p className="text-gray-400 text-sm">{description}...</p>
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
