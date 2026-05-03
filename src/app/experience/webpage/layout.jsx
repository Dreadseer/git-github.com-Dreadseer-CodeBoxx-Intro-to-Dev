import { WebPageProvider } from "@/context/WebPageContext";

export default function WebPageLayout({ children }) {
  return <WebPageProvider>{children}</WebPageProvider>;
}
