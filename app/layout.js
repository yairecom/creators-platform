import "./globals.css";

export const metadata = {
  title: "פלטפורמת יוצרות תוכן",
  description: "ניהול ומאגר יוצרות תוכן לצוות",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
