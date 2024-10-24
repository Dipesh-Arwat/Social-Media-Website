import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (query.trim() === '') return;

        try {
            const res = await axios.get(`/search?username=${query}`);
            if (res.data.length === 0) {
                setNoResults(true);
                setResults([]);
            } else {
                setResults(res.data);
                setNoResults(false);

                // Update search history if a valid result is found
                const newHistory = [...searchHistory, { username: query, profileImage: res.data[0]?.profileImage, userId: res.data[0]?._id }];
                setSearchHistory(newHistory);
                localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteHistory = (indexToDelete) => {
        const updatedHistory = searchHistory.filter((_, index) => index !== indexToDelete);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    const handleClearAllHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const handleUserClick = (userId) => {
        navigate(`/user-profile/${userId}`);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users"
                />
                <button className='btn-serach' type="submit">Search</button>
            </form>

            {/* Search History */}
            <div className="search-history">
                <div className="history-header">
                    <h3>Recent</h3>
                    {searchHistory.length > 0 && (
                        <button onClick={handleClearAllHistory} className="clear-all">Clear All</button>
                    )}
                </div>
                {searchHistory.length === 0 ? (
                    <p>No recent searches.</p>
                ) : (
                    <ul>
                        {searchHistory.map((item, index) => (
                            <li key={index} className="history-item">
                                <div className="history-info" onClick={() => handleUserClick(item.userId)}>
                                    <img src={item.profileImage} alt="profile"  />
                                    <p>{item.username}</p>
                                </div>
                                <button onClick={() => handleDeleteHistory(index)} className="delete-history">×</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Search Results */}
            <div className="search-results">
                {noResults ? (
                    <p>No results found.</p>
                ) : (
                    results.map((user) => (
                        <div key={user._id} className="search-result-item" onClick={() => handleUserClick(user._id)}>
                            <img src={user.profileImage} alt="profile" />
                            <p>{user.username}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;
