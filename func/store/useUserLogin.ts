import {create} from 'zustand';

const useLogin = create((set)=>({
    isLogin : false,
    setLogin :(newLogin = false) => set(() => ({isLogin:newLogin})),
    userName : "",
    setUserName : (newUserName: any) => set(() => ({userName:newUserName})),
    namaUser : "",
    setNamaUser : (newnamaUser: any) => set(() => ({namaUser:newnamaUser})),

}));

export default useLogin;
