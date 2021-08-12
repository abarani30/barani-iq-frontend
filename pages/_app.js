import "antd/dist/antd.css";
import "../styles/globals.scss";
import { SWRConfig } from "swr";
import Cookies from "js-cookie";

function MyApp({ Component, pageProps }) {
  const fetcher = async (url) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        token: Cookies.get("authToken"),
      },
    });
    const data = await res.json();
    return data;
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
