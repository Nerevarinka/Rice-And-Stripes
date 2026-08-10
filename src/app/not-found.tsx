import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

import pageNotFoundImage from "@/shared/assets/notFound/pageNotFound.webp";

import "./not-found.scss";

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <Image
                    src={pageNotFoundImage}
                    alt="Амадина ищет улетевшую страницу"
                    className="not-found__image"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 640px"
                    priority
                />

                <p className="not-found__message">
                    Кажется, эта страница улетела! Но мы уже отправили амадину на ее поиски
                </p>

                <Link href="/" className="not-found__button">
                    <Home size={18} aria-hidden="true" />
                    <span>На главную</span>
                </Link>
            </div>
        </div>
    );
}
