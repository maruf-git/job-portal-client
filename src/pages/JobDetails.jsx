import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../providers/AuthProvider'
import toast from 'react-hot-toast'
import { compareAsc, format } from "date-fns";

const JobDetails = () => {
  // selected date from form
  const [startDate, setStartDate] = useState(new Date())
  const { user } = useContext(AuthContext);
  // getting specific job id from uri
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigate = useNavigate();


  // loading specific job
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URI}/job/${id}`)
      .then(res => {
        setJob(res.data);
      })
  }, [id])


  // handle bid submit
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const bidding_price = Number(form.price.value);
    const bidder_comment = form.comment.value;
    const bidder_deadline = startDate;

    // bidder info
    const bidder = {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL
    }
    const job_id = id;
    const bidInfo = {
      bidder,
      bidding_price,
      bidder_deadline,
      bidder_comment,
      job_id,
      category:job.category,
      title:job.job_title,
      status:"Pending",
      buyer_email:job.buyer.buyer_email
    }



    // bid validation

    // buy and bidder are same validation
    if (job?.buyer?.buyer_email === user?.email) {
      return toast.error('Action is forbidden for you!')
    }
    //current date  crossed buyer deadline validation
    if (compareAsc(new Date(), new Date(job?.deadline)) === 1) {
      return toast.error("Deadline Crossed Bidding Forbidden");
    }
    // price validation
    if (bidding_price > job.max_price) {
      console.log("hello");
      return toast.error("Price can not be higher than maximum price limit!");
    }
    // offered deadline and buyer deadline validation
    if (compareAsc(new Date(bidder_deadline), new Date(job?.deadline)) === 1) {
      return toast.error("Please Enter Valid Deadline!");
    }

    // adding bid to the database
    axios.post(`${import.meta.env.VITE_API_URI}/add-bid`, bidInfo)
      .then(res => {
        if (res.data.insertedId) {
          toast.success('Bidding Successful');
          navigate('/my-bids');
        }
      })
      .catch(err => {

        toast.error(err?.response.data);
      })

  }



  return (
    <div className='flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto '>
      {/* Job Details */}
      <div className='flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-light text-gray-800 '>
            Deadline: {job.deadline && format(job.deadline, 'P')}
          </span>
          <span className='px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full '>
            {job.category}
          </span>
        </div>

        <div>
          <h1 className='mt-2 text-3xl font-semibold text-gray-800 '>
            {job.job_title}
          </h1>

          <p className='mt-2 text-lg text-gray-600 '>
            {job.description}
          </p>
          <p className='mt-6 text-sm font-bold text-gray-600 '>
            Buyer Details:
          </p>
          <div className='flex items-center gap-5'>
            <div>
              <p className='mt-2 text-sm  text-gray-600 '>
                Name: {job?.buyer?.buyer_name}
              </p>
              <p className='mt-2 text-sm  text-gray-600 '>
                Email: {job?.buyer?.buyer_email}
              </p>
            </div>
            <div className='rounded-full object-cover overflow-hidden w-14 h-14'>
              <img
                referrerPolicy='no-referrer'
                src={user?.photoURL}
                alt=''
              />
            </div>
          </div>
          <p className='mt-6 text-lg font-bold text-gray-600 '>
            Range: ${job.min_price} - ${job.max_price}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className='p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Place A Bid
        </h2>
        {/* bid data form */}
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='price'>
                Price
              </label>
              <input
                id='price'
                type='text'
                name='price'
                required
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'
                defaultValue={user?.email}
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='comment'>
                Comment
              </label>
              <input
                id='comment'
                name='comment'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              type='submit'
              className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default JobDetails
