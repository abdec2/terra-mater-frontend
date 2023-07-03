import * as React from 'react'
import { usePublicClient  } from 'wagmi'
import Web3 from 'web3'


export function publicClientToProvider(publicClient) {
  const { chain, transport } = publicClient
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   }
  if (transport.type === 'fallback') {
      return new Web3.providers.HttpProvider(transport?.transports[0].value.url)
  }

    return new Web3.providers.HttpProvider(transport.url)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId } = {}) {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}
