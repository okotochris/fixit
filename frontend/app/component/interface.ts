export type User = {
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
  latitude:number
  longitude:number
  slug:string
  country:string
  state:string
  phone:string
};

export type Job = {
  id:string,
  service_type:string
  job_title:string,
  description:string,
  scheduled_date:string,
  job_photos:string[]
  quote_amount:string,
  slug:string,
  status:string
  created_at:string,
  quote_status:string

}
export type Worker={
  id: string;
  fullname: string;
  slug: string;
  profession: string;
  coverphoto: string;
  profilephoto:string
  rating: number;
  reviews: number;
  description: string;
  location: string;
  address: number,
  latitude: number;
  longitude: number;
  services:string[]
  skills:string
}
export interface SupervisorProject {
    id: number;
    useslug: string;
    fullname: string;
    email: string;
    phone: string;
    country: string;
    projecttype: string;
    projectlocation: string;
    projectstatus: string;
    supervisiontype: string;
    budget: string | null;
    description: string;
    status: string;
    images: string[];
    after_images: string[];
    rating: {
        rating: number;
        review: string;
    } | null;
    contactmethod: string;
    created_at: string;
    profileslug:string
}
export  interface WorkerFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
  skills: string;
  hourlyRate: string;
  profilePhoto: File | null;
  terms: boolean;
  role: string;
  latitude:number;
  longitude:number;
  state:string,
  country:string
}