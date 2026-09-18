import { HelmetProvider, Helmet } from "react-helmet-async";

// Component untuk title & meta
const PageMeta = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

// Wrapper untuk HelmetProvider
export const AppWrapper = ({ children }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
