import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { TMessage } from "react-ui-chat/types";
import { io } from "socket.io-client";

type User = {
  id: number;
  name: string;
}

type UserContext = {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  targetUser: User | null;
  setTargetUser: (user: User) => void;
  messages: TMessage[];
  sendMessage: (message: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<UserContext>({
  users: [],
  setUsers: () => { },
  currentUser: null,
  setCurrentUser: () => { },
  targetUser: null,
  setTargetUser: () => { },
  messages: [],
  sendMessage: () => { },
});

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);

  const socket = useMemo(() => currentUser && targetUser && io(
    'http://localhost:4000',
    {
      auth: {
        user_id: currentUser?.id,
        target_user_id: targetUser?.id,
      },
    }
  ), [currentUser, targetUser]);

  useEffect(() => {
    if (!socket) return;
    if (socket.connected) return;

    socket.connect();

    socket.on('chat message', (msg, serverOffset, currentUser) => {
      console.log('response from server', msg, serverOffset, currentUser);
      setMessages((prevMessages) => [
        ...prevMessages,
        msg,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, currentUser]);

  const sendMessage = useCallback((message: string) => {
    if (!socket) return;
    socket.emit('chat message', message);
  }, [socket]);

  const value = useMemo(() => ({
    users, setUsers,
    currentUser, setCurrentUser,
    targetUser, setTargetUser,
    messages, sendMessage,
  } as UserContext),
    [
      users, setUsers,
      currentUser, setCurrentUser,
      targetUser, setTargetUser,
      messages, sendMessage,
    ]);

  return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
  )
}