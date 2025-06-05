import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

interface ApiErrors {
    [key: string]: string[];
}



const AddBugReportPage: React.FC = () => {
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [priority, setPriority] = useState<string>("");
    const [reporterEmail, setReporterEmail] = useState<string>("");
    const [errors, setErrors] = useState<ApiErrors>({})

    const handleSubmit = async() =>
    {
        let payLoad = {
            "title": title,
            "description": description,
            "priority": priority || "LOW",
            "status": "OPEN",
            "reporterEmail": reporterEmail,
        }

        await axios.post(`${API_URL}/add-bug`, payLoad)
            .then(response =>
            {
                if(response.status === 201)
                {
                    setTitle("");
                    setDescription("");
                    setPriority("");
                    setReporterEmail("");

                }
            }).catch(error => {
               setErrors(error.response.data.errors);
            })

    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <button className="cursor-pointer hover:underline" onClick={() => navigate("/")}>← Back</button>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        🐝 Report a New Bug
                    </h1>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Issue title"
                        />
                        <span className="text-xs text-red-500">{errors.title}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={e=>setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the issue in detail..."
                        />
                        <span className="text-xs text-red-500">{errors.description}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Email
                        </label>
                        <input
                            type="email"
                            name="reporterEmail"
                            value={reporterEmail}
                            onChange={e=>setReporterEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. user@example.com"
                        />
                        <span className="text-xs text-red-500">{errors.reporterEmail}</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl transition"
                    >
                        Submit Bug Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBugReportPage;
