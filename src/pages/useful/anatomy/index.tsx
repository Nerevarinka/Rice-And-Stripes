import { component$ } from '@builder.io/qwik'

import "./styles.css";

export const AnatomyPage = component$(
    () => {
        return (
            <main>
                <div class="spinner-grow my-test-class" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>

                <button>sss</button>
            </main>
        );
    });