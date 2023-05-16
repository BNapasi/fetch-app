import { useContext, useState, useEffect } from 'react';

import { UserContext } from './UserContext';

const BASE_URL = 'https://frontend-take-home-service.fetch.com'

export default function BrowsePage() {
    const { user } = useContext(UserContext);
    const [dogs, setDogs] = useState([]);

    const getDogs = async () => {
        try {
            const res = await fetch(`${BASE_URL}/dogs/breeds`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                setDogs(data);
            }
            else {
                throw new Error('Dog search failed');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getDogs();
    }, []);

    return (
        <div>
            <div>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
            </div>

            <ul>
                {dogs.map((dog) => (
                    <li key={dog}>{dog}</li>
                ))}
            </ul>
        </div>
    );
}