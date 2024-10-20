import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

const Category: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("카테고리 데이터를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-4xl font-bold mb-6">카테고리</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold">{category.snippet?.title || '제목 없음'}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
