import { useEffect, useState } from 'react'
import './styles/listUser.css'
import { USERS } from '../../routes/paths'
import useUser from '../../hooks/useUser';

type User = {
  id: number;
  name: string;
}

const ListUser = () => {
  const { users, setUsers, currentUser, setCurrentUser, setTargetUser } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [toExpenseFetch, setToExpenseFetch] = useState(false);

  // fetch users
  useEffect(() => {
    setIsLoadingUsers(true)
    fetch(USERS)
      .then(res => res.json())
      .then((data) => setUsers(data as User[]))
      .finally(() => setIsLoadingUsers(false))
  }, [setUsers]);

  // handle expense request
  useEffect(() => {
    if (isLoadingUsers) {
      const timer = setTimeout(() => {
        setToExpenseFetch(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setToExpenseFetch(false);
    }
  }, [isLoadingUsers]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const name = (document.getElementById('name') as HTMLInputElement).value
    if (!name) return alert('Name is required'), setIsLoading(false)

    fetch(USERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then((data) => {
        setUsers([...users, data as User]);
        (document.getElementById('name') as HTMLInputElement).value = ''
      })
      .finally(() => setIsLoading(false))
  }
  
  return (
    <div className='users-container'>
      {isLoadingUsers && <h2>Fetching users...</h2>}
      {toExpenseFetch && <h3>Please, wait a moment in time the server is waking up...</h3>}
      
      {!currentUser && users.length > 0 ? <div >
        <h1 className="users-title">Choose your user</h1>
        <div className="users-list">
          {users.map(user => (
            <button key={user.id} onClick={() => setCurrentUser(user)}>{user.name}</button>
          ))}
        </div>
      </div> : currentUser && <span>Your are {currentUser.name}</span>}

      {currentUser && <div>
        <h1 className="users-title">Choose your target user</h1>
        <div className="users-list">
          {users.map(user => (
            user.id !== currentUser.id && <button key={user.id} onClick={() => setTargetUser(user)}>{user.name}</button>
          ))}
        </div>
      </div>}

      {/* create an user */}
      <form onSubmit={handleSubmit} >
        <h1 className="users-title">{!isLoading ? 'Create an user' : 'Creating...'}</h1>
        <input type="text" id="name" placeholder="Name" disabled={isLoading}/>
        <button type='submit' disabled={isLoading}>Create</button>
      </form>
    </div>
  )
}
export default ListUser