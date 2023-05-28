import { useContext, useState, useEffect } from 'react';

import { UserContext } from './UserContext';

const BASE_URL = 'https://frontend-take-home-service.fetch.com'

export default function BrowsePage() {
    const { user } = useContext(UserContext);
    const [allBreeds, setAllBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedZipCodes, setSelectedZipCodes] = useState([]);
    const [dogIds, setdogIds] = useState([]);
    const [dogs, setDogs] = useState([]);

    async function getAllBreeds() {
        try {
            const res = await fetch(`${BASE_URL}/dogs/breeds`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                setAllBreeds(data);
            }
            else {
                throw new Error('Failed to get breeds');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    async function getZipCodes() {
        try {
            const res = await fetch(`${BASE_URL}/locations/search`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    city: selectedCity,
                    states: [selectedState]
                })
            });
            if (res.status === 200) {
                const data = await res.json();
                setSelectedZipCodes(data.results.map((d) => d.zip_code));
            }
            else {
                throw new Error('Failed to get zip codes');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    async function getDogdogIds() {
        try {
            let url = `${BASE_URL}/dogs/search?`;
            if (selectedBreeds.length > 0 && selectedBreeds[0] !== 'all') {
                selectedBreeds.forEach((breed) => {
                    url += `&breeds=${breed}`;
                });
            }
            if (selectedZipCodes.length > 0) {
                selectedZipCodes.forEach((zipCode) => {
                    url += `&zipCodes=${zipCode}`;
                });
            }
            const res = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                setdogIds(data.resultIds);
            }
            else {
                throw new Error('Failed to get dogs');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    async function getDogs() {
        try {
            const res = await fetch(`${BASE_URL}/dogs`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dogIds)
            });
            if (res.status === 200) {
                const data = await res.json();
                setDogs(data);
            }
            else {
                throw new Error('Failed to get breeds');
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllBreeds();
        getDogdogIds();
    }, []);

    useEffect(() => {
        getDogs();
    }, [dogIds]);

    useEffect(() => {
        getDogdogIds();
    }, [selectedZipCodes])

    return (
        <div>
            <div>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
            </div>

            <label>Breed: </label>
            <select onChange={(e) => setSelectedBreeds([e.target.value])}>
                <option value="all">All</option>
                {allBreeds.map((breed) => (
                    <option value={breed}>{breed}</option>
                ))}
            </select>

            <label>City: </label>
            <input onChange={(e) => setSelectedCity(e.target.value)}></input>

            <label>State: </label>
            <input onChange={(e) => setSelectedState(e.target.value)}></input>

            <button onClick={getZipCodes}>SEARCH</button>

            <div>
                {dogs.map((dog) => (
                    <div>
                        <p>{dog.name}</p>
                        <p>{dog.breed}</p>
                        <p>{dog.zip_code}</p>
                        <img src={dog.img} alt={dog.name} />
                    </div>
                ))}
            </div>
        </div>
    );
}