import { useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../providers/AuthProvider'
import axios from 'axios'
import toast from 'react-hot-toast'


const UpdateJob = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [job, setJob] = useState({});
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URI}/job/${id}`)
      .then(res => {
        setJob(res.data);
      })
  }, [id])

  const handleUpdate = (event) => {
    event.preventDefault();
    //receiving form data
    const formData = new FormData(event.target);
    const newJob = Object.fromEntries(formData.entries());
    newJob.deadline = startDate;
    newJob.bid_count = job.bid_count; //it will not get changed
    newJob.min_price = Number(newJob.min_price);
    newJob.max_price = Number(newJob.max_price);
    newJob.buyer = {
      buyer_name: user?.displayName,
      buyer_email: user?.email,
      buyer_photo: user?.photoURL
    }
    // saving data to the database
    axios.put(`${import.meta.env.VITE_API_URI}/update-job/${id}`, newJob)
      .then(res => {  
        if(res.data.modifiedCount)
        {
          toast.success('Job is Successfully Updated');
          navigate('/my-posted-jobs');
        }
      })
  }

  console.log(job.deadline);

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Job
        </h2>

        <form onSubmit={handleUpdate} >
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='job_title'>
                Job Title
              </label>
              <input
                defaultValue={job.job_title}
                id='job_title'
                name='job_title'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                defaultValue={user?.email}
                disabled={true}
                id='emailAddress'
                type='email'
                name='email'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>
              <DatePicker
                className='border p-2 rounded-md'
                selected={job?.deadline}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
              <select
                name='category'
                id='category'
                className='border p-2 rounded-md'
              >
                <option value='Web Development' selected={job.category==="Web Development"? true : ""}>Web Development</option>
                <option value='Graphics Design' selected={job.category==="Graphics Design"? true : ""} >Graphics Design</option>
                <option value='Digital Marketing' selected={job.category==="Digital Marketing"? true : ""}>Digital Marketing</option>
              </select>
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
              defaultValue={job?.min_price}
                id='min_price'
                name='min_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                 defaultValue={job?.max_price}
                id='max_price'
                name='max_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
               defaultValue={job?.description}
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              id='description'
              cols='30'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateJob
