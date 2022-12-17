import logo from './logo.svg'
import './App.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ethers } from 'ethers'
import { useState, useRef } from 'react'
import Chart from './ChartHistory.js'
import DisplayTransactions from './DisplayTransactions.js'
import axios from 'axios'
import { SpinnerCircular } from 'spinners-react'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID

let etherProvider = new ethers.providers.InfuraProvider(
  'mainnet',
  INFURA_PROJECT_ID,
)

function App() {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [loading, setLoading] = useState(null)
  const inputRef = useRef(null)

  const handleMonthUpdate = (value) => {
    setSelectedMonth(value)
  }

  const callSetTransactions = async (addr) => {
    let tempTransactions = []
    try {
      const history = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${addr}&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
      )
      history.data.result.forEach((txHistory) => {
        tempTransactions.push(txHistory)
      })
    } catch (e) {
      setLoading(false)
      toast('Error', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
    }
    setTransactions(tempTransactions)
    setLoading(false)
  }

  const getTxHistory = async (searchAddress) => {
    if (searchAddress) {
      if (ethers.utils.isAddress(searchAddress)) {
        callSetTransactions(searchAddress)
      } else {
        setLoading(false)
        toast('Invalid Address', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        })
      }
    }
  }

  const getAddressFromENS = async (ens) => {
    try {
      var addr = await etherProvider.resolveName(ens)
      return addr
    } catch (e) {
      return null
    }
  }

  const searchWithWallet = async (e) => {
    setLoading(true)
    e.preventDefault()
    let addr = await getAddressFromENS(inputRef.current.value)
    if (addr) {
      inputRef.current.value = null
      getTxHistory(addr)
    } else {
      inputRef.current.value = null
      getTxHistory(inputRef.current.value)
    }
  }

  return (
    <div className="bg-slate-900 sm:px-0 px-5 flex flex-col min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex justify-center space-x-4 pt-20 pb-10">
        <h1 className="text-4xl sm:text-6xl subpixel-antialiased font-normal tracking-wide text-slate-100 ">
          Wallet Usage
        </h1>
        <img src={logo} className="w-10 sm:w-16"></img>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-center space-x-0 sm:space-x-4 pt-11">
        <form
          className="group relative w-full sm:w-80 sm:pt-0 pt-4"
          onSubmit={searchWithWallet}
        >
          <input
            className="bg-slate-800 focus:ring-2 focus:#794DFF focus:outline-none appearance-none w-full text-sm leading-6 text-white placeholder-slate-200 rounded-md py-2 pl-2 ring-1 ring-slate-700 shadow-sm disabled:bg-slate-700"
            aria-label="Search Address"
            placeholder="Search Address or ENS.."
            // disabled={!isDisconnected ? 'disabled' : ''}
            ref={inputRef}
          ></input>
        </form>
        {/* <Web3Button /> */}
      </div>
      {loading && (
        <div className="flex justify-center pt-11">
          <SpinnerCircular
            size={37}
            thickness={127}
            speed={100}
            color="#A978C4"
          />
        </div>
      )}
      {transactions && (
        <>
          {' '}
          <Chart
            transactions={transactions}
            handleMonthUpdate={handleMonthUpdate}
          ></Chart>
          <DisplayTransactions selectedMonth={selectedMonth} />
        </>
      )}
      <footer className=" w-full py-4  text-center text-gray-700 mt-auto">
        Made by{' '}
        <a
          href="https://twitter.com/npm_luko"
          target="_blank"
          className="font-bold text-blue-500 hover:text-blue-800"
        >
          @npm_luko
        </a>
      </footer>
    </div>
  )
}

export default App
