
import "./globals.css";

export const metadata = {
  title: "BookVise",
  description: "AI Book recommendation based on your feel and goal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>{children}</body>
    </html>
  );
}
