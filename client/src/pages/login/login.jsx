import React, { useState } from 'react'
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { AnimatePresence } from "framer-motion"
import { motion } from "motion/react"

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => setIsLogin(!isLogin)

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-6 md:p-10 justify-center">
        <div className="flex gap-2 justify-center">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center object-cover justify-center rounded-md  text-primary-foreground">
              <img
                src="/assets/logoDark.png"
                alt='logo'
                className="h-35 w-35 rounded-md"
              />
            </div>
          </a>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm onRegisterClick={toggleForm} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterForm onLoginClick={toggleForm} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/assets/background/loginBg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default LoginPage