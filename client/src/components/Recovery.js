import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assests/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import {useAuthStore} from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useFormik } from 'formik'
import { passwordvalidate, usernameValidate } from '../helper/validate'

import styles from '../styles/Username.module.css'
function Recovery() {

  const {username} = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  useEffect(()=>{
    generateOTP(username).then((OTP)=>{
      console.log(OTP)
      if(OTP) return toast.success('OTP has been send to your Email')
      return toast.error('Problem while generating OTP!')
    }).catch(ERROR=>{
      console.log(ERROR)
    })
  },[username])

  async function onSubmit(e){
    e.preventDefault();

    let {status} = await verifyOTP({username,code: OTP})
    if(status === 201){
      toast.success('Verify Successfully!!')
      return navigate('/reset');
    }

    return toast.error('Wrong OTP! Check email again')
  }

  //handler function of resend otp
  function resendOTP(){
    let sendPromise = generateOTP(username)

    toast.promise(sendPromise,{
      loading: 'Sending...!',
      success: <b>OTP has been send to your email</b>,
      error:<b>Could not Send it!</b>
    })

    sendPromise.then(OTP=> {
      console.log(OTP)
    });
  }
 

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold '>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500 '>Enter OTP to recover Password</span>
          </div>

          <form className='py-20'>


            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">Enter 6 digit OTP sent to your email address</span>
                <input onChange={(e)=> setOTP(e.target.value)} type="password" className={styles.textbox} placeholder='OTP' />
              </div>

              <button onClick={onSubmit} type='submit' className={styles.btn}>Recover</button>
            </div>
          </form>
          <div className="text-center py-4">
              <span className="text-gray-500">
                Cant't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend it</button>
              </span>
            </div>
        </div>

      </div>
    </div>

  )
}

export default Recovery