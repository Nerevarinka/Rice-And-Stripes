import { component$ } from '@builder.io/qwik'

import "./styles.scss";

// import { Navbar } from '../components/navbar';
import { Sidebar } from '../components/sidebar';
import { Home } from '../components/home';

export const App = component$(
    () => {
        return (
            <main class="main">
                {/* <Navbar /> */}

                <Sidebar />

                <div class="content">
                    <Home />
                </div>
            </main>
        );
    });