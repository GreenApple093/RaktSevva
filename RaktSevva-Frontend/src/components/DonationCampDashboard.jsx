import React from 'react';
import { useState } from 'react';

function DonationCampDashboard() {
    const [campData, setCampData] = useState({
        campName: 'City Blood Donation Drive',
        location: 'Downtown Community Center',
        date: '12/05/2024',
        donorCount: 57,
        bagsCollected: 120,
    });

    const recentActivities = [
        'Donor Registration - John Doe',
        'Blood Collected - 2 Bags (O+)',
        'Camp Check-In - Sarah Lee',
        'Supplies Restocked',
    ];

    return (
        <div className="bg-white rounded-2xl p-10 shadow-lg shadow-red-400 w-full">
            <h1 className="text-4xl font-bold text-red-600 mb-6">Donation Camp Dashboard</h1>

            {/* Camp Overview */}
            <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Camp Overview</h2>
                <p className="text-gray-600">Location: {campData.location}</p>
                <p className="text-gray-600">Date: {campData.date}</p>
                <p className="text-gray-600">Total Donors: {campData.donorCount}</p>
                <p className="text-gray-600">Bags Collected: {campData.bagsCollected}</p>
            </div>

            {/* Activity Feed */}
            <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Recent Activity</h2>
                <ul className="mt-4 space-y-2">
                    {recentActivities.map((activity, index) => (
                        <li key={index} className="text-gray-600">{activity}</li>
                    ))}
                </ul>
            </div>

            {/* Donor Statistics */}
            <div className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-700">Donor Statistics</h2>
                <p className="text-gray-600 mt-4">Total Donors: {campData.donorCount}</p>
                <p className="text-gray-600">Blood Bags Collected: {campData.bagsCollected}</p>
            </div>
        </div>
    );
}

export default DonationCampDashboard;
