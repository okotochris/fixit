'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {  Search } from 'lucide-react';
import Head from '../component/head';
import Footer from '../component/footer';

import JobCard from '../component/jobCard';

interface Job {
  id: number;
  job_title: string;
  service_type: string;
  description: string;
  scheduled_date: string;
  address: string;
  quote_amount: number | null;
  job_photos: string[];
  slug: string;
  status: string;
  created_at: string;
  latitude:number,
  skills:string
  longitude:number
}

function AvailableJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);           // ← Fixed: proper initial value
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]); // ← Fixed
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/available_jobs`);

        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data: Job[] = await res.json();
        
        setJobs(data);
        setFilteredJobs(data);        // ← Important: also update filteredJobs
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Could not load available jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Search filter
  useEffect(() => {
   async function filterJob(){
     if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = jobs.filter((job) =>
      job.job_title.toLowerCase().includes(term) ||
      job.service_type.toLowerCase().includes(term) ||
      job.address.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term)
    );

    setFilteredJobs(filtered);
   }
   filterJob()
  }, [searchTerm, jobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Finding available jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
    <Head/>
    <div className='h-14'/>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Available Jobs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filteredJobs.length} jobs found
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search jobs, services or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">No matching jobs</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try changing your search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredJobs.map((job, i) => (
             <JobCard 
                key={i}
                job={job} i={0}/>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default AvailableJobs;