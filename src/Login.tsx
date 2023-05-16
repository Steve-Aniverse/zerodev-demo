import { createStyles, Title, Text, Container, Flex } from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactComponent as ZeroDevLogo } from './resources/assets/images/logo.svg';
import {
  WagmiConfig,
  configureChains,
  createClient,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,

} from "wagmi"; 
import React, { useState, useEffect,useMemo } from 'react';
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { getZeroDevSigner,getRPCProviderOwner } from '@zerodevapp/sdk';
import { LoginProvider, ZeroDevWeb3Auth, } from '@zerodevapp/web3auth'
import { polygonMumbai } from 'wagmi/chains'
import { JWTWalletConnector, Auth0WalletConnector, } from '@zerodevapp/wagmi'
const defaultProjectId = process.env.REACT_APP_ZERODEV_PROJECT_ID || '30e532d0-5603-4879-a4c2-c3d2b17238a4'
// import { ZeroDevSigner, } from '@zerodevapp/sdk'
const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
  },
}));

const infuraKey = 'https://polygon-mumbai.infura.io/v3/489d57490a5a4893a6e9b0790ca2bde3'


// export function Login() {
//   const { classes } = useStyles();

//   return (
//     <Container h={'100vh'}>
//       <Flex justify={"center"} align="center" mih={'100%'} direction={'column'} gap={30}>
//         <ZeroDevLogo width={300} height={'100%'} />
//         <Title className={classes.title}>
//           Supercharge Web3 UX with<br />
//           <Text component="span" className={classes.highlight} inherit>
//             Account Abstraction
//           </Text>
//         </Title>
//         <ConnectButton label={"Start Demo"} />
        
//         ZeroDev will create an AA wallet for you using social accounts.
//       </Flex>
//     </Container>
//   );
// }



// JWT
export function Login() {
  const [jwt, setJWT] = useState('')
  const userId = window.crypto.getRandomValues(new Uint32Array(4)).join('-')

  useEffect(() => {
      fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
          response.text().then(setJWT)
      })
  }, [])

  const { chains, provider, webSocketProvider } = configureChains(
      [polygonMumbai],
[publicProvider()],
      // [infuraProvider({apiKey: infuraKey})],
  )
  const client = createClient({
      autoConnect: false,
      provider,
      webSocketProvider,
  })
  console.log('pro', defaultProjectId);
  const jwtConnector = new JWTWalletConnector({chains, options: {
      projectId: defaultProjectId,
      jwt: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtNTNiYm1lMHRmbzdhY2g3Mi51cy5hdXRoMC5jb20vIn0..hSig1W4B8sTPogeM.WPge8O_m8Q2A5bRsuYVQyYR0-CwQHx0JcQ278QlLKCasrbL6AvsB7colAXSdWAATXC2qwcPfn98LrP6A6FdMYWjZ8u3HnCIqIaUyIMPzkQLJ4QQAUYRsb_qAr2kWLIB21FwlV21Do33aR0GhnRdSC13KuFuQLovq0LUn_XLNX-D9qS01yyf9_GpNRNLmWjCWlScjhq0UqXgZXKc7XnhT8jL99GyCCqBWy4po9e5hrk8UMYrGzV8YOUqh5LnfRJWCpAm_XU62fUCk2jV6svd2sr5skgjPTCHuL2WOUtMLiTB5F3lLak0D-LoyN9h3STsSA2TGw9wMXOTPnDFoki_XJKCPrlzKHi2T5aKbs1jVu18X07M6C00525ePVsV08wlzOg.E7-7eiyHRibR9CAtsv0jgw'
  }})

  const auth0Connector = new Auth0WalletConnector({chains, options: {
    projectId: defaultProjectId,
}})


  const ConnectButton = () => {

      const [loading, setLoading] = useState(false)
      const { connect, error, isLoading, pendingConnector } = useConnect()
      const { address, connector, isConnected } = useAccount()
      const { disconnect } = useDisconnect()
      const { chain } = useNetwork()

      const connectWallet = async () => {
          setLoading(true)
          await connect({
              connector: jwtConnector
              // connector: auth0Connector
          })
          setLoading(false)
      }



      if (isConnected) {
          return (
              <div>
                  <div>{address}</div>
                  {/* <div>Connected to {connectWallet.name}</div> */}
                  {/* <a href={`${chain.blockExplorers.default.url}/address/${address}`} target="_blank">Explorer</a><br /> */}
                  <button onClick={() => {
                    disconnect()
                    fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
                        response.text().then(setJWT)
                    })
                  }}>Disconnect</button>
              </div>
          )
      }
      return (
          <button disabled={isLoading || loading || !jwt} onClick={connectWallet}>
              {isLoading || loading ? 'loading...' : 'Connect with JWT'}
          </button>
      )
}

return (
  <WagmiConfig client={client}>
    <ConnectButton />
  </WagmiConfig>
)
}
