import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "@/api/axios"
import { error_toast, info_toast, sucess_toast } from "@/utils/toastNotification"
import { useStateContext } from "@/contexts/ContextProvider"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RegisterForm({ className, onLoginClick, ...props }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role:''
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { setUserInfo } = useStateContext()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { username, email, password, confirmPassword, role } = formData

      // Validation
      if (!username || !email || !password || !confirmPassword || !role) {
        info_toast("All fields are required")
        return
      }

      if (password !== confirmPassword) {
        info_toast("Passwords do not match")
        return
      }

      const response = await axios.post('/auth/register', {
        username,
        email,
        password,
        role
      })

      setUserInfo(response.data)
      sucess_toast("Registration successful")
      onLoginClick()

    } catch (error) {
      console.error('Registration error:', error)
      error_toast(error.response?.data?.message || "Registration failed")
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
        <h1 className="text-2xl font-bold">Create a new Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={handleRoleChange} value={formData.role} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abonné">Abonné</SelectItem>
              <SelectItem value="journaliste">Journaliste</SelectItem>
            </SelectContent>
          </Select>
        </div>
          
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </button>
      </div>
    </form>
  )
}
