import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

// Type for a bug
type Bug = {
    id: number;
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN PROGRESS" | "CLOSED";
    reporterEmail: string;
    dateCreated: string;
};

interface ApiErrors {
    [key: string]: string[];
}



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
        case "IN PROGRESS":
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
    const [editingBugId, setEditingBugId] = useState<number | null>(null);
    const [editedBug, setEditedBug] = useState<Partial<Bug>>({});
    const [errors, setErrors] = useState<ApiErrors>({});

    const fetchData = () => {
        axios.get(`${API_URL}/bugs`)
            .then(response => setData(response.data))
            .catch(console.log);
    };

    useEffect(() => { fetchData(); }, []);

    const handleEditClick = (bug: Bug) => {
        setEditingBugId(bug.id);
        setEditedBug({ ...bug });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedBug(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (id:number) =>
    {
        await axios.put(`${API_URL}/update-bug/${id}`, editedBug)
            .then(response => {
                console.log(response.data);
                setEditingBugId(null);
                setEditedBug({});
                fetchData();
            })
            .catch(error => {
                setErrors(error.response.data.errors);
            })
    };

    const handleDelete = async (id: number) =>
    {
        await axios.delete(`${API_URL}/delete-bug/${id}`)
            .then(response => {
            console.log(response);
            fetchData();
            })
            .catch(error => {
            console.log(error);
            })
    };

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
                    data.map((bug) => {
                        const isEditing = editingBugId === bug.id;

                        return (
                            <div
                                key={bug.id}
                                className="bg-white shadow-md rounded-xl p-4 mb-4 transition hover:shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    {isEditing ? (
                                        <div className="flex flex-col">
                                            <input
                                                type="text"
                                                name="title"
                                                value={editedBug.title}
                                                onChange={handleInputChange}
                                                className="text-xl font-bold text-gray-800 w-full border px-2 py-1 rounded"
                                            />
                                            {errors.title && <span className="text-xs text-red-500 mt-1">{errors.title}</span>}
                                        </div>
                                    ) : (
                                        <h2 className="text-xl font-bold text-gray-800">{bug.title}</h2>
                                    )}

                                    <div className="flex items-center">
                                        {isEditing ? (
                                            <>
                                                <span onClick={()=>handleSave(bug.id)} className="cursor-pointer ml-2 px-2 py-1 rounded-full bg-green-100">
                                                    <svg className="h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                </span>
                                                <span onClick={() => handleDelete(bug.id)} className="cursor-pointer ml-2 px-2 py-1 rounded-full bg-red-100">
                                                    <svg className="h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                </span>
                                            </>
                                        ) : (
                                            <span onClick={() => handleEditClick(bug)} className="cursor-pointer ml-2 px-2 py-1 rounded-full bg-blue-100">
                                                <svg className="h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="flex flex-col">
                                        <textarea
                                            name="description"
                                            value={editedBug.description}
                                            onChange={handleInputChange}
                                            className="text-sm text-gray-600 mb-2 w-full border rounded px-2 py-1"
                                        />
                                        {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description}</span>}
                                    </div>

                                    ) : (
                                    <p className="text-sm text-gray-600 mb-2">{bug.description}</p>
                                )}

                                <div className="flex flex-wrap justify-between text-sm text-gray-500 mt-2">
                                    <div>
                                        <span className="font-medium text-gray-700">Priority: </span>
                                        {isEditing ? (
                                            <select
                                                name="priority"
                                                value={editedBug.priority}
                                                onChange={handleInputChange}
                                                className="ml-1 border px-2 py-1 rounded"
                                            >
                                                <option value="LOW">LOW</option>
                                                <option value="MEDIUM">MEDIUM</option>
                                                <option value="HIGH">HIGH</option>
                                            </select>
                                        ) : (
                                            <span className={`${getPriorityColor(bug.priority)} font-semibold`}>
                                                {bug.priority}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-center items-center">
                                        <div className="flex flex-row items-center">
                                        <span className="font-medium text-gray-700">Reporter: </span>
                                        {isEditing ? (
                                            <div className="flex flex-col">
                                                <input
                                                    type="email"
                                                    name="reporterEmail"
                                                    value={editedBug.reporterEmail}
                                                    onChange={handleInputChange}
                                                    className="ml-1 border px-2 py-1 rounded"
                                                />
                                            </div>
                                            ) : (
                                            bug.reporterEmail
                                        )}
                                        </div>
                                        {isEditing && errors.reporterEmail && <span className="text-xs text-red-500 mt-1 self-start">{errors.reporterEmail}</span>}
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700">Status: </span>
                                        {isEditing ? (
                                            <select
                                                name="status"
                                                value={editedBug.status}
                                                onChange={handleInputChange}
                                                className="ml-1 border px-2 py-1 rounded"
                                            >
                                                <option value="OPEN">OPEN</option>
                                                <option value="IN PROGRESS">IN PROGRESS</option>
                                                <option value="CLOSED">CLOSED</option>
                                            </select>
                                        ) : (
                                            <span className={`${getStatusColor(bug.status)} px-2 py-1 rounded-full`}>
                                                {bug.status}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700">Date: </span>
                                        {bug.dateCreated}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BugReportPage;
