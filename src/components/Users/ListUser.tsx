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
  
  useEffect(() => {
    fetch(USERS)
      .then(res => res.json())
      .then((data) => setUsers(data as User[]))
  }, [setUsers]);

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
        <h1 className="users-title">Create an user</h1>
        <input type="text" id="name" placeholder="Name" disabled={isLoading}/>
        <button type='submit' disabled={isLoading}>Create</button>
      </form>
    </div>
  )
}
export default ListUser