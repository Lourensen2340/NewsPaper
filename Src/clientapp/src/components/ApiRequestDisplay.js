import React, { useState } from 'react';
import { generateCurlCommand } from '../utils/curlGenerator';

const ApiRequestDisplay = ({ newsData, imageFile }) => {
    const [activeTab, setActiveTab] = useState('curl');

    const jsonData = JSON.stringify(newsData, null, 2);
    const curlCommand = generateCurlCommand(newsData, imageFile);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-2">API Request Preview</h3>

            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveTab('curl')}
                    className={`px-3 py-1 rounded ${activeTab === 'curl' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                        }`}
                >
                    cURL
                </button>
                <button
                    onClick={() => setActiveTab('json')}
                    className={`px-3 py-1 rounded ${activeTab === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                        }`}
                >
                    JSON
                </button>
                <button
                    onClick={() => setActiveTab('swagger')}
                    className={`px-3 py-1 rounded ${activeTab === 'swagger' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                        }`}
                >
                    Swagger
                </button>
            </div>

            {activeTab === 'curl' && (
                <div>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
                        {curlCommand}
                    </pre>
                    <button
                        onClick={() => copyToClipboard(curlCommand)}
                        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Copy cURL
                    </button>
                </div>
            )}

            {activeTab === 'json' && (
                <div>
                    <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                        {jsonData}
                    </pre>
                    <button
                        onClick={() => copyToClipboard(jsonData)}
                        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Copy JSON
                    </button>
                </div>
            )}

            {activeTab === 'swagger' && (
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        Open Swagger UI and use the JSON below:
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                        <p className="text-sm">
                            <strong>URL:</strong> https://localhost:7113/api/scraper/upload-news
                        </p>
                        <p className="text-sm">
                            <strong>Method:</strong> POST
                        </p>
                        <p className="text-sm">
                            <strong>Headers:</strong> Content-Type: application/json
                        </p>
                        <button
                            onClick={() => window.open('https://localhost:7113/swagger', '_blank')}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                            Open Swagger UI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiRequestDisplay;