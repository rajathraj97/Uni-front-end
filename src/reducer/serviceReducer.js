const initialService = {
    service:[]
}

export const serviceReducer = (state=initialService,action) =>{
    
    switch(action.type){
        
        case "FETCH_SERVICES":{
            return{service:action.payload}
        }
        default:{
            return{...state}
        }
    }
}

export default serviceReducer