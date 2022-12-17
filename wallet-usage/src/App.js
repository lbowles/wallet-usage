import logo from './logo.svg'
import './App.css'

import { EthereumClient, modalConnectors } from '@web3modal/ethereum'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Web3Modal, Web3Button } from '@web3modal/react'
import {
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useNetwork,
  getAddress,
} from 'wagmi'
import { disconnect } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { ethers } from 'ethers'
import { useEffect, useState, useRef } from 'react'
import Chart from './ChartHistory.js'
import DisplayTransactions from './DisplayTransactions.js'
import axios from 'axios'

const chains = [mainnet]
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// Wagmi client
const { provider } = configureChains(chains, [
  infuraProvider({
    projectId: 'e38c7975262940ae960b8b2a7c841248',
  }),
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
})

let etherProvider = new ethers.providers.InfuraProvider(
  'mainnet',
  'e38c7975262940ae960b8b2a7c841248',
)

// Web3Modal Ethereum Client
const ethereumClient = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/e38c7975262940ae960b8b2a7c841248',
)

function App() {
  const { chain } = useNetwork()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isDisconnected) {
      setTransactions(null)
    }
    if (isConnecting) {
      inputRef.current.value = null
    }
    if (address || isConnected) {
      getTxHistory()
    }
  }, [isConnected, isDisconnected])
  //isDisconnected, isConnecting

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
  }

  const getTxHistory = async (searchAddress) => {
    if (searchAddress) {
      if (ethers.utils.isAddress(searchAddress)) {
        callSetTransactions(searchAddress)
      } else {
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
    } else {
      if (ethers.utils.isAddress(address)) {
        callSetTransactions(address)
      } else {
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
    e.preventDefault()
    let addr = await getAddressFromENS(inputRef.current.value)
    if (addr) {
      await disconnect()
      inputRef.current.value = null
      getTxHistory(addr)
    } else {
      await disconnect()
      inputRef.current.value = null
      getTxHistory(inputRef.current.value)
    }
  }

  return (
    <div className="bg-slate-900 sm:px-0 px-5">
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
      <Web3Modal
        themeColor="purple"
        projectId="e38c7975262940ae960b8b2a7c841248"
        ethereumClient={ethereumClient}
      />
      {/* //TODO add ENS support */}
      <WagmiConfig client={wagmiClient}>
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
          <Web3Button />
        </div>
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
        <footer className="fixed bottom-0 w-full py-4  text-center text-gray-700">
          Made by{' '}
          <a
            href="https://twitter.com/npm_luko"
            className="font-bold text-blue-500 hover:text-blue-800"
          >
            @npm_luko
          </a>
        </footer>
      </WagmiConfig>
    </div>
  )
}

export default App
