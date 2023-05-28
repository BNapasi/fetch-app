import { useContext, useState } from 'react';

import { UserContext } from './UserContext';

const BASE_URL = 'https://frontend-take-home-service.fetch.com'

export default function LoginPage() {
    const { setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const login = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email
                })
            });
            if (res.status === 200) {
                setUser({ name, email, authenticated: true });
            }
            else {
                throw new Error('Login failed');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    return (
        <div className="grid place-content-center h-screen">
            <h1 className="text-8xl font-bold flex justify-center content-center mb-4">FETCH</h1>

            <label>Name</label>
            <input id="name" className="border-2 mb-2" onChange={(e) => setName(e.target.value)}></input>

            <label>Email</label>
            <input id="email" className="border-2" onChange={(e) => setEmail(e.target.value)}></input>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={login}>Login</button>
        </div>
    );
}