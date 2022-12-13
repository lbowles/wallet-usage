import logo from './logo.svg'
import './App.css'

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

const chains = [arbitrum, mainnet, polygon]

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({
    projectId: 'e38c7975262940ae960b8b2a7c841248',
  }),
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function App() {
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <div className="bg-slate-900">
      <Web3Modal
        projectId="e38c7975262940ae960b8b2a7c841248"
        ethereumClient={ethereumClient}
      />

      <div className="flex justify-center space-x-4 ">
        <h1 class="text-7xl subpixel-antialiased font-normal tracking-wide text-slate-100">
          Wallet Usage 📈
        </h1>
      </div>

      <WagmiConfig client={wagmiClient}>
        <div className="flex flex-row h-screen justify-center space-x-4 pt-10">
          <form class="group relative w-80">
            <input
              class="bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none w-full text-sm leading-6 text-white placeholder-slate-200 rounded-md py-2 pl-2 ring-1 ring-slate-700 shadow-sm"
              type="text"
              aria-label="Search Address"
              placeholder="Search Address..."
            ></input>
          </form>
          <Web3Button />
        </div>
      </WagmiConfig>
    </div>
  )
}

export default App
