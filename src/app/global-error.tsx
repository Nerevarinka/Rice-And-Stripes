"use client"; // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h2>Ошибка во время загрузки сайта</h2>
                <p>Пожалуйста, передайте эту информацию администрации <a href="https://t.me/rice_and_stripes">канала</a></p>
                <br />
                <br />
                <p>
                    {error.message}
                </p>
                <p>
                    {error.stack}
                </p>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
