'use client'
import { usePrepareContractWrite, useContractWrite, useAccount, useContractEvent } from 'wagmi'
import RockPaperScissors from '../artifacts/contracts/RockPaperScissors.sol/RockPaperScissors.json'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';


export default function Home() {
  
  const [bet, setBet] = useState(0)
  const [oppenent, setOppenent] = useState('')
  const [choice, setChoice] = useState(0)

  const { address } = useAccount()
	useContractEvent({
		address: '0x025f6807C11A95b3CF970674B2fE50534dD9aF9C',
		abi: RockPaperScissors.abi,
		eventName: 'ChallengeCreated',
		listener(log) {
			const data = log[0]
			const { player1, player2, gameId, betAmount } = data.args
			if (player2 === address) {
				const message = `${player1} invites you to play Rock, Paper, Scissors. Game ID is ${gameId}`
				toast.success(message)
			}
		},
	})


	useContractEvent({
		address: '0x025f6807C11A95b3CF970674B2fE50534dD9aF9C',
		abi: RockPaperScissors.abi,
		eventName: 'GameCompleted',
		listener(log) {
      console.log(log)
			const data = log[0]
			const { gameId, loser, reward, winner } = data.args
      const ethr = BigInt(reward) / BigInt("1000000000000000000n")
			if (loser === address) {
				const message = `You lost to ${winner}. Reward is ${ethr} ETH`
				toast.warning(message)
			}
			if (winner === address) {
				const message = `Congradulation! You win  ${ethr} ETH!!!`
				toast.warning(message)
			}
		},
	})


  const { config, error } = usePrepareContractWrite({
    address: '0x025f6807C11A95b3CF970674B2fE50534dD9aF9C',
    abi: RockPaperScissors.abi,
    functionName: 'createChallenge',
    value: parseEther(`${bet}`, "wei"),
    args: [oppenent, parseEther(`${bet}`, "wei"), choice],
  })


  const { write } = useContractWrite(config)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <p className="left-0 top-0 text-center flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit static w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          Assignment 2 <br /> by Sayranbekov Yerkanat, Pogolovkin Daniil, Grigoriyev Timur
        </p>
        <div className='bg-[rgba(255,255,255,0.1)] rounded-2xl py-12 px-5 backdrop-blur-md'>
          <div className=' flex flex-col gap-2 '>
            <h2>Create a Challenge</h2>
            <input
              type="text"
              placeholder="Opponent Address"
              value={oppenent}
              onChange={(e) => setOppenent(e.target.value)}
              className='bg-[rgba(255,255,255,0.1)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[rgba(255,255,255,0.1)] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
            <input
              type="number"
              step="0.001"
              placeholder="Bet Amount (ETH)"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className='bg-[rgba(255,255,255,0.1)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[rgba(255,255,255,0.1)] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
            <select
              onChange={(e) => setChoice(e.target.value)}
              className='bg-[rgba(255,255,255,0.1)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[rgba(255,255,255,0.1)] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
              <option value="0">Rock</option>
              <option value="1">Paper</option>
              <option value="2">Scissors</option>
            </select>
            <button onClick={write} className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
              Create Challenge
            </button>
          </div>
        </div>
      </div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white top-4 right-3'></div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white bottom-10 right-10'></div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white left-3 bottom-8'></div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white top-40 left-32'></div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white bottom-[50%] left-[50%]'></div>
      <div className=' absolute h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.2)] shadow-2xl shadow-white top-16 left-16'></div>
    </main>
  );
}
