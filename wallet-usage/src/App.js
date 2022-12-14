import logo from './logo.svg'
import './App.css'

import { EthereumClient, modalConnectors } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import Chart from './ChartHistory.js'

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
  const { address, isConnecting, isDisconnected } = useAccount()
  let transactions = []

  useEffect(() => {
    if (address) {
      //getTxHistory()
    }
  }, [isDisconnected, isConnecting])

  const getTxHistory = () => {
    etherScanProvider.getHistory(address).then((history) => {
      history.forEach((txHistory) => {
        transactions.push(txHistory)
        // console.log(txHistory)
      })
    })
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
          <h1 className="text-7xl subpixel-antialiased font-normal tracking-wide text-slate-100">
            Wallet Usage
          </h1>
          <img src={logo}></img>
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
        <Chart transactions={transactions}></Chart>
        <button onClick={() => getTxHistory()}>get history</button>
      </WagmiConfig>
    </div>
  )
}

export default App
