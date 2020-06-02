import { LOGIN, SIGNOUT} from "./Action"

const initialState = {
    isloggedIn: false,
    user: "",
    user_type: "",
    nav_type: ""
  }

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state,
                isloggedIn : action.payload.isloggedIn,
                user : action.payload.user,
                user_type : action.payload.user_type,
                nav_type : action.payload.nav_type
            }
        
        case SIGNOUT:
            return { ...state,
                isloggedIn : action.payload,
                user : ""
            }
        
        default:
            return state;
    }
}

export default Reducer
  