import { useState } from "react";
import { AxiosError } from "axios";
import { userService } from "../api/userService";
import type { User } from "../types/user";
import { useAuthContext } from "../context/AuthContext";

interface ApiError{
    message:string;
}

type UserUpdateData = Partial<User>;

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error , setError] = useState<string | null>(null);
    const {setUser} = useAuthContext();

    const updateUser = async(id:number, data:UserUpdateData): Promise<User | undefined> => {
        setLoading(true);
        setLoading(false);

        try{
            const updatedUser = await userService.updateUser(id, data);
            localStorage.setItem("user", JSON.stringify(updateUser));
            setUser(updatedUser);
            return updatedUser;
        }catch(error){
            const axiosError = error as AxiosError<ApiError>;
            const errorMessage = axiosError.response?.data?.message || (error as Error).message || "Error al actualizar el usuario";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    };

    return{
        updateUser,
        loading,
        error,
    };
};