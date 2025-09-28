'use client'
import React, { useEffect, useState } from "react";
import { api } from '@/convex/_generated/api';
import { useMutation } from "convex/react";
import { useUser } from '@clerk/nextjs';
import { UserDetailProvider } from "@/context/UserDetailContext";


function Provider({ children }: any) {
    const { user } = useUser();
    const CreateUser = useMutation(api.users.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>();

    useEffect(() => {
        user && CreateNewUser()
    })
    const CreateNewUser = async () => {
        if (user) {
            const result = await CreateUser({
                email: user?.primaryEmailAddress?.emailAddress ?? '',
                name: user?.fullName ?? '',
                imageUrl: user?.imageUrl ?? '',
            })
            setUserDetail(result);
        }
    }

    return (
        <UserDetailProvider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailProvider>
    )
}

export default Provider;
