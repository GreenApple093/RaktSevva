import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import imgLogo from "../assets/rakt.png"; // Ensure the image path is correct
import { FaChartLine, FaHospital, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BloodBankDashboard = () => {


    const [notifications, setNotifications] = useState([]); // Notifications for stock alerts

    const chartRef = useRef(null); // Reference for the chart instance
    const canvasRef = useRef(null); // Reference for the canvas element

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        // Destroy chart if it already exists to avoid duplication
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create new chart
        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
                datasets: [
                    {
                        label: "Blood Units Available",
                        data: [50, 20, 45, 10, 30, 15, 40, 25], // Example data
                        backgroundColor: [
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)",
                            "rgba(255, 0, 0, 1)"
                        ],
                        borderColor: "rgba(255, 255, 255, 1)",
                        borderWidth: 3,
                    }
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#121212", // Customize legend color
                        },
                    },
                },
            },
        });

        // Cleanup on unmount or re-render
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleStatusChange =  (request_id, newStatus) => {
        try {
            // Update the status on the server (if necessary)
             axios.put(`http://localhost:3000/api/users/bloodbank-updateStatus`, { request_id, newStatus });
            
            // Update the request state after a successful status change
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.request_id === request_id ? { ...req, status: newStatus } : req
                )
            );
    
            // Find the specific request that is being updated to notify
            const updatedRequest = requests.find((req) => req.request_id === request_id);
    
            if (updatedRequest) {
                // Safely add a new notification with the updated request details
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    `${updatedRequest.hospital_name}'s request for ${updatedRequest.blood_type} blood was ${newStatus}.`,
                ]);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };



    const getStatusCircle = (status) => {
        switch (status) {
            case "accepted":
                return <span className="h-4 w-4 bg-green-500 rounded-full inline-block"></span>;
            case "pending":
                return <span className="h-4 w-4 bg-yellow-500 rounded-full inline-block"></span>;
            case "rejected":
                return <span className="h-4 w-4 bg-red-500 rounded-full inline-block"></span>;
            default:
                return null;
        }
    };

    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleLogOut = () => {
        // Add any logout logic here, e.g., clearing user session or tokens
        navigate("/");  // Redirect to the landing page or login
    };



    const clearNotifications = () => {
        setNotifications([]);
    };

    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const fetchHospitalRequests = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/users/hospital-getHospitalRequest');
                console.log(result);
                const fetchedData = result.data

                setRequests(fetchedData)

            } catch (error) {
                console.error("Error fetching hospital inventory updates:", error);
            }
        }

        // Call the fetch function
        fetchHospitalRequests();

    }, []); // Empty dependency array ensures the effect runs only once, after the component mounts




    return (
        <div className="flex flex-col max-h-screen min-h-screen bg-red-100">
            <header className="p-4 bg-white flex items-center justify-between fixed w-full shadow-xl shadow-red-300 bg-opacity-10 backdrop-blur-lg">
                <div className="flex items-center">
                    <img className="h-12" src={imgLogo} alt="Rakt Sevva Logo" />
                    <h1 className="text-2xl font-bold text-red-600 mx-4 border-l-4 border-l-red-500 pl-3">BloodBank Dashboard</h1>
                </div>
                <div className=" w-7/12 h-10 flex-col text-center justify-center pt-1">
                    <ul className="flex gap-12 justify-end pl-28 text-2xl font-bold text-red-600 text-ce">
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaChartLine />
                            </i>
                            <span>Insights</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaHospital />
                            </i>
                            <span>Requests</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaBell />
                            </i>
                            <span>Notifications</span>
                        </li>
                    </ul>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleLogOut}>
                    Logout
                </button>
            </header>

            {/* Main Dashboard Content */}
            <div className="flex-grow p-8 flex flex-col md:flex-row md:justify-between mt-20">

                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2">
                    <canvas id="bloodStockChart" ref={canvasRef} width="400" height="300"></canvas>
                </div>

                {/* Insights Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 md:ml-6 mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-red-600 mb-4 text-center ">Insights</h2>
                    <p className="text-black-700  text-lg font-semibold p-5">
                        The availability of blood units is crucial for ensuring that hospitals can adequately meet patient needs.
                        As we analyze the current stock, we observe that the most abundant blood type is A+, while O- is relatively low in supply.
                    </p>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        Monitoring blood stocks regularly helps in planning donation drives, ensuring that we maintain a healthy supply
                        of all blood types, especially the rare ones.
                    </p>
                    <p className="text-black-700  text-lg font-semibold p-5">
                        It is essential for blood banks to coordinate with hospitals effectively, especially when requests come in for
                        specific blood types. The status of each request must be updated promptly to avoid shortages.
                    </p>
                </div>
            </div>

            {/* Hospital Requests Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">Hospital Requests</h2>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="py-2">Hospital</th>
                            <th className="py-2">Blood Type</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Urgency</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.request_id} className="border-t">
                                
                                <td className="py-2">{request.hospital_name}</td>
                                <td className="py-2">{request.blood_type}</td>
                                <td className="py-2">{request.quantity}</td>
                                <td className="py-2">{request.urgency}</td>
                                <td className="py-2">{getStatusCircle(request.status) || getStatusCircle("pending")}</td> {/* Use dynamic status */}
                                <td className="py-2 space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "accepted")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "pending")}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "rejected")}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>






            {/* Notifications Panel */}
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
            {/* Footer */}
            <footer className="bg-white w-full p-5 text-center shadow-md mt-12">
                <p className="text-gray-700">
                    © 2024 Rakt Sevva. All rights reserved. | Designed by GreenApple
                </p>
            </footer>
        </div>
    );
};

export default BloodBankDashboard;
