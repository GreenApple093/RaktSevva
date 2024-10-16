import React, { useState } from 'react';
import imgLogo from "../assets/rakt.png"; // Ensure the image path is correct
import { FaHeartbeat, FaDonate, FaTachometerAlt, FaClipboardList, FaRedo } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2'; // Import Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import BloodBankOverviewImg from "../assets/bloodBankOverview.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HospitalDashboard() {
    // Sample data for the Blood Usage chart
    const bloodUsageData = {
        labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], // Blood types
        datasets: [
            {
                label: 'Blood Bags Available',
                data: [15, 5, 10, 7, 20, 3, 8, 2], // Blood bag quantities
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Bar color
                borderColor: 'rgba(255, 99, 132, 1)', // Border color
                borderWidth: 1,
            },
        ],
    };
    const navigate = useNavigate();

    const handleLogOut = () => {
        navigate("/")
    }
    // State to manage inventory data (for refreshing)
    const [inventoryData, setInventoryData] = useState({
        APlus: 20,
        OMinus: 5,
        BPlus: 12,
        // Add more blood types as needed
    });

    // Function to refresh inventory data (dummy function for now)
    const refreshData = () => {
        // Logic to fetch new data goes here
        // For now, we'll just randomize the inventory for demonstration
        setInventoryData({
            APlus: Math.floor(Math.random() * 30),
            OMinus: Math.floor(Math.random() * 10),
            BPlus: Math.floor(Math.random() * 15),
            // Update other types similarly
        });
    };

    const [formData, setFormData] = useState({
        hospitalName: '',
        bloodType: 'A+',
        quantity: 0,
        urgency: 'Normal',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission, like sending data to the server
        try {
            const res = await axios.post('http://localhost:3000/api/users/hospital-requestblood', {
                hospital_name: formData.hospitalName,
                blood_type: formData.bloodType,
                quantity: formData.quantity,
                urgency: formData.urgency,
            })

            if(res.status === 200){
                alert("Request Submitted successfully!")
            }
        } catch (error) {
            console.log("Error in registering:", error);
            console.log(error.status);
        }
    };

    return (
        <>
            <div className='bg-red-100 w-full min-h-screen'>
                {/* Navbar */}
                <div className="bg-white w-full h-24 fixed top-0 z-10 shadow-xl shadow-red-300 bg-opacity-10 backdrop-blur-lg">
                    <div className="flex justify-between items-center h-full px-8">
                        {/* Logo */}
                        <div className="flex items-center h-full">
                            <img className="w-16 h-16" src={imgLogo} alt="Rakt Sevva Logo" />
                            <span className="text-red-600 font-bold text-2xl ml-4 border-l-red-500 border-l-4 pl-4 w-full">Hospital Dashboard</span>
                        </div>

                        {/* Navigation Links */}
                        <div className=' pl-72 w-full'>
                            <ul className="flex space-x-8 text-red-600 text-xl font-bold gap-5 w-full">
                                <li className="cursor-pointer hover:text-red-800 transition duration-200 flex items-center gap-2">
                                    <FaDonate /><a href="#request-blood">  Request Blood</a>
                                </li>
                                <li className="cursor-pointer hover:text-red-800 transition duration-200 flex items-center gap-2">
                                    <FaHeartbeat /><a href="#blood-usage">  Blood Usage</a>
                                </li>
                                <li className="cursor-pointer hover:text-red-800 transition duration-200 flex items-center gap-2">
                                    <FaTachometerAlt /><a href="#inventory-overview">  Inventory Overview</a>
                                </li>
                                <li className="cursor-pointer hover:text-red-800 transition duration-200 flex items-center gap-2 pr-7">
                                    <FaClipboardList /> <a href="#status"> Status</a>
                                </li>
                            </ul>

                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-lg font-semibold"
                            onClick={handleLogOut}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="mt-40 px-10 space-y-12">

                    {/* Request Blood Section */}
                    <section id="request-blood" className="p-8 rounded-lg shadow-lg flex gap-20 bg-red-50 shadow-red-400">
                        {/* Text Section */}
                        <div className='w-full pt-20 pr-10 pl-10'>
                            <h2 className="text-4xl font-bold text-red-600 mb-4">Need Blood Urgently?</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                If your hospital is running low on critical blood types, you can quickly submit a request using the form to the right. <br /><br />
                                This system ensures that your requests are handled with priority, providing real-time updates on the availability of blood types across nearby blood banks. <br /><br />
                                <span className="font-semibold">Important:</span> Please ensure you provide accurate information regarding the blood type and urgency level to expedite the process.
                            </p>
                            <p className="text-lg text-gray-700">
                                <span className="font-bold text-red-600">Fast and Reliable</span><br />
                                We understand how critical it is to have blood available in emergencies. Our system is designed to streamline this process, reducing the time between request and delivery.
                            </p>
                        </div>

                        {/* Request Form */}
                        <div className='bg-white rounded-2xl w-full p-10 shadow-lg shadow-red-400'>
                            <h2 className="text-4xl font-bold text-red-600 mb-6">Request Blood</h2>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="hospitalName">Hospital Name</label>
                                    <input
                                        type="text"
                                        id="hospitalName"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                        placeholder="Enter Hospital Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="bloodType">Blood Type</label>
                                    <select
                                        id="bloodType"
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">Quantity (Units)</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                        placeholder="Enter quantity"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="urgency">Urgency</label>
                                    <select
                                        id="urgency"
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">
                                    Submit Request
                                </button>
                            </form>

                        </div>
                    </section>

                    {/* Blood Usage Section */}
                    <section id="blood-usage" className="bg-red-50 p-8 rounded-lg shadow-lg flex gap-20 shadow-red-400">
                        {/* Chart Section */}
                        <div className='w-full pt-20 pr-10 pl-10 shadow-inner shadow-red-700 rounded-3xl bg-white'>
                            <h2 className="text-4xl font-bold text-red-600 mb-4 p-10">Monitor Blood Usage</h2>
                            <Bar className='shadow-inner'
                                data={bloodUsageData}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Blood Bags'
                                            }
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Blood Types'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        {/* Text Section */}
                        <div className='w-full pt-20 pr-10 pl-10'>
                            <h2 className="text-3xl font-bold text-red-600 mb-6">Blood Usage</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Maintaining an accurate record of blood usage is essential for efficient hospital resource management and patient care. This feature allows hospitals to track how much blood is being used during surgeries, emergencies, and transfusions.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                Whether it's a routine surgery or an emergency transfusion, having real-time insights into blood consumption ensures no time is wasted, and life-saving resources are readily accessible.
                            </p>
                        </div>
                    </section>

                    {/* Inventory Overview Section */}
                    <section id="inventory-overview" className="bg-red-50 p-8 rounded-lg shadow-lg flex gap-20 shadow-red-400">
                        <div className='w-full pt-20 pr-10 pl-10'>
                            <h2 className="text-4xl font-bold text-red-600 mb-4">Inventory Overview</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Here is an overview of the available blood types in the inventory.
                            </p>
                            <ul className="list-disc pl-5 text-lg text-gray-700">
                                <li>A+: {inventoryData.APlus} bags</li>
                                <li>O-: {inventoryData.OMinus} bags</li>
                                <li>B+: {inventoryData.BPlus} bags</li>
                                {/* Add other blood types as needed */}
                            </ul>
                            <button onClick={refreshData} className="mt-4 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">
                                Refresh Inventory
                            </button>
                        </div>
                        <div className='bg-white rounded-2xl w-full p-10 shadow-lg shadow-red-400'>
                            <img className="w-full h-72 rounded-lg" src={BloodBankOverviewImg} alt="Blood Bank Overview" />
                        </div>
                    </section>

                    {/* Status Section */}
                    <section id="status" className="bg-red-50 p-8 rounded-lg shadow-lg flex gap-20 shadow-red-400">
                        <div className='w-full pt-20 pr-10 pl-10'>
                            <h2 className="text-4xl font-bold text-red-600 mb-4">Status of Requests</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Below is the current status of blood requests made by the hospital.
                            </p>
                            <ul className="list-disc pl-5 text-lg text-gray-700">
                                <li>Pending: 3 requests</li>
                                <li>Accepted: 5 requests</li>
                                <li>Rejected: 1 request</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="bg-white w-full p-5 text-center shadow-md mt-12">
                    <p className="text-gray-700">
                        © 2024 Rakt Sevva. All rights reserved. | Designed by GreenApple
                    </p>
                </footer>
            </div>
        </>
    );
}

export default HospitalDashboard;
