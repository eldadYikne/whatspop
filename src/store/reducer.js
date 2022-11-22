import { storageService } from "../service/storage.service"

const initialState = {
    rooms: storageService.load('rooms') || null,
    user: storageService.load('user') || null,
}




export function userReducer(state = initialState, action) {
    var user
    var rooms
    switch (action.type) {
        case 'USER_LOGIN':
            user = { ...action.user }
            return { ...state, user }
        case 'USER_LOGOUT':
            return { ...state, user: null }
        case 'USER_SIGNUP':
            user = action.user
            return { ...state, user }
        case 'SET_ROOMS':
            rooms = action.rooms
            return { ...state, rooms  }
            
        default:
            return state;
    }

}

