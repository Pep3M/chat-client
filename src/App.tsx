import ChatContainer from './components/Chat/ChatContainer'
import UserProvider from './context/userContext'

function App() {

  return (
    <UserProvider>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}>
        <ChatContainer />
      </div>
    </UserProvider>
  )
}

export default App
