import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'

const initialState = {
    stateBoard: [],
    stateStatus: 'unsolved',
    stateLoading: false
}

function reducer(state = initialState, action) {
    switch(action.type) {
        case 'FETCH_BOARD':
            return {...state, stateBoard: action.payload, stateLoading: true}
        case 'VALIDATE_BOARD':
            return {...state, stateStatus: action.payload}
        case 'RESET':
            return {...state, stateStatus: 'unsolved'}
        default:
            return state
    }
}

const store = createStore(reducer, applyMiddleware(thunk))

export default store