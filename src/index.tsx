import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

// import mainReducer from 'reducers'
import App from './app'

const middleware: any[] = [thunk]

if (process.env.IS_DEV_ENV) middleware.push(createLogger({ duration: true }))

const store = createStore(() => {}, applyMiddleware(...middleware))

window.onload = () =>
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    )
