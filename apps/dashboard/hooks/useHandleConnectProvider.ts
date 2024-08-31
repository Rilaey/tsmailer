import { useRouter } from "next/router";

export const useHandleConnectProvider = () => {
  const router = useRouter();

  const handleConnectProvider = async (provider: string) => {
    // Since AOL is owned by yahoo, they utilize the same oauth flow.
    if (provider == "aol") {
      provider = "yahoo";
    }
    router.push(
      `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/${provider}/connect`
    );
  };

  return {
    handleConnectProvider
  };
};
