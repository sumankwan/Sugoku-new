import axios from 'axios'

export function fetchBoard(difficulty) {
    return (dispatch, getState) => {
        axios({
            url: `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`,
            method: 'get'
          })
            .then(data => {
                let result = data.data.board
                dispatch({
                    type: 'FETCH_BOARD',
                    payload: result
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export function validateBoard(input) {
    return (dispatch, getState) => {
        const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')
        
        const encodeParams = (params) => 
        Object.keys(params)
        .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
        .join('&');

        fetch('https://sugoku.herokuapp.com/validate', {
            method: 'POST',
            body: encodeParams(input),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response.solution)
                dispatch({
                    type: 'VALIDATE_BOARD',
                    payload: response.status
                })
            })
            .catch(console.warn)
    }
}

export function login(payload) {
    return (dispatch, getState) => {
        dispatch({
            type: 'LOGIN',
            payload
        })
    }
}

// export function solveBoard(input) {
//     return (dispatch, getState) => {
//         const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')
        
//         const encodeParams = (params) => 
//         Object.keys(params)
//         .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
//         .join('&');

//         fetch('https://sugoku.herokuapp.com/solve', {
//             method: 'POST',
//             body: encodeParams(input),
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         })
//             .then(response => response.json())
//             .then(response => {
//                 console.log(response.solution)
//                 dispatch({
//                     type: 'SOLVE_BOARD',
//                     payload: response.solution
//                 })
//             })
//             .catch(console.warn)
//     }
// }

export function reset() {
    return (dispatch, getState) => {
        dispatch({
            type: 'RESET'
        })
    }
}