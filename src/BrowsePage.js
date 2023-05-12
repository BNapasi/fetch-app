import { useContext } from 'react';

import { UserContext } from './UserContext';

export default function LoginPage() {
    const { user } = useContext(UserContext);

    return (
        <div>
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
        </div>
    );
}