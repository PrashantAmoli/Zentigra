// import { Toaster } from "sonner";
import "~styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
    <Component {...pageProps} />
    
    {/* <Toaster position="bottom-center" /> */}
    </>
  )
}
