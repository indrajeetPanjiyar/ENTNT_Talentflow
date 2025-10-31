import React, { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';


const CandidatesList = ({ candidates, navigate }) => {
    
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const paginatedCandidates = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return candidates.slice(start, end);
    }, [candidates, page, pageSize]);

    const totalPages = Math.ceil(candidates.length / pageSize);

    return (
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applied</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 max-h-[500px] overflow-y-auto">
                    {paginatedCandidates.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => navigate('candidates/:id', c.id)}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{c.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{c.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${c.stage === 'hired' ? 'bg-green-600/20 text-green-400' : 'bg-indigo-600/20 text-indigo-400'}`}>
                                    {c.stage}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(c.appliedDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <ExternalLink className="w-4 h-4 text-indigo-400 inline-block" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t border-gray-700 bg-gray-700/50">
                <span className="text-sm text-gray-400">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, candidates.length)} of {candidates.length} results
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidatesList;