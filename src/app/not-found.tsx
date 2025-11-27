import Link from "next/link";
import { Home, Search } from "lucide-react";
import "./not-found.scss";

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="not-found__icon">404</div>
                <h1 className="not-found__title">Страница не найдена</h1>
                
                <p className="not-found__joke">
                    Её склевали амадины вместе с чумизой 🌾🐦
                </p>
                <div className="not-found__actions">
                    <Link href="/" className="not-found__button not-found__button--primary">
                        <Home size={20} />
                        <span>На главную</span>
                    </Link>
                    <Link href="/articles" className="not-found__button not-found__button--secondary">
                        <Search size={20} />
                        <span>К статьям</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
