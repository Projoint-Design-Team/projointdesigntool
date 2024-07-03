import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DocProvider } from "../context/document_context";
import AttributeProvider from "../context/attributes_context";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Layout from "@/components/ui/layout";
import { DownloadProvider } from "@/context/download_context";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(router.asPath.split("/")[1]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setLoading(true);
    };

    const handleRouteChangeComplete = (url: string) => {
      setActiveItem(url.split("/")[1]);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    // Add event listeners for route changes
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // Clean up event listeners
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <DocProvider>
      <AttributeProvider>
        <DownloadProvider>
          <Layout active={activeItem} loading={loading}>
            <Component {...pageProps} />
          </Layout>
        </DownloadProvider>
      </AttributeProvider>
    </DocProvider>
  );
}

export default MyApp;
