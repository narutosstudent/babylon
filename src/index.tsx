/* @refresh reload */
import './tailwind.css'
import './styles/player.css'
import './styles/animations.css'
import './styles/slider.css'
import './styles/controls.css'

import { render } from 'solid-js/web'

import { App } from './App'

render(() => <App />, document.getElementById('root') as HTMLElement)
