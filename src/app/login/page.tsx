"use client";

import Link from "next/link";
import { loginWithGitHub } from "../../lib/api";
import { GitBranchIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Insighta Labs+
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Profile Intelligence Platform
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => loginWithGitHub()}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <GitBranchIcon className="h-5 w-5" />
            </span>
            Continue with GitHub
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
