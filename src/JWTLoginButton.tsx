import { Button } from '@mantine/core';
import { useConnect } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JWTWalletConnector } from "@zerodevapp/wagmi";

const defaultProjectId = process.env.REACT_APP_ZERODEV_PROJECT_ID || 'b5486fa4-e3d9-450b-8428-646e757c10f6'
const userId = window.crypto.getRandomValues(new Uint32Array(4)).join('-')

export function JWTLoginButton() {
  const { connect } = useConnect()


  const [jwt, setJWT] = useState<string>()
  useEffect(() => {
    fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
        response.text().then(setJWT)
    })
  }, [])

  const connector = useMemo(() => {
    if (jwt) {
      return new JWTWalletConnector({options: {
        projectId: defaultProjectId,
        jwt
      }})
    }
  }, [jwt])

  const handleLogin = useCallback(() => {
    if (connector) connect({connector})
  }, [connect, connector])
  
  return <Button disabled={!connector} onClick={handleLogin}>Start JWT Demo</Button>
}