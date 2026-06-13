'use client';
import { Edit, ImagePlus, Share2, Trash2Icon, TrashIcon, ViewIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../component/loading';
import Head from '../component/head';
import { useImageViewer } from '../component/useImageView'
import { ImageViewer } from "../component/imageViewer";
import SocialShare from '../component/shareButton';


const server = process.env.NEXT_PUBLIC_API_URL
type User = {
  id: string;
  fullname: string;
  email: string;
  profilePix?: string;
  role: string;
  location: string;
  address: string;
  image: string[]
  description: string;
  coverphoto: string;
  profilephoto: string;
  skills: string;
  services: string[]
  slug: string
};
type Job = {
  id: string,
  service_type: string
  job_title: string,
  description: string,
  scheduled_date: string,
  job_photos: string[]
  quote_amount: string,
  slug: string,
  status: string
  created_at: string,
  quote_status: string

}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>()
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [about, setAbout] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(false)
  const [coverPhoto, setCoverPhoto] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [services, setServices] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const {image, openImage, closeImage } = useImageViewer();
  const [currentImage, setCurrentImage] = useState<string>('')
  const [openShare, setOpenShare] = useState(false)
  const [recentJob, setRecentJob] = useState<Job[] | null>(null)
  const [isRecentJob, setIsRecentJob] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    async function getUser() {
      const localUserData = localStorage.getItem('user');
      if (!localUserData) {
        router.push('/login');
        return
      }
      const data = JSON.parse(localUserData);
      setUser(data);
      setAbout(data.description || '');
    }
    getUser()
  }, []);

  //run base on view port
  
  useEffect(() => {
    async function getRecentJob(){
    
    const localUserData = localStorage.getItem('user');
      if (!localUserData) {
        router.push('/login');
        return
      }
    const user = await JSON.parse(localUserData)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recent-job?id=${user?.id}`)

      if (!res.ok) {
        return
      }
      const data = await res.json()
      setRecentJob(data)
      setIsRecentJob(true)
    } catch (error) {
      console.log(error)
    }
  }
  getRecentJob()
  }, [])

  async function handleSave() {
    setIsLoading(true);
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const data = JSON.parse(userData);
    const userId = data.id;

    try {
      const result = await fetch(`${server}/api/update-about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, about }),
      });

      if (result.ok) {
        setIsEditingAbout(false);
        setUser(prev => prev ? { ...prev, description: about } : prev);
        localStorage.setItem('user', JSON.stringify({ ...data, description: about }));
      } else {
        alert('Failed to update about info. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, categories: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload logic
    const formData = new FormData();
    formData.append('photo', file);
    if (categories == "upload-cover") {
      setCoverPhoto(true)
    } else if (categories == 'upload-profilephoto') {
      setProfilePhoto(true)
    } else {
      setIsUploadingImage(true)
    }

    try {
      const res = await fetch(`${server}/api/${categories}?id=${user?.id}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const image = await res.json()
        if (categories == "upload-cover") {
          localStorage.setItem('user', JSON.stringify({ ...user, coverphoto: image.url }));
        } else if (categories == 'upload-profilephoto') {
          localStorage.setItem('user', JSON.stringify({ ...user, profilephoto: image.url }));
        } else {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...user,
              image: [...(user?.image || []), image.url]
            })
          );
        }
        const localUserData = localStorage.getItem('user');
        if (localUserData) {
          const data = JSON.parse(localUserData);
          setUser(data);
          setAbout(data.description || '');
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      if (categories == "upload-cover") {
        setCoverPhoto(false)
      } else if (categories == 'upload-profilephoto') {
        setProfilePhoto(false)
      } else {
        setIsUploadingImage(false)
      }

    }
  };
  async function handleServiceUpload() {
    setIsLoading(true)
    try {
      const data = await fetch(`${server}/api/update-services?id=${user?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services })
      })
      if (!data) {
        console.log("Something went wrong")
      } else {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            services: [...(user?.services || []), services]
          })
        );
        const userInfo = localStorage.getItem('user')
        if (userInfo) {
          const userData = JSON.parse(userInfo)
          setUser(userData);
        }
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      setIsEditing(false)
      setServices('')
    }
  }

  async function deleteItem(service: string, url: string) {
    // Use 'type' to determine the URL or body logic
    const res = await fetch(`${server}/api/${url}?id=${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service }) // Tell backend exactly what to delete
    });

    if (!res.ok) {
      console.error("Something went wrong");
      return;
    }

    // 1. Create the updated object first
    const updatedUser = { ...user } as User;

    if (url == 'delete_service') {
      updatedUser.services = (user?.services || []).filter((s: string) => s !== service);
    } else {
      updatedUser.image = (user?.image || []).filter((img: string) => img !== service);
      setIsOpen(false)
    }

    // 2. Sync both LocalStorage and State ONCE
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Head />
      <div className="h-14" />

      {/* Cover Photo */}
      <div
        className="h-64 md:h-80 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: user?.coverphoto
            ? `url("${user.coverphoto}")`
            : 'url("/coverphoto.png")',
        }}
        onClick={ ()=>user?.profilephoto ? openImage(user.coverphoto): ""}
      >
        <div className="w-2.5 absolute inset-0 bg-linear-to-b from-transparent via-transparent to-gray-50/80 dark:to-gray-950/80" />
        <button
          className={`
              absolute bottom-20 right-8 z-10
              flex items-center justify-center
              w-10 h-10 rounded-2xl
              bg-linear-to-br from-gray-50 to-gray-100
              dark:from-gray-800 dark:to-gray-900
              text-gray-700 dark:text-gray-200
              shadow-[inset_4px_4px_8px_rgba(255,255,255,0.6),inset_-4px_-4px_8px_rgba(0,0,0,0.1),8px_8px_20px_rgba(0,0,0,0.15)]
              dark:shadow-[inset_3px_3px_6px_rgba(255,255,255,0.05),inset_-3px_-3px_6px_rgba(0,0,0,0.4),10px_10px_25px_rgba(0,0,0,0.5)]
              hover:scale-110 hover:shadow-2xl
              active:scale-95
              transition-all duration-300
            `}
          aria-label="Upload new image"
        >
          {coverPhoto ? <div className="flex items-center justify-center">
            <div className="
              h-12 w-12 
              rounded-full 
              border-4 border-gray-300 
              border-t-blue-600 
              dark:border-gray-600 dark:border-t-blue-400
              animate-spin
            " />
          </div> :
            <label htmlFor='coverPhoto'><ImagePlus className="h-6 w-6 stroke-2" /></label>
          }
          <input type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id='coverPhoto'
            onChange={(e) => handleCoverPhotoChange(e, 'upload-cover')}
          />
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 pb-12 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">

            {/* Avatar */}
            <div className="flex justify-center md:justify-start shrink-0 relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-gray-200 dark:bg-gray-700">
                <img
                    src={user?.profilephoto || "/avatar.webp"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onClick={() => {
                      if (user?.profilephoto) {
                        openImage(user.profilephoto);
                      }
                    }}
                  />
              </div>
              {/* Hidden file input - you can add upload logic later */}
              <label
                htmlFor="profilePhoto"
                className={`
                    flex items-center justify-center
                    w-10 h-10 rounded-2xl
                    bg-linear-to-br from-gray-50 to-gray-100
                    dark:from-gray-800 dark:to-gray-900
                    text-gray-700 dark:text-gray-200
                    shadow-[inset_4px_4px_8px_rgba(255,255,255,0.6),inset_-4px_-4px_8px_rgba(0,0,0,0.1),8px_8px_20px_rgba(0,0,0,0.15)]
                    dark:shadow-[inset_3px_3px_6px_rgba(255,255,255,0.05),inset_-3px_-3px_6px_rgba(0,0,0,0.4),10px_10px_25px_rgba(0,0,0,0.5)]
                    hover:scale-110 hover:shadow-2xl
                    active:scale-95
                    transition-all duration-300
                    cursor-pointer
                  `}
              >
                {profilePhoto ? (
                  <div className="flex items-center justify-center">
                    <div className="
                    h-12 w-12 
                    rounded-full 
                    border-4 border-gray-300 
                    border-t-blue-600 
                    dark:border-gray-600 dark:border-t-blue-400
                    animate-spin
                  " />
                  </div>
                ) : (
                  <ImagePlus className="z-50 h-6 w-6 stroke-2" />
                )}

                {/* Hidden input – placed inside label */}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="profilePhoto"
                  onChange={(e) => handleCoverPhotoChange(e, 'upload-profilephoto')}
                />
              </label>

            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
                  {user?.fullname || "Loading..."}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>

              {user?.role !== 'client' && (
                <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                  {user?.skills ? 'Professional ' + user?.skills : ""}
                </p>
              )}

              {
                user?.role == "worker" ?
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 text-xl">★</span>
                      <span className="font-semibold">4.8</span>
                      {/* <span>(1 reviews)</span> */}
                    </div>
                    <div className="hidden md:block text-gray-400 dark:text-gray-500">•</div>
                    <div> jobs completed</div>
                  </div> :
                  <p></p>
              }

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{user?.address || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{user?.location || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="relative flex items-center justify-center md:justify-end gap-3 mt-4 md:mt-0">
              <button 
                 onClick={() => { openShare ? setOpenShare(false) : setOpenShare(true) }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition">
                <Share2 size={18} />
                Share
              </button>
              <button 
                onClick={()=>router.push('/update_location')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition">
                <Share2 size={18} />
                Update
              </button>
                <div className='absolute -top-16 md:top-14 right-0'>
                {openShare && <SocialShare slug={user?.slug || ""} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14">
        {/* About */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-5 dark:text-white">About Me</h2>
          {user?.description || isEditingAbout ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {user?.description}
            </p>
          ) : (
            <button
              onClick={() => setIsEditingAbout(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition border border-gray-200 dark:border-gray-700"
            >
              <Edit size={18} />
              Add About Section
            </button>
          )}
        </section>

        {/* Services - Professionals only */}
        {user?.role == 'worker' && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 dark:text-white">Services Offered</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {user?.services ? user.services.map((service, i) => (
               <div
                  key={i}
                  className="group relative bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center font-medium text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm"
                >
                  {service}

                  <Trash2Icon
                    onClick={() => deleteItem(service, "delete_service")}
                    className="absolute -top-2.5 -right-0.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
                  />
                </div>
              )) : "No services added"
              }

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center bg-orange-400 p-4 rounded-xl border border-gray-200 dark:border-gray-700  font-medium text-white hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm">
                <Edit />
                Add Service
              </button>
            </div>
          </section>
        )}

        {/* display Options  */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            {/* Background Overlay */}
            <div className=" absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />

            {/* Action Pill */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
              relative
              flex items-center gap-1
              bg-white/80 backdrop-blur-xl
              px-1.5 py-1.5
              rounded-full
              shadow-2xl shadow-black/10
              border border-gray-200/50
              animate-in zoom-in-95 duration-200
            "
            >
              <button
                className="
                flex items-center gap-2
                px-4 py-2
                text-sm font-medium text-gray-700
                rounded-full
                hover:bg-gray-100
                active:scale-95
                transition-all duration-200
              "
                onClick={() => openImage(currentImage)}
              >
                <ViewIcon className="h-4 w-4" />
                <span>View</span>
              </button>

              <div className="w-px h-6 bg-gray-200" />

              <button
                className="
                flex items-center gap-2
                px-4 py-2
                text-sm font-medium text-red-600
                rounded-full
                hover:bg-red-50
                active:scale-95
                transition-all duration-200
              "
                onClick={() => deleteItem(currentImage, 'delete_image')}
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
        {/* Gallery - Professionals only */}
        {user?.role !== 'client' && (
          <section
            ref={targetRef}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-5 dark:text-white">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {user?.image && user.image.length > 0 ? user.image.map((img, i) => (
                <div
                  key={i}
                  className=" relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={() => { setIsOpen(true); setCurrentImage(img) }}
                >

                  <img
                    src={img}
                    alt={`Project ${i + 1}`}
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )) :
                ""
              }
              <button
                className="w-full aspect-4/3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {
                  isUploadingImage ? <div className="
                    h-12 w-12 
                    rounded-full 
                    border-4 border-gray-300 
                    border-t-blue-600 
                    dark:border-gray-600 dark:border-t-blue-400
                    animate-spin
                  " /> :
                    <label htmlFor='work_image' className='w-full aspect-4/3 flex flex-col items-center justify-center '>
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>

                      Add Work sample Photo
                    </label>
                }
              </button>
              <input
                type="file"
                id="work_image"
                accept="image/jpeg,image/png,image/webp"
                className='hidden'
                onChange={(e) => handleCoverPhotoChange(e, 'upload-workphoto')} />
            </div>
          </section>
        )}
        {/* PREVIOUS JOB DONE */}
        {/* Recnet Job */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Recent Jobs
          </h2>

          {recentJob && recentJob.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentJob.map((job) => (
                <div
                  key={job.id}
                  className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Top Accent Line */}
                  <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />

                  {/* Header & Status */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${job.status === "accepted"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/30"
                            : job.status === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/30"
                              : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-400/30"
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition truncate">
                      {job.job_title}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-1">
                      {job.service_type}
                    </p>
                  </div>

                  {/* Photos - Strictly limited to 2 */}
                  {job.job_photos?.length > 0 && (
                    <div className="px-5 pb-4">
                      <div className="flex gap-2">
                        {job.job_photos.slice(0, 2).map((photo, index) => (
                          <div
                            key={index}
                            className={`relative overflow-hidden rounded-xl border border-slate-100 dark:border-white/5 ${job.job_photos.length === 1 ? "w-full h-32" : "w-1/2 h-24"
                              }`}
                          >
                            <img
                              src={photo}
                              alt={`${job.job_title} ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            {/* Badge for remaining photos if more than 2 exist */}
                            {index === 1 && job.job_photos.length > 2 && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="text-white text-xs font-black">+{job.job_photos.length - 2}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="grid grid-cols-2 gap-3 mt-auto px-5 pb-5">
                    <a
                      href={`/job/${job.slug}`}
                      className="flex items-center justify-center py-3 w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black text-slate-600 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all duration-300"
                    >
                      View Details
                    </a>
                    <a
                      href={`/job/${job.slug}`}
                      className="flex items-center justify-center py-3 w-full bg-slate-900 text-white dark:bg-white/5 hover:bg-slate-500 dark:hover:bg-white hover:text-white dark:hover:text-black  dark:text-zinc-300 font-bold text-xs rounded-xl transition-all duration-300"
                    >
                      Done
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-slate-500 text-sm font-medium">No recent jobs found.</p>
            </div>
          )}
        </section>
      </div>

      {/* Edit About Modal */}
      {isEditingAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold dark:text-white">Let Users know about you</h3>
              <button
                onClick={() => setIsEditingAbout(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none min-h-[160px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                rows={7}
                placeholder="Tell others about your professional background, skills, experience, passions..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={500}
              />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                {500 - about.length} characters remaining
              </p>
            </div>

            {/* UPDATE USER ABOUT ME  */}
            <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
              <button
                onClick={() => setIsEditingAbout(false)}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* UPDATE SERVICES MODAL */}
      {
        isEditing ?
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg h-90 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold dark:text-white">Add a service</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-6 ">
                <textarea
                  className="w-full h-25 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none min-h-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows={2}
                  placeholder="Add a service to your profile, this will help your account to get more lead on a search..."
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  maxLength={40}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                  {40 - services.length} characters remaining
                </p>
              </div>

              {/* UPDATE USER ABOUT ME  */}
              <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleServiceUpload}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

          </div> :
          ""
      }
      <ImageViewer image={image} onClose={closeImage} />
      {isLoading && <Loading />}
    </div>
  );


}