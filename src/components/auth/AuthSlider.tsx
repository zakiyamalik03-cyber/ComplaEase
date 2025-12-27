"use client";
import React, { useState, useEffect } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import GridShape from "../common/GridShape";
import Link from "next/link";
import Image from "next/image";
import ThemeTogglerTwo from "../common/ThemeTogglerTwo";
import { usePathname } from "next/navigation";

export default function AuthSlider() {
    const pathname = usePathname();
    const [isSignIn, setIsSignIn] = useState(true);

    // Sync state with URL on mount
    useEffect(() => {
        if (pathname === "/signup") {
            setIsSignIn(false);
        } else {
            setIsSignIn(true);
        }
    }, [pathname]);

    const toggleView = () => {
        const newState = !isSignIn;
        setIsSignIn(newState);
        const newPath = newState ? "/signin" : "/signup";
        window.history.pushState(null, "", newPath);
    };

    return (
        <div className="relative w-full min-h-screen bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
            {/* Theme Toggler */}
            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                <ThemeTogglerTwo />
            </div>

            {/* Main Container for Desktop (Sliding Effect) */}
            <div className="relative hidden lg:block w-full h-screen overflow-hidden">

                {/* Sign In Form Container - Left Side */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-700 ease-in-out ${!isSignIn ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-20'}`}
                >
                    <div className="w-full max-w-md px-12">
                        <SignInForm onToggle={toggleView} />
                    </div>
                </div>

                {/* Sign Up Form Container - Right Side */}
                <div
                    className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-700 ease-in-out ${isSignIn ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-20'}`}
                >
                    <div className="w-full max-w-md px-12">
                        <SignUpForm onToggle={toggleView} />
                    </div>
                </div>

                {/* Overlay (Branding) - Slides on top */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full z-40 transition-transform duration-700 ease-in-out ${isSignIn ? 'translate-x-full' : 'translate-x-0'}`}
                >
                    <div className="w-full h-full bg-brand-950 dark:bg-gray-800 relative flex flex-col items-center justify-center text-center p-12 text-white">
                        <GridShape />
                        <div className="relative z-10 flex flex-col items-center">
                            <Link href="/" className="block mb-6">
                                <Image width={128} height={128} src="/images/logo/logo.png" alt="Logo" className="mx-auto" />
                            </Link>

                            <h2 className="text-3xl font-bold mb-4">
                                {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
                            </h2>
                            <p className="mb-8 text-gray-300 max-w-sm">
                                {isSignIn
                                    ? "Enter your personal details and start your journey with us"
                                    : "To keep connected with us please login with your personal info"}
                            </p>

                            <button
                                onClick={toggleView}
                                className="px-10 py-3 border-2 border-white rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-brand-950 transition-colors duration-300"
                            >
                                {isSignIn ? "Sign Up" : "Sign In"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet View (Stacked/Switched) */}
            <div className="lg:hidden w-full h-full flex flex-col items-center justify-center p-6 min-h-screen">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <Image width={80} height={80} src="/images/logo/logo.png" alt="Logo" />
                        </Link>
                    </div>
                    {isSignIn ? (
                        <SignInForm onToggle={toggleView} />
                    ) : (
                        <SignUpForm onToggle={toggleView} />
                    )}
                </div>
            </div>
        </div>
    );
}
