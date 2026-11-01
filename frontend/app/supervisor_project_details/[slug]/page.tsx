"use client";

import { useEffect, useState } from "react";
import {
    ArrowLeft,
    MapPin,
    CalendarDays,
    Clock,
    User,
    Phone,
    Mail,
    Globe,
    BriefcaseBusiness,
    ClipboardList,
    Image as ImageIcon,
    CheckCircle2,
    Star,
    MessageCircle,
    AlertCircle,
    User2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FancyLoader from "@/app/component/loading";
import { SupervisorProject } from "@/app/component/interface";
import Head from "@/app/component/head";
import Footer from "@/app/component/footer";



export default function SupervisorProjectDetails() {
    const params = useParams();
    const slug = params.slug as string;
     const [project, setProject] = useState<SupervisorProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/supervisor/${slug}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load project");
                }

                setProject(data.project);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <FancyLoader fullScreen />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-5">
                <AlertCircle size={45} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Project Not Found
                </h2>
                <p className="text-gray-500 mt-2">{error || "This project does not exist."}</p>
                <Link href="/"
                    className="mt-5 text-orange-500 font-semibold">
                    Go Home
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        request: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
        approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        assigned: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        ongoing: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
        completed: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const detailItems = [
        { icon: BriefcaseBusiness, label: "Project Type", value: project.projecttype },
        { icon: MapPin, label: "Project Location", value: project.projectlocation },
        { icon: Globe, label: "Country", value: project.country },
        { icon: ClipboardList, label: "Project Stage", value: project.projectstatus },
        { icon: Clock, label: "Supervision Type", value: project.supervisiontype },
        { icon: CalendarDays, label: "Date Submitted", value: formatDate(project.created_at) }
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6">
            <Head />
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <Link href="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Back</span>
                    </Link>

                    <span className="text-xs font-semibold text-gray-400">
                        REQUEST #{project.id}
                    </span>
                </div>

                {/* Project Heading */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

                        <div>
                            <p className="text-sm text-orange-500 font-semibold mb-2">
                                SERVICEHUB SUPERVISION
                            </p>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {project.projecttype} Supervision
                            </h1>

                            <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                                <MapPin size={16} />
                                {project.projectlocation}
                            </p>
                        </div>

                        <span className={`w-fit px-4 py-2 rounded-full text-xs font-bold capitalize ${
                            statusColors[project.status] || "bg-gray-100 text-gray-600"
                        }`}>
                            {project.status}
                        </span>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-2">Project Budget</p>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {project.budget || "Not specified"}
                            </h3>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-2">Project Stage</p>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {project.projectstatus}
                            </h3>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-2">Supervision</p>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {project.supervisiontype}
                            </h3>
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Project Information */}
                        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                                Project Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {detailItems.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <div key={index} className="flex gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                                <Icon size={19} />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 mt-7 pt-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Project Description
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-7 whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>
                        </section>

                        {/* Before Images */}
                        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <ImageIcon size={19} className="text-orange-500" />
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                    Initial Project Images
                                </h2>
                            </div>

                            {project.images?.length ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {project.images.map((image, index) => (
                                        <a key={index} href={image} target="_blank" rel="noreferrer">
                                            <img
                                                src={image}
                                                alt={`Initial project ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-xl hover:opacity-80 transition"
                                            />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No initial project images uploaded.
                                </p>
                            )}
                        </section>

                        {/* Progress Images */}
                        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <CheckCircle2 size={19} className="text-green-500" />
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                    Progress / Completion Images
                                </h2>
                            </div>

                            {project.after_images?.length ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {project.after_images.map((image, index) => (
                                        <a key={index} href={image} target="_blank" rel="noreferrer">
                                            <img
                                                src={image}
                                                alt={`Progress project ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-xl hover:opacity-80 transition"
                                            />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No progress images uploaded yet.
                                </p>
                            )}
                        </section>

                        {/* Rating */}
                        {project.rating && (
                            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                    Client Review
                                </h2>

                                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star
                                            key={index}
                                            size={18}
                                            fill={index < project.rating!.rating ? "currentColor" : "none"}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">
                                        {project.rating.rating}/5
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {project.rating.review}
                                </p>
                            </section>
                        )}

                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">

                        {/* Client Information */}
                        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                                Client Information
                            </h2>

                            <div className="space-y-5">

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <User size={19} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {project.fullname}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <Phone size={19} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {project.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <Mail size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                                            {project.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 hover:bg-amber-300 p-1 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <User2 size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">View</p>
                                        <Link 
                                            href={`/profile/${project.profileslug}`}
                                            className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                                            View Profile
                                        </Link>
                                    </div>
                                </div>

                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-6">
                                <p className="text-xs text-gray-500 mb-3">
                                    Preferred Contact Method
                                </p>

                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                    {project.contactmethod}
                                </p>

                                <a
                                    href={`https://wa.me/${project.phone.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold transition"
                                >
                                    <MessageCircle size={18} />
                                    Contact Client
                                </a>
                            </div>
                        </section>

                        {/* Request Summary */}
                        <section className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-3xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                ServiceHub Supervision
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                                This request was submitted through ServiceHub by a client looking for project supervision.
                            </p>

                            <p className="text-xs text-gray-500 mt-4">
                                Request submitted: {formatDate(project.created_at)}
                            </p>
                        </section>

                    </aside>
                </div>
            </div>
            <Footer />
        </main>
    );
}