import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import PageNotFound from '../../components/PageNotFound/PageNotFound' 
import ForgotPassword from './ForgotPassword'
import ForgotMessage from './ForgotMessage'
import ResetPassword from './ResetPassword'

const Auth = () => {
  return (
    <> 
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-message" element={<ForgotMessage />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound/>} />
    </Routes> 
    </>
  )
}

export default Auth;  