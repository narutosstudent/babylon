/* @refresh reload */
import './index.css'
import './player.css'
import { render } from 'solid-js/web'

import { App } from './App'

render(() => <App />, document.getElementById('root') as HTMLElement)
