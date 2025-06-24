import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Filler, Title, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { getPlayerRatingHistory } from '../utils/PlayerAPIHandler';

export default function RatingHistoryGraph({ playerId }) {
    const [ratingHistory, setRatingHistory] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Rating History',
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMMM dd, yyyy',
                    displayFormats: {
                        day: 'MMM dd',
                    },
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Rating',
                },
            },
        },
    };

    ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Title, TimeScale, Tooltip, Legend);

    useEffect(() => {
        const fetchRatingHistory = async () => {
            try {
                let response;
                if (playerId === undefined) {
                    response = await getPlayerRatingHistory();
                } else {
                    response = await getPlayerRatingHistory(playerId);
                }
                setRatingHistory(response.ratingHistory.previousRatings);
                console.log("Rating History", response.ratingHistory.previousRatings);
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
    }, [playerId]);

    return (
        loading === true ? (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                <h2 className="text-2xl">Loading...</h2>
            </div>
        ) : (
            <div className="bg-[#00245C] text-white p-4 rounded-lg flex flex-col">
                {ratingHistory.length > 0 ? (
                    <Line data={chartData} options={chartOptions}/>
                ) : (
                    <p>No rating history found.</p>
                )}
            </div>
    ))
}