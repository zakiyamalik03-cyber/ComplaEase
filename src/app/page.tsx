"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    LogOut,
    User,
    ShieldCheck,
    Zap,
    Lock,
    CheckCircle,
    ArrowRight,
    Menu,
    X
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<{ name?: string | null, email?: string | null } | null>(null);

    useEffect(() => {
        // Check for localStorage auth (primary method in this app)
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        } else if (session?.user) {
            // Fallback to session if available
            setUser(session.user);
        }
    }, [session]);

    const handleSignOut = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        await signOut({ redirect: false });
        router.push("/signin");
    };

    const isLoggedIn = !!user;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <span>ComplaEase</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</Link>
                        <Link href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                        <div className="flex flex-col gap-4">
                            <Link href="#features" className="text-sm font-medium py-2 hover:text-blue-600">Features</Link>
                            <Link href="#how-it-works" className="text-sm font-medium py-2 hover:text-blue-600">How It Works</Link>
                            <Link href="#contact" className="text-sm font-medium py-2 hover:text-blue-600">Contact</Link>
                            <hr className="border-gray-200 dark:border-gray-800" />
                            {isLoggedIn ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 text-sm font-medium text-red-600"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link href="/signin" className="w-full text-center py-2 text-sm font-medium border border-gray-300 rounded-lg">Login</Link>
                                    <Link href="/signup" className="w-full text-center py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-16 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide mb-6">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                System Live
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-6">
                                A Simple & Reliable <br />
                                <span className="text-blue-600 dark:text-blue-400">Complaint Management</span> System
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Submit, track, and resolve complaints efficiently. A streamlined platform connecting citizens, students, and administration for quicker resolutions.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard size={20} />
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="lg:w-1/2 relative">
                            <Image src="/images/hero-img.png" width={500} height={500} alt="Hero Image" className="w-full h-auto" />

                            {/* Decorative Background Blobs */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose ComplaEase?</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            We provide a robust platform designed to handle complaints with speed, transparency, and security.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <LayoutDashboard size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparent Tracking</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Real-time updates on your complaint status from submission to resolution. Never lose track of your progress.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30">
                            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quick Resolutions</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Automated routing ensures complaints reach the right department instantly for faster processing.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-900/30">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Lock size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure & Confidential</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Your data is encrypted and handled with strict privacy protocols. Only authorized personnel have access.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 border-t border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2"></div>

                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 p-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-600/20">1</div>
                                <h3 className="text-lg font-bold mb-2">Register / Login</h3>
                                <p className="text-sm text-gray-500">Create your account or log in to access the system.</p>
                            </div>
                            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 p-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-600/20">2</div>
                                <h3 className="text-lg font-bold mb-2">Submit Complaint</h3>
                                <p className="text-sm text-gray-500">Fill in the details and attach proof if necessary.</p>
                            </div>
                            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 p-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-600/20">3</div>
                                <h3 className="text-lg font-bold mb-2">Track & Resolve</h3>
                                <p className="text-sm text-gray-500">Monitor status and receive updates until resolved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>
                                <span>ComplaEase</span>
                            </Link>
                            <p className="text-sm text-gray-400">
                                Empowering voices, resolving issues. The future of complaint management is here.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} ComplaEase. All rights reserved.</p>
                        <p className="flex items-center gap-4">
                            <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <Link href="#" className="hover:text-blue-400 transition-colors">Contact Us</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
