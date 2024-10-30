import React, { useState, useEffect } from "react";
import { FaChartLine, FaCampground, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import imgLogo from "../assets/rakt.png";

const DonationCampDashboard = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [donorData, setDonorData] = useState({
        labels: ['Male', 'Female', 'Others'],
        datasets: [
            {
                label: 'Donor Demographics',
                data: [0, 0, 0], // Initialize with zeros
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    });
    const [events, setEvents] = useState([]);

    const fetchDonorData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users/camp-getDonorData");
            const fetchedData = res.data;

            const genderCount = { Male: 0, Female: 0, Others: 0 };
            fetchedData.forEach((donor) => {
                genderCount[donor.gender] += 1;
            });

            setDonorData({
                labels: Object.keys(genderCount),
                datasets: [
                    {
                        label: 'Donor Demographics',
                        data: Object.values(genderCount),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (err) {
            console.error("Error fetching donor data: ", err);
        }
    };

    const fetchCampEvents = async () => {
        try {
            const result = await axios.get('http://localhost:3000/api/users/camp-getEvents');
            setEvents(result.data);
        } catch (error) {
            console.error("Error fetching camp events:", error);
        }
    };

    useEffect(() => {
        fetchDonorData();
        fetchCampEvents();
    }, []);

    const clearNotifications = () => {
        setNotifications([]);
    };

    const handleLogOut = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col max-h-screen min-h-screen bg-red-100">
            <header className="p-4 bg-white flex items-center justify-between fixed w-full shadow-xl shadow-red-300 bg-opacity-10 backdrop-blur-lg">
                <div className="flex items-center">
                    <img className="h-12" src={imgLogo} alt="Rakt Sevva Logo" />
                    <h1 className="text-2xl font-bold text-red-600 mx-4 border-l-4 border-l-red-500 pl-3">Donation Camp Dashboard</h1>
                </div>
                <div className=" w-7/12 h-10 flex-col text-center justify-center pt-1">
                    <ul className="flex gap-12 justify-end pl-28 text-2xl font-bold text-red-600 text-center">
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaChartLine /></i>
                            <span>Insights</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaCampground /></i>
                            <span>Events</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaBell /></i>
                            <span>Notifications</span>
                        </li>
                    </ul>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleLogOut}>
                    Logout
                </button>
            </header>

            <div className="flex-grow p-8 flex flex-col md:flex-row md:justify-between mt-20">
                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2">
                    <Bar className="shadow-inner"
                        data={donorData}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { display: true, text: 'Number of Donors' },
                                },
                                x: { title: { display: true, text: 'Gender' } },
                            },
                        }}
                    />
                    <button onClick={fetchDonorData} className="mt-4 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 flex justify-center">
                        Refresh Donor Data
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 md:ml-6 mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-red-600 mb-4 text-center">Insights</h2>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        Keeping track of donation demographics allows us to gauge engagement across various groups.
                        This data can help in planning future events and campaigns, ensuring a well-rounded donor base.
                    </p>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        By organizing frequent camps in underrepresented areas, we can also increase outreach and diversify
                        the donor community effectively.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">Upcoming Events</h2>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="py-2">Event Name</th>
                            <th className="py-2">Date</th>
                            <th className="py-2">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2">{event.name}</td>
                                <td className="py-2">{event.date}</td>
                                <td className="py-2">{event.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">Notifications</h2>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li key={`notification-${index}`} className="border-b py-2 text-red-700">
                                {notification}
                            </li>
                        ))
                    ) : (
                        <li className="py-2 text-green-700">No Notifications</li>
                    )}
                </ul>
                <button
                    onClick={clearNotifications}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    Clear Notifications
                </button>
            </div>

            <footer className="bg-white w-full p-5 text-center shadow-md mt-12">
                <p className="text-gray-700">
                    © 2024 Rakt Sevva. All rights reserved. | Designed by GreenApple
                </p>
            </footer>
        </div>
    );
};

export default DonationCampDashboard;
