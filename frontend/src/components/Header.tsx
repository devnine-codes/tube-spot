import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query) {
            navigate(`/search?query=${query}`);
        }
    };

    const goHome = () => {
        navigate('/');
    };

    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
            <h1 onClick={goHome} className="text-3xl font-bold cursor-pointer hover:text-blue-500 transition-colors duration-300">
                TubeSpot
            </h1>
            <div className="flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="채널 검색"
                    className="p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 bg-blue-500 p-2 rounded text-white hover:bg-blue-600 transition-colors duration-300"
                >
                    검색
                </button>
            </div>
        </header>
    );
};

export default Header;
