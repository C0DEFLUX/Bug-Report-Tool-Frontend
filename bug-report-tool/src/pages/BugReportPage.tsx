import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

// Type for a bug
type Bug = {
    id: number;
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    reporterEmail: string;
    dateCreated: string;
};


const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "HIGH":
            return "text-red-600";
        case "MEDIUM":
            return "text-yellow-600";
        case "LOW":
            return "text-green-600";
        default:
            return "text-gray-500";
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "OPEN":
            return "bg-red-100 text-red-800";
        case "IN_PROGRESS":
            return "bg-yellow-100 text-yellow-800";
        case "CLOSED":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-600";
    }
};


const BugReportPage: React.FC = () => {

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState<Bug[]>([]);


    const fetchData = () => {
        axios.get(`${API_URL}/bugs`)
            .then(response => {
                setData(response.data)
            })
            .catch(errors => {
                console.log(errors)
            })
    }

    useEffect(()=>{
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                    <button className="cursor-pointer hover:underline" onClick={() => navigate("/")}>← Back</button>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        🐞 Reported Bugs
                    </h1>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-500 text-center">No bugs reported yet.</p>
                ) : (
                    data.map((bug) => (
                        <div
                            key={bug.id}
                            className="bg-white shadow-md rounded-xl p-4 mb-4 transition hover:shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {bug.title}
                                </h2>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                        bug.status
                                    )}`}
                                >
                  {bug.status}
                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{bug.description}</p>

                            <div className="flex flex-wrap justify-between text-sm text-gray-500 mt-2">
                                <div>
                                    <span className="font-medium text-gray-700">Priority: </span>
                                    <span className={`${getPriorityColor(bug.priority)} font-semibold`}>
                    {bug.priority}
                  </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Reporter: </span>
                                    {bug.reporterEmail}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Date: </span>
                                    {bug.dateCreated}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BugReportPage;
