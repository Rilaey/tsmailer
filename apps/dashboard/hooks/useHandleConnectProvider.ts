import { useRouter } from "next/router";

export const useHandleConnectProvider = () => {
  const router = useRouter();

  const handleConnectProvider = async (provider: string) => {
    // This is for the vercel logs
    // Will remove once env is verified :)
    console.log(process.env.NEXT_PUBLIC_DASHBOARD_API_URL);

    switch (provider) {
      case "gmail":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/google/connect`
        );
        break;
      case "yahoo":
      case "aol":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/yahoo/connect`
        );
        break;
      case "outlook":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/outlook/connect`
        );
        break;
      case "zoho":
        router.push(
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/zoho/connect`
        );
        break;
      default:
        break;
    }
  };

  return {
    handleConnectProvider
  };
};
