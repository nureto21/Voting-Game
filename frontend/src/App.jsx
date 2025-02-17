import React, { useState, useEffect } from 'react'
import axios from 'axios'

const BACKEND_URL = '/api'; // Backend URL for API requests

const App = () => {
  // State for storing the current joke
  const [joke, setJoke] = useState(null);

  // Function to fetch a new joke from the backend
  const getJoke = async () => {
    try {
      // GET request to the backend to fetch a joke
      const { data } = await axios.get(`${BACKEND_URL}/joke`);
      setJoke(data); // Update the joke state with the new joke
    } catch (error) { // If the request fails: 
      console.error("Error fetching joke");
    };
  };

  // Function for voting
  const vote = async (emoji) => {
    if (!joke) return; // Return if no joke loaded

    // Update votes UI before sending request to backend
    setJoke(prev => ({
      ...prev,
      votes: { ...prev.votes, [emoji]: prev.votes[emoji] + 1 }
    }));

    try {
      // POST request to backend to register the vote
      const { data } = await axios.post(`${BACKEND_URL}/joke/vote`, {
        jokeID: joke.jokeID, // Send the joke iD
        emoji // Send the voted emoji
      });
      // Update the joke state with the updated votes from the backend
      setJoke(data);
    } catch (error) { // If the request fails: 
      console.error("Error voting");
    }
  };

  // Fetch a joke when the component mounts
  useEffect(() => { getJoke(); }, []);

  return (
    // Background
    <div className='h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white'>
      {joke ? (
        // Main joke container
        <div className='w-[500px] bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center border border-white/20'>
          <h2 className='text-3xl font-bold mb-4 text-gray-200'>{joke?.question}</h2>
          <p className='text-xl text-gray-300 mb-6'>{joke?.answer}</p>
          {/* Voting buttons */}
          <div className='flex justify-around mt-6'>
            {Object.entries(joke?.votes || {}).map(([emoji, count]) => (
              <button
                key={emoji}
                className='w-20 h-20 flex flex-col items-center justify-center text-4xl bg-white/20 hover:bg-white/30 rounded-xl transition transform hover:scale-110'
                onClick={() => vote(emoji)}>
                {emoji}
                <span className='mt-2 text-lg font-semibold'>{count}</span>
              </button>
            ))}
          </div>
          {/* Next joke button */}
          <button
            onClick={getJoke}
            className='mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition duration-200'
          > Next Joke
          </button>
        </div>
      ) : (
        // Loading message while waiting for a joke to load
        <p className='text-lg font-semibold'>Loading joke...</p>
      )
      }
    </div >
  );
}

export default App