import React, { useEffect, useState } from 'react';
import { getChannelDetails } from '../services/api';

const Favorites: React.FC = () => {
    const [favorites, setFavorites] = useState<any[]>([]);

    const getCachedChannel = (id: string) => {
        const cachedData = localStorage.getItem(`channel_${id}`);
        return cachedData ? JSON.parse(cachedData) : null;
    };

    const cacheChannel = (id: string, data: any) => {
        localStorage.setItem(`channel_${id}`, JSON.stringify(data));
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) {
                const favoriteIds = JSON.parse(savedFavorites);
                const favoriteChannels = await Promise.all(
                    favoriteIds.map(async (id: string) => {
                        const cachedChannel = getCachedChannel(id);
                        if (cachedChannel) {
                            return cachedChannel;
                        } else {
                            const channelData = await getChannelDetails(id);
                            cacheChannel(id, channelData);
                            return channelData;
                        }
                    })
                );
                setFavorites(favoriteChannels);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 p-6">
            <h2 className="text-3xl font-bold text-white mb-8">즐겨찾기 목록</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                    favorites.map((channel) => (
                        <div key={channel.id} className="card bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-white">{channel.snippet.title}</h3>
                            <p className="text-gray-300">{channel.snippet.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">즐겨찾기한 채널이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;
