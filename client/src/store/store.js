import {create} from 'zustand';

export const useAuthStore = create((set)=>({  // it will create a central store in our react application
    auth:{
        username:'',
        active:false
    },
    setUsername : (name) => set((state)=>({auth : {...state.auth, username: name}}))
}))
