import { useState } from "react"
import api from "../services/api"

export default function AIAssistant() {

  const [message,setMessage] = useState("")
  const [chat,setChat] = useState([])
  const [loading,setLoading] = useState(false)

  async function sendMessage(){

    if(!message.trim()) return

    const userMessage = {
      role:"user",
      text:message
    }

    setChat(prev => [...prev,userMessage])
    setLoading(true)

    try{

      const res = await api.post("/ai/chat",{
        message
      })

      const aiMessage = {
        role:"ai",
        text:res.data.reply
      }

      setChat(prev => [...prev,aiMessage])

    }catch(err){

      setChat(prev => [
        ...prev,
        {role:"ai",text:"AI assistant failed"}
      ])

    }

    setMessage("")
    setLoading(false)
  }

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        AI Inventory Assistant
      </h1>

      <div className="glass p-4 h-[400px] overflow-y-auto mb-4 space-y-3">

        {chat.length === 0 && (
          <p className="text-gray-400">
            Ask something like:  
            "Which products will run out next week?"
          </p>
        )}

        {chat.map((msg,index)=>(
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role==="user"
              ? "bg-indigo-600 text-white ml-auto"
              : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm opacity-60">
            AI is thinking...
          </div>
        )}

      </div>

      <div className="flex gap-2">

        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter") sendMessage()
          }}
          placeholder="Ask about your inventory..."
          className="flex-1 p-3 rounded-lg border bg-white/5"
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg"
        >
          Send
        </button>

      </div>

    </div>
  )
}