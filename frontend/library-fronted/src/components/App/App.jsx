import React, { useState, useEffect, useContext, useRef } from 'react'
import './App.css';
import BookList from './../BookList/BookList';
import NavbarMain from './../Navbar/NavbarMain';
import Navbar from './../Navbar/Navbar';
import SignUp from './../SignUp/SignUp';
import Login from './../Login/Login';
import Borrowings from './../MyAccount/Borrowings/Borrowings';
import PersonalData from './../MyAccount/PersonalData/PersonalData';
import BookDetails from './../BookDetails/BookDetails';
import Events from './../Events/Events';
import Footer from './../Footer/Footer';
import Contact from './../Contact/Contact';
import ProtectedRoute from './../ProtectedRoute/ProtectedRoute';
import { UserContext } from './../../contexts/UserContext';
import ChatbotIcon from "./../Chatbot/ChatbotIcon";
import ChatForm from "./../Chatbot/ChatForm";
import ChatMessage from "./../Chatbot/ChatMessage";
import {booksInfo} from "./../booksInfoForChat";
import { useDebounce } from '../../hooks/useDebounce';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';


function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: 'model',
    text: booksInfo
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const { user } = useContext(UserContext);

  const chatBodyRef = useRef();

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error:", err));

    fetch("http://localhost:3000/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error while retrieving species: ", err));
  }, [])

  const fetchBooks = async (term) => {
    try {
      const response = await fetch(`http://localhost:3000/books?search=${term}`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error while retriving data:", err);
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchBooks(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genre === selectedGenre)
    : books;
  const location = useLocation();

  const generateBotResponse = async (history) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: history.map(({ role, text }) => ({
          role: role === 'user' ? 'user' : 'model',
          parts: [{ text }]
        }))
      })
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }

      const botResponse = data.candidates[0].content.parts[0].text;

      setChatHistory(prev => {
        const newHistory = [...prev];
        const thinkingIndex = newHistory.findLastIndex(msg => msg.text === "Thinking..");

        if (thinkingIndex !== -1) {
          newHistory[thinkingIndex] = { role: "model", text: botResponse };
        } else {
          newHistory.push({ role: "model", text: botResponse });
        }

        return newHistory;
      });

    } catch (error) {
      console.error("Error:", error);

      setChatHistory(prev => {
        const newHistory = [...prev];
        const thinkingIndex = newHistory.findLastIndex(msg => msg.text === "Thinking..");

        if (thinkingIndex !== -1) {
          newHistory[thinkingIndex] = {
            role: "model",
            text: "Sorry, something went wrong. Please try again."
          };
        }

        return newHistory;
      });
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
  }, [chatHistory])

  return (
    <>
      <div className="wrapper">
        {location.pathname === '/' ?
          (<NavbarMain
            onSearchChange={setSearchTerm}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            genres={genres}
            searchTerm={searchTerm}
          />) : (<Navbar />)}
        <Routes>
          <Route path="/" element={<BookList books={filteredBooks} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details/:isbn" element={<BookDetails />} />
          <Route
            path="/my-borrowings"
            element={
              <ProtectedRoute>
                <Borrowings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-data"
            element={
              <ProtectedRoute>
                <PersonalData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events" element={<Events />}
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <button
          onClick={() => setShowChatbot(prev => !prev)}
          id="chatbot-toggler"
        >
          <span className="material-symbols-rounded">
            {showChatbot ? 'close' : 'mode_comment'}
          </span>
        </button>

        {/* Chatbot Popup - show when only showChatbot = true */}
        <div className={`chatbot-popup ${showChatbot ? 'show-chatbot' : ''}`}>
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">Chatbot</h2>
            </div>
            <button
              className="material-symbols-rounded"
              onClick={() => setShowChatbot(false)}
            >
              keyboard_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey there 👋 <br />
                How can I help you today?
              </p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chat-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      </div>

      <div className="footer"><Footer /></div>
    </>
  );
}

export default App
