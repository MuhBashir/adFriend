// GamesTab.tsx
import React, { useState } from 'react';

const GamesTab: React.FC = () => {
  const [ticTacToeCells, setTicTacToeCells] = useState<string[]>(
    Array(9).fill('')
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [rpsResult, setRpsResult] = useState('');

  // Tic Tac Toe logic
  const checkWin = (cells: string[]) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return winPatterns.some((pattern) =>
      pattern.every((index) => cells[index] === currentPlayer)
    );
  };

  const handleCellClick = (index: number) => {
    if (ticTacToeCells[index] || checkWin(ticTacToeCells)) return;

    const newCells = [...ticTacToeCells];
    newCells[index] = currentPlayer;
    setTicTacToeCells(newCells);

    if (checkWin(newCells)) {
      setTimeout(() => {
        alert(`${currentPlayer} wins!`);
        resetTicTacToe();
      }, 100);
    } else if (newCells.every((cell) => cell)) {
      setTimeout(() => {
        alert("It's a draw!");
        resetTicTacToe();
      }, 100);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetTicTacToe = () => {
    setTicTacToeCells(Array(9).fill(''));
    setCurrentPlayer('X');
  };

  // Rock Paper Scissors logic
  const playRPS = (playerChoice: string) => {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result;
    if (playerChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'You win!';
    } else {
      result = 'Computer wins!';
    }

    setRpsResult(
      `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`
    );
  };

  return (
    <div>
      {/* Tic Tac Toe */}
      <div className='card bg-base-200 mb-4'>
        <div className='card-body'>
          <h3 className='card-title'>Tic Tac Toe</h3>
          <div className='grid grid-cols-3 gap-1 w-48 mx-auto'>
            {ticTacToeCells.map((cell, index) => (
              <button
                key={index}
                className='btn btn-square h-16 w-16'
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>
          <button className='btn btn-sm mt-2' onClick={resetTicTacToe}>
            Reset Game
          </button>
        </div>
      </div>

      {/* Rock Paper Scissors */}
      <div className='card bg-base-200 mb-4'>
        <div className='card-body'>
          <h3 className='card-title'>Rock Paper Scissors</h3>
          <div className='flex gap-2'>
            {['rock', 'paper', 'scissors'].map((choice) => (
              <button
                key={choice}
                className='btn btn-primary'
                onClick={() => playRPS(choice)}
              >
                {choice === 'rock' && '✊'}
                {choice === 'paper' && '✋'}
                {choice === 'scissors' && '✌️'}
              </button>
            ))}
          </div>
          {rpsResult && <div className='mt-2 text-sm'>{rpsResult}</div>}
        </div>
      </div>
    </div>
  );
};

export default GamesTab;

// components/ChatBot.tsx
// import { useState, useRef, useEffect } from 'react';
// import OpenAI from 'openai';
// import ReactMarkdown from 'react-markdown';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   name?: string;
// }

// const ChatBot = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const openai = new OpenAI({
//     apiKey: process.env.REACT_APP_OPENAI_KEY,
//     dangerouslyAllowBrowser: true,
//   });

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newMessages: Message[] = [
//       ...messages,
//       { role: 'user', content: input, name: 'user' },
//     ];
//     setMessages(newMessages);
//     setInput('');
//     setIsLoading(true);
//     try {
//       const completion = await openai.chat.completions.create({
//         messages: newMessages,
//         model: 'gpt-3.5-turbo',
//       });

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content: completion.choices[0].message.content || '',
//         },
//       ]);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content: 'Sorry, I encountered an error. Please try again.',
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='flex flex-col h-[500px] bg-base-200 rounded-box p-4'>
//       <div className='flex-1 overflow-y-auto mb-4'>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`chat ${
//               msg.role === 'user' ? 'chat-end' : 'chat-start'
//             }`}
//           >
//             <div className='chat-bubble'>
//               <ReactMarkdown>{msg.content}</ReactMarkdown>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className='chat chat-start'>
//             <div className='chat-bubble'>Thinking...</div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSubmit} className='flex gap-2'>
//         <input
//           type='text'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className='input input-bordered flex-1'
//           placeholder='Type your message...'
//           disabled={isLoading}
//         />
//         <button type='submit' className='btn btn-primary' disabled={isLoading}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBot;
