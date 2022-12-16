import logo from './logo.svg'
import './App.css'

import { EthereumClient, modalConnectors } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import {
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useNetwork,
} from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Chart from './ChartHistory.js'
import DisplayTransactions from './DisplayTransactions.js'

const chains = [arbitrum, mainnet, polygon]

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

let etherScanProvider = new ethers.providers.EtherscanProvider()

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function App() {
  const { chain } = useNetwork()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    if (address) {
      getTxHistory()
    }
  }, [isDisconnected, isConnecting])

  const handleMonthUpdate = (value) => {
    setSelectedMonth(value)
  }

  const getTxHistory = () => {
    let tempTransactions = []
    etherScanProvider.getHistory(address).then((history) => {
      history.forEach((txHistory) => {
        tempTransactions.push(txHistory)
        // console.log(txHistory)
      })
    })
    setTransactions(tempTransactions)
    console.log(transactions)
  }

  return (
    <div className="bg-slate-900 sm:px-0 px-5">
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
          <form className="group relative w-full sm:w-80 sm:pt-0 pt-4">
            <input
              className="bg-slate-800 focus:ring-2 focus:#794DFF focus:outline-none appearance-none w-full text-sm leading-6 text-white placeholder-slate-200 rounded-md py-2 pl-2 ring-1 ring-slate-700 shadow-sm disabled:bg-slate-700"
              type="text"
              aria-label="Search Address"
              placeholder="Search Address.."
              disabled={!isDisconnected ? 'disabled' : ''}
            ></input>
          </form>
          <Web3Button />
        </div>
        <Chart
          transactions={transactions}
          handleMonthUpdate={handleMonthUpdate}
        />
        <DisplayTransactions selectedMonth={selectedMonth} />
        <button onClick={() => getTxHistory()}>get history</button>
      </WagmiConfig>
    </div>
  )
}

export default App
