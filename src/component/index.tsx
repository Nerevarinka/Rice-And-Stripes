import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";

import "./styles.scss";

// import { Navbar } from '../components/navbar';
import Sidebar from '../components/sidebar';

import { routes } from "../routes";

const App: FC = () => {
    return (
        <main className="main">
            {/* <Navbar /> */}

            <Sidebar />

            <div className="content">
                <Routes>
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />}
                    />
                    {routes.map(x =>
                        <Route
                            key={x.link}

                            path={x.link}
                            element={x.component}
                        />
                    )}
                </Routes>
            </div>
        </main>
    );
};

export default App;