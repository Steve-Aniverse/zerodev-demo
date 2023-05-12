import React from "react";
import {
  WagmiConfig,
  configureChains,
  createClient,
} from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai } from 'wagmi/chains'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
})

function ZeroDevWrapper({children}: {children: React.ReactNode}) {

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper