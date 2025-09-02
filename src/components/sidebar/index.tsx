import { component$ } from '@builder.io/qwik'

import "./styles.scss";

export const Sidebar = component$(
    () => {
        return (
            <aside class="sidebar">
                <div class="sidebar-wrapper">
                    <div class="main-logo-container">
                        <img src="src\components\navbar\main_logo.png" class="sidebar-logo" />
                    </div>
                    <div class="sidebar-header">
                        <div class="sidebar-header-title">Амадины Rice & Stripes</div>
                        <div class="sidebar-header-description">Блог о птицах</div>
                    </div>
                    <hr class="sidebar-header-hr" />
                    <div class="sidebar-body">
                        <nav class="sidebar-link-list">
                            <div class="sidebar-link-group-text">Статьи</div>
                            <a href="#" class="sidebar-link">Полезные</a>
                            <a href="#" class="sidebar-link">Познавательные</a>
                            <div class="sidebar-link-group-text">Заметки</div>
                            <div class="sidebar-link-group-text">Наши амадинки</div>
                        </nav>
                    </div>
                    <footer class="sidebar-footer">
                        © 2025
                    </footer>
                </div>
            </aside>

        );
    });