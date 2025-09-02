import '@builder.io/qwik/qwikloader.js'

import "bootstrap/dist/css/bootstrap.min.css";

import { render } from '@builder.io/qwik'
import { App } from './component';


render(document.getElementById('app') as HTMLElement, <App />)