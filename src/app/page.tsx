import Link from "next/link";
import { GitBranchIcon } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-6">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4">
            <GitBranchIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Insighta Labs+
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Profile Intelligence Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
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

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-500 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
