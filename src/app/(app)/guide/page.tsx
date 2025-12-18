"use client";

import { Card } from "@/components/ui/card";
import {
    LayoutDashboard,
    Users,
    Calendar,
    CheckCircle2,
    Settings,
    ArrowRight,
    BookOpen,
    Info
} from "lucide-react";

export default function GuidePage() {
    const sections = [
        {
            title: "Dashboard Overview",
            icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
            description: "Get a bird's-eye view of your gym's performance.",
            steps: [
                "View active members and upcoming classes at a glance.",
                "Track attendance trends and revenue growth through interactive charts.",
                "Monitor membership expirations to proactively manage renewals."
            ]
        },
        {
            title: "Managing Members",
            icon: <Users className="h-6 w-6 text-emerald-600" />,
            description: "Efficiently manage your trainees, trainers, and staff.",
            steps: [
                "Click '+ Add User' to register new members or trainers.",
                "Use the search bar and filters to quickly find specific users.",
                "Edit user profiles to update contact info, plans, or roles.",
                "View detailed member profiles including membership history and stats."
            ]
        },
        {
            title: "Scheduling Classes",
            icon: <Calendar className="h-6 w-6 text-purple-600" />,
            description: "Organize and schedule gym sessions with ease.",
            steps: [
                "Create new classes by specifying the name, trainer, date, and time.",
                "Manage class capacity to ensure optimal session sizes.",
                "Update or cancel classes as needed; members will be notified.",
                "Filter classes by status (Scheduled, Completed, Cancelled)."
            ]
        },
        {
            title: "Tracking Attendance",
            icon: <CheckCircle2 className="h-6 w-6 text-indigo-600" />,
            description: "Keep accurate records of member participation.",
            steps: [
                "Select the current session from the dropdown to start marking attendance.",
                "Simply tap on a member's name to toggle their presence.",
                "View real-time attendance percentages and peak utilization stats.",
                "Review past attendance records in the history section."
            ]
        },
        {
            title: "System Settings",
            icon: <Settings className="h-6 w-6 text-slate-600" />,
            description: "Customize your admin experience.",
            steps: [
                "Update your admin profile information and password.",
                "Configure system-wide preferences and notifications.",
                "Manage your subscription and billing details."
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <header className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Admin Panel Guide</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Welcome to your Gym Mini Admin Panel. This guide will help you master all the tools available to grow and manage your fitness community.
                </p>
            </header>

            {/* Quick Info Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900">Pro Tip</h3>
                    <p className="text-sm text-blue-800 mt-1">
                        You can access this guide at any time from the sidebar. If you encounter any issues not covered here, please contact our support team.
                    </p>
                </div>
            </div>

            {/* Guide Sections */}
            <div className="grid gap-6">
                {sections.map((section, idx) => (SectionCard(section, idx)))}
            </div>

            {/* Footer */}
            <footer className="text-center pt-8 border-t border-slate-200">
                <p className="text-slate-500 text-sm italic">
                    &copy; 2025 Gym Mini Admin Panel. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

function SectionCard(section: any, index: number) {
    return (
        <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        {section.icon}
                    </div>
                </div>
                <div className="space-y-4 flex-1">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                        <p className="text-slate-500 mt-1">{section.description}</p>
                    </div>
                    <ul className="space-y-3">
                        {section.steps.map((step: string, sIdx: number) => (
                            <li key={sIdx} className="flex items-start gap-3 text-slate-700">
                                <div className="mt-1.5 flex-shrink-0">
                                    <ArrowRight className="h-4 w-4 text-blue-500" />
                                </div>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
}
