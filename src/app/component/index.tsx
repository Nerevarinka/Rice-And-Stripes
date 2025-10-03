import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";

import "./styles.scss";

import Sidebar from "../components/sidebar";
import { sideBarMenu } from "@app/shared";

const App: FC = () => {
    return (
        <main className="main">
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
                    {sideBarMenu.map(x =>
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
