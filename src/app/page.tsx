import Link from "next/link";
import {
  GitBranchIcon,
  ServerIcon,
  TerminalIcon,
  GlobeIcon,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Logo / Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg">
              <GitBranchIcon className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Insighta Labs+
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Secure Profile Intelligence Platform — Transform raw names into
              enriched demographic insights with role-based access control,
              multi-interface support, and enterprise-grade security.
            </p>
          </div>

          {/* Login Section */}
          <div className="bg-white dark:bg-gray-800 shadow-xl">
            <div className="w-full max-w-md mx-auto px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                Sign in to continue
              </h2>

              <div className="space-y-4">
                <Link
                  href={`${API_BASE}/auth/github`}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <GitBranchIcon className="h-5 w-5" />
                  </span>
                  Continue with GitHub
                </Link>
              </div>
            </div>
          </div>

          {/* Component Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Backend Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  <ServerIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Backend API
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                Express.js REST API with GitHub OAuth PKCE flow, JWT
                authentication, role-based access control, rate limiting, and
                natural language query parsing. The core engine that powers all
                interfaces.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                Repository
              </div>
              <a
                href="https://github.com/chile4coding/insighta-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center">
                <GitBranchIcon className="w-4 h-4 mr-2" />
                github.com/chile4coding/insighta-backend
              </a>
            </div>

            {/* Frontend Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                  <GlobeIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Web Portal
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                Next.js React application with secure HTTP-only cookies, CSRF
                protection, dashboard analytics, profile browsing, natural
                language search, and CSV export. Built for non-technical users.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                Repository
              </div>
              <a
                href="https://github.com/chile4coding/insighta-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm flex items-center">
                <GitBranchIcon className="w-4 h-4 mr-2" />
                github.com/chile4coding/insighta-web
              </a>
            </div>

            {/* CLI Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                  <TerminalIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  CLI Tool
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                Global npm package for terminal access. Supports login via
                GitHub OAuth, token management, profile listing, natural
                language search, CSV export, and full read/write capabilities
                for power users.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                Repository
              </div>
              <a
                href="https://github.com/chile4coding/insighta-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-sm flex items-center">
                <GitBranchIcon className="w-4 h-4 mr-2" />
                github.com/chile4coding/insighta-cli
              </a>
            </div>
          </div>

          {/* System Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    GitHub OAuth with PKCE
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Secure authentication with Proof Key for Code Exchange,
                    preventing authorization code interception attacks
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Role-Based Access Control
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Admin (full access) and Analyst (read-only) roles with
                    enforced permissions across all endpoints
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    HTTP-Only Cookie Sessions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Tokens inaccessible to JavaScript with SameSite=Strict for
                    CSRF protection
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Token Rotation & Expiry
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Short-lived access tokens (3 min) and refresh tokens (5 min)
                    with automatic rotation on each refresh
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Natural Language Search
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Query profiles with plain English: &quot;female adults from
                    US&quot;, &quot;males over 30&quot;, &quot;senior profiles
                    from Germany&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Rate Limiting & Logging
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Auth endpoints: 10/min, API endpoints: 60/min per user with
                    structured request logging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Insighta Labs+ — Built for secure, multi-interface profile
          intelligence
        </p>
      </footer>
    </div>
  );
}
