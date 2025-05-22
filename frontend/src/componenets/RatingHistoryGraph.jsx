import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { getPlayerRatingHistory } from '../utils/PlayerAPIHandler';

export default function RatingHistoryGraph() {
    const [ratingHistory, setRatingHistory] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

    useEffect(() => {
        const fetchRatingHistory = async () => {
            try {
                const response = await getPlayerRatingHistory();
                setRatingHistory(response.previousRatings);
                const ratingHistoryData = {
                    labels: response.ratingHistory.previousRatings.map((item) => item.date),
                    datasets: [
                        {
                            label: 'Rating History',
                            data: response.ratingHistory.previousRatings.map((item) => item.rating),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                            tension: 0.1,
                        }
                    ]
                };
                setChartData(ratingHistoryData);
            } catch (error) {
                console.error("Error fetching rating history:", error);
                setRatingHistory([]);
                setLoading(true);
            } finally {
                setLoading(false);
            }
        }
        fetchRatingHistory();
    }, []);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Rating History</h2>
                {ratingHistory.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>No rating history found.</p>
                )}
            </div>
    ))
}