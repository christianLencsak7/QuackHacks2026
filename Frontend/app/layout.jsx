import './globals.css';

export const metadata = {
    title: 'instaparse',
    description: 'Schedule quickly.',
    manifest: '/manifest.json',
    themeColor: '#ffffff',
    icons: {
        icon: '/icon-192.png',
        apple: '/icon-192.png',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
