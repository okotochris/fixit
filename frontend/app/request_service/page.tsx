"use client";
import React, { useEffect, useState } from "react";
import Head from "../component/head";
import Footer from "../component/footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import getLocation from "../component/getUserLocation";
import FancyLoader from "../component/loading";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id:string
  fullname: string;
  profilephoto: string;
  slug: string;
  skills: string;
  rating: number;
  reviews: number;
  phone: string;
  services:string[]
};
type RequestData = {
  client_id: string;
  worker_id: string;
  service_type: string;
  job_title: string;
  description: string;
  scheduled_date: string;
 job_photos: File[];///✅ array of strings
  address: string;
  time: string;
};
function Request_service() {
   const router = useRouter();
   const [isSelected, setIsSelected] = useState<"asap" | "thisWeek" | "scheduleDate">("asap");
  const [worker, setWorker] = useState<User | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)


useEffect(() => {
  const isUserSelected = async () => {
    try {
      const workerData = localStorage.getItem("worker");

      if (!workerData) {
        router.push("/service");
        return;
      }

      const userData = localStorage.getItem("user");

      if (!userData) {
        localStorage.setItem("redirectAfterLogin", '/request_service');
        router.push("/login");
        return;
      }

      const worker = JSON.parse(workerData);
      const user = JSON.parse(userData);

      setUserId(user.id);
      setWorker(worker);

    } catch (error) {
      console.error("Error parsing localStorage:", error);
    }
  };

  isUserSelected();
}, [router]);
useEffect(() => {
  if (userId && worker?.id) {
    setReqData((prev) => ({
      ...prev,
      client_id: userId,
      worker_id: worker.id,
    }));
  }
}, [userId, worker]);

const [reqData, setReqData] = useState<RequestData>({
  client_id: userId? userId : '',
  worker_id: worker?.id ? worker?.id: "",
  service_type: "",
  job_title: "",
  description: "",
  scheduled_date: "As soon as possible",
  job_photos: [],
  address: "",
  time: ""
});
 
// Handle file input change
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  // ✅ store real files for backend
  setReqData((prev) => ({
    ...prev,
    job_photos: [...prev.job_photos, ...files]
  }));

  // ✅ create preview URLs separately
  const previews = files.map((file) => URL.createObjectURL(file));
  setPreviewImages((prev) => [...prev, ...previews]);
};

  // Clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

//POST to create job request
async function handleRequest(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    // Get token from localStorage
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      localStorage.setItem("redirectAfterLogin", '/request_service');
      router.push("/login");
      return;
    }
    const token = tokenData;
    
    // Prepare FormData
    const formData = new FormData();
    formData.append("client_id", reqData.client_id);
    formData.append("worker_id", reqData.worker_id);
    formData.append("service_type", reqData.service_type);
    formData.append("job_title", reqData.job_title);
    formData.append("description", reqData.description);
    formData.append("scheduled_date",  reqData.scheduled_date || isSelected);
    formData.append("address", reqData.address);
    formData.append("time", reqData.time);
    const { lat, lng } = await getLocation();

    formData.append("latitude", lat.toString());
    formData.append("longitude", lng.toString());


    // Append multiple images
    reqData.job_photos.forEach((file) => formData.append("job_photos", file));
    // Send request
    const response = await fetch(`${serverUrl}/api/job_request`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`, 
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to submit job request");
    }

    const result = await response.json();
    console.log("Success:", result);

  } catch (err) {
    console.error("Error submitting request:", err);
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head />
      <div className="h-14" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mt-10 mb-6">
        Request a Service
      </h1>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row items-start justify-center gap-8 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ─── FORM ─── */}
        <div className="w-full lg:max-w-3xl space-y-8">
          <form className="space-y-8">
            {/* Job Details */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Job Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
                Describe what you need — our professionals will come to you!
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Job Title
                  </label>
                  <input
                    onChange={(e)=>setReqData({...reqData, job_title: e.target.value})}
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                    placeholder="e.g. Kitchen sink leaking"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    onChange={(e)=>setReqData({...reqData, description:e.target.value})}
                    id="description"
                    name="description"
                    rows={5}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition resize-y min-h-[120px]"
                    placeholder="Tell us more about the problem or what exactly you need..."
                  />
                </div>

                <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Service Type
                </label>

                <input
                  onChange={e=>setReqData({...reqData, service_type:e.target.value})}
                  type="text"
                  list="services"
                  id="service"
                  name="service"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                />

                <datalist id="services">
                  {worker?.services && worker?.services.map((item, i) => (
                    <option key={i} value={item} />
                  ))}
                </datalist>
              </div>
                {/* Photo Upload + Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Photos (optional)
                  </label>

                  <label
                    htmlFor="photoUpload"
                    className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <svg className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag & drop</span>
                    <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">PNG, JPG, max 10MB per image</span>
                  </label>
                  <input
                    type="file"
                    id="photoUpload"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {previewImages.map((src, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                          <img
                            src={src}
                            alt={`preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Schedule */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Location & Schedule
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Address / Location
                  </label>
                  <input
                    onChange={(e)=>setReqData({...reqData, address:e.target.value})}
                    type="text"
                    id="location"
                    name="location"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                    placeholder="Street name, city, or pin code"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    When do you want the service?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {setIsSelected("asap"); setReqData({...reqData, scheduled_date:"ASAP"})}}
                      className={`py-3 px-5 rounded-lg font-medium transition-colors ${
                        isSelected === "asap"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-2 border-blue-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                      }`}
                    >
                      As soon as possible
                    </button>
                    <button
                      type="button"
                      onClick={() => {setIsSelected("thisWeek"); setReqData({...reqData, scheduled_date:"This week"})}}
                      className={`py-3 px-5 rounded-lg font-medium transition-colors ${
                        isSelected === "thisWeek"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-2 border-blue-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                      }`}
                    >
                      This week
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSelected("scheduleDate")}
                      className={`py-3 px-5 rounded-lg font-medium transition-colors ${
                        isSelected === "scheduleDate"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-2 border-blue-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                      }`}
                    >
                      Schedule date
                    </button>
                  </div>

                  {isSelected === "scheduleDate" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Preferred Date
                        </label>
                        <input
                          onChange={(e)=>setReqData({...reqData, scheduled_date:e.target.value})}
                          type="date"
                          id="scheduleDate"
                          name="scheduleDate"
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Preferred Time
                        </label>
                        <input
                          onChange={(e)=>setReqData({...reqData, time:e.target.value})}
                          type="time"
                          id="scheduleTime"
                          name="scheduleTime"
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition shadow-md"
            >
              {loading ? "Requesting service..." : "Send Service Request"}
            </button>
          </form>
        </div>

        {/* Professional Preview Card */}
        <div className="w-full lg:w-96 lg:sticky lg:top-8">
          
          <div className="relative  bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8  border border-gray-200 dark:border-gray-700 text-center">
            
            <div
              className="w-28 h-28 mx-auto rounded-full mb-5 bg-gray-200 dark:bg-gray-700"
              style={{
                backgroundImage: worker?.profilephoto ? `url(${worker.profilephoto})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!worker?.profilephoto && (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No photo
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2 flex-wrap">
              
              {worker?.fullname} 
              <Link href={`/profile/${worker?.slug}`} ><ExternalLink /></Link>
             
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Professional {worker?.skills || "—"}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
             Contact: {worker?.phone || "—"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              ★ {worker?.rating?.toFixed(1) || "—"} ({worker?.reviews || 0} reviews)
            </p>
             <span className="absoulte top-0 right-2 inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
          </div>
        </div>
      </div>
       {loading && <FancyLoader fullScreen message="Requesting service..." />}
      <Footer />
    </div>
  );
}

export default Request_service;