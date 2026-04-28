"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { searchProfiles, PaginatedResponse, Profile } from "../../../lib/api";
import Link from "next/link";
import {
  Search,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";

export default function SearchPage() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    links: {
      prev: string | null;
      next: string | null;
      self: string | null;
    };
  } | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const performSearch = async (searchQuery: string, url: string) => {
    if (!searchQuery.trim() && !url) return;

    setLoadingSearch(true);
    setError(null);
    try {
      const data = await searchProfiles(searchQuery, url);
      setResults(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        total_pages: data.total_pages,
        links: data.links,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
      setPagination(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = () => {
    performSearch(query, "");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number, link: string) => {
    console.log("this is the link: ", link);
    performSearch("", link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Please sign in to search profiles</p>
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Search className="w-6 h-6 mr-2" />
        Natural Language Search
      </h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="max-w-2xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., 'male adults from Nigeria' or 'females over 30'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loadingSearch || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              {loadingSearch ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Try these examples:</strong>
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>&quot;young males&quot;</li>
            <li>&quot;females above 30&quot;</li>
            <li>&quot;people from angola&quot;</li>
            <li>&quot;adult males from kenya&quot;</li>
            <li>&quot;male and female teenagers above 17&quot;</li>
            <li>&quot;males over 30&quot;</li>
            <li>&quot;senior profiles from Germany&quot;</li>
            <li>&quot;adults aged between 25 and 40&quot;</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">
                {pagination?.total} result{pagination?.total !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option value="created_at">Created</option>
                <option value="age">Age</option>
              </select>
              <button
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                {order === "asc" ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {profile.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {profile.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {profile.age_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.country_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/profiles/${profile.id}`}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    handlePageChange(
                      pagination.page - 1,
                      pagination?.links?.prev || "",
                    )
                  }
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  onClick={() =>
                    handlePageChange(
                      pagination.page + 1,
                      pagination?.links?.next || "",
                    )
                  }
                  disabled={pagination.page >= pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* {!loadingSearch && results.length === 0 && query && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      )} */}
    </div>
  );
}
