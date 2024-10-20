import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getCategories, getChannelDetails } from '../services/api';

const Home: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);  // 카테고리 목록 상태
    const [favorites, setFavorites] = useState<any[]>([]);    // 즐겨찾기 상태
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);  // 즐겨찾기 펼침/접힘 상태

    // 카테고리 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('카테고리 데이터를 불러오는 데 실패했습니다.', error);
            }
        };
        fetchCategories();
    }, []);

    // 즐겨찾기 불러오기
    useEffect(() => {
        const fetchFavorites = async () => {
            const savedFavorites = Cookies.get('favorites');
            if (savedFavorites) {
                const favoriteIds = JSON.parse(savedFavorites);
                const favoriteChannels = await Promise.all(
                    favoriteIds.map((id: string) => getChannelDetails(id))
                );
                setFavorites(favoriteChannels);
            }
        };
        fetchFavorites();
    }, []);

    // 즐겨찾기 펼치기/접기 핸들러
    const toggleFavorites = () => {
        setIsFavoritesOpen(!isFavoritesOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex flex-col">
            <div className="container mx-auto p-6">

                {/* 즐겨찾기 섹션 */}
                <div className="favorites-section mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-white">즐겨찾기한 채널</h2>
                        <button
                            onClick={toggleFavorites}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            {isFavoritesOpen ? '접기' : '펼치기'}
                        </button>
                    </div>
                    {isFavoritesOpen && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites.length > 0 ? (
                                favorites.map((channel) => (
                                    <div key={channel.id} className="card bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                                        <img
                                            src={channel.snippet.thumbnails.medium.url}
                                            alt={channel.snippet.title}
                                            className="w-full h-40 object-cover rounded-md"
                                        />
                                        <h3 className="mt-2 text-lg font-semibold text-white">{channel.snippet.title}</h3>
                                        <p className="text-gray-400 text-sm">{channel.snippet.description.slice(0, 80)}...</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">즐겨찾기한 채널이 없습니다.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 카테고리 섹션 */}
                <h1 className="text-4xl font-bold text-center text-white mb-8">카테고리 목록</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                            >
                                <h2 className="text-lg font-semibold text-white">{category.snippet.title}</h2>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">카테고리 데이터가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
