import { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from './UserContext';

const BASE_URL = 'https://frontend-take-home-service.fetch.com'

export default function BrowsePage() {
    const { user, setUser } = useContext(UserContext);
    const [allBreeds, setAllBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedZipCodes, setSelectedZipCodes] = useState([]);
    const [dogIds, setdogIds] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

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

    return (
        <div className="grid place-content-center bg-gray-100">
            <div className="max-w-7xl">
                <div className="relative flex justify-between items-center py-5">
                    <h1 className="text-3xl font-bold">FETCH</h1>

                    <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-4">
                        <h2>{user.name}</h2>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </button>

                    {showDropdown && (
                        <div className="absolute z-50 top-16 right-0 bg-white drop-shadow p-5 grid gap-4">
                            <h1>{user.email}</h1>
                            <button onClick={() => setUser({ name: '', email: '', authenticated: false })} className="rounded-full bg-red-500 hover:bg-red-700 text-white py-2 px-4">Logout</button>
                        </div>
                    )}
                </div>

                <div className="flex pb-10">
                    <div className="flex flex-col">
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
                    </div>

                    <div className="grid gap-4 grid-cols-5">
                        {dogs.map((dog) => (
                            <div className="flex flex-col justify-center items-center rounded-2xl overflow-hidden bg-white drop-shadow">
                                <img src={dog.img} alt={dog.name} className="h-64 w-full object-cover"/>
                                <div className="text-center my-2">
                                    <p className="text-xl font-bold">{dog.name}</p>
                                    <p className="text-sm">{dog.breed}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}