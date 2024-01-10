import { Toaster } from "sonner";
import ClerkWrapper from "~components/ClerkWrapper";
import "~styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ClerkWrapper>
        <Component {...pageProps} />
      </ClerkWrapper>
      
      <Toaster position="bottom-center" />
    </>
  )
}
