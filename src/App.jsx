import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { IoMdFitness } from 'react-icons/io';
import { GiMeal } from 'react-icons/gi';
import './index.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Replace with your actual Render backend URL
  const BACKEND_URL = "https://backend-chatbot-9cp9.onrender.com/";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userMessage.trim() || loading) return;

    const userEntry = { role: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, userEntry]);
    setUserMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userEntry.text }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      const botEntry = { role: 'bot', text: data.reply };
      setChatHistory((prev) => [...prev, botEntry]);
    } catch (err) {
      console.error("API Error:", err);
      setChatHistory((prev) => [...prev, { 
        role: 'bot', 
        text: '⚠️ Failed to connect to the server. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-600 rounded-lg">
            <IoMdFitness className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            CityGym AI
          </h1>
        </div>
        <div className="text-xs bg-gray-700 px-3 py-1 rounded-full flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span>Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-4xl flex-1 flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="mb-6 p-4 bg-gray-700/50 rounded-full">
                <FaRobot className="text-4xl text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Welcome to CityGym AI</h3>
              <p className="max-w-md mb-6">
                I'm your personal fitness and nutrition assistant. Ask me about workout routines, meal plans, or health tips!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                <button 
                  onClick={() => setUserMessage("Create a 7-day weight loss meal plan")}
                  className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm flex items-center"
                >
                  <GiMeal className="mr-2 text-cyan-400" />
                  Meal Plans
                </button>
                <button 
                  onClick={() => setUserMessage("Best exercises for core strength")}
                  className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm flex items-center"
                >
                  <IoMdFitness className="mr-2 text-cyan-400" />
                  Workout Tips
                </button>
              </div>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] flex items-start gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 mt-1 ${
                      msg.role === 'user'
                        ? 'text-blue-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <FaUser className="text-lg" />
                    ) : (
                      <FaRobot className="text-lg" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl text-sm whitespace-pre-line transition-all duration-200 ${
                      msg.role === 'user'
                        ? 'bg-blue-600/90 text-white rounded-br-none'
                        : 'bg-gray-700/80 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] flex items-start gap-3">
                <div className="text-cyan-400 mt-1">
                  <FaRobot className="text-lg" />
                </div>
                <div className="bg-gray-700/80 text-gray-100 px-4 py-3 rounded-xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700/50 p-4 bg-gray-800/30">
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 bg-gray-700/50 text-white rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
              placeholder="Ask about workouts, nutrition, or health..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !userMessage.trim()}
              className={`p-3 rounded-lg transition-all duration-200 ${
                loading || !userMessage.trim()
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            CityGym AI provides AI-generated advice. Consult a professional for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;