import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { Toaster } from "react-hot-toast";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
    <ThirdwebProvider
      supportedChains={[Sepolia]}
      activeChain={Sepolia}
      // supportedWallets={[metamaskWallet()]}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <Component {...pageProps} />
      <Toaster />
    </ThirdwebProvider>
  );
}

export default MyApp;
