
import { Chat } from 'react-ui-chat'
import "react-ui-chat/tailwind.css"
import { TMessage } from 'react-ui-chat/types'
import useUser from "../../hooks/useUser"
import ListUser from "../Users/ListUser"

const ChatContainer = () => {
  const { currentUser, targetUser, messages, sendMessage } = useUser()

  return (
    <>
      {currentUser && targetUser
        ? <Chat
          messages={messages}
          onMessageSend={(msgObj: TMessage) => sendMessage(msgObj.message)}
        />
        : <ListUser />}
    </>
  )
}
export default ChatContainer