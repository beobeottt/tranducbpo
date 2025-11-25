// AiChat.tsx
import { useState } from 'react';
import axiosInstance from '../api/axios';


export default function AiChat() {
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState<{role:string, text:string}[]>([]);

  const send = async () => {
    setMessages(prev => [...prev, {role:'user', text: q}]);
    const res = await axiosInstance.post('/ai/chat', { message: q });
    setMessages(prev => [...prev, {role:'bot', text: res.data.reply}]);
    setQ('');
  };

  return (
    <div>
      {messages.map((m,i) => <div key={i} className={m.role==='user'?'text-right':'text-left'}>{m.text}</div>)}
      <input value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
