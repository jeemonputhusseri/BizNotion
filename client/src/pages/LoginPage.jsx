import React, {useState} from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const successMessage = location.state?.message;
    const { login } = useAuth()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password }
            )
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">BizNotion</p>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>Sign in to your BizNotion account</CardDescription>
            </CardHeader>
            <CardContent>
                {successMessage && (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
                    {successMessage}
                </div>
                )}
                 {error && (
                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="minimum 8 characters"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in....' : 'Sign in'}
                    </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                No account?{' '}
                <Link to="/register" className="text-foreground font-medium hover:underline">
                    Register here
                </Link>
                </p>
            </CardContent>
        </Card>
        </div>
    )
}

export default LoginPage;