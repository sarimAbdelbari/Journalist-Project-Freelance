import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "@/api/axios"
import { error_toast, sucess_toast } from "@/utils/toastNotification"
import { useStateContext } from "@/contexts/ContextProvider"
import Cookies from "js-cookie"
export function LoginForm({
  className,
  onRegisterClick,
  ...props
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const { setUserInfo } = useStateContext()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = formData

      const response = await axios.post('/auth/login', {
        email,
        password
      })

      //  response.data.token
      Cookies.set('token', response.data.token, { expires: 7 }) // Set token in cookies for 7 days
   
      setUserInfo(response.data.user)
      sucess_toast(response.data.message || "Login successful")


      navigate('/articles')

    } catch (error) {
      console.error('Login error:', error)
      error_toast(error.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="underline underline-offset-4 hover:text-primary cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  )
}
