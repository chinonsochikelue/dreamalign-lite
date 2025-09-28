import { createContext, useContext } from "react";

const UserDetailContext = createContext<any>(null);

export const UserDetailProvider = UserDetailContext.Provider;

export const useUserDetails = () => {
    return useContext(UserDetailContext);
};
