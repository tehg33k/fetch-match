import React, { createContext, FC, useState } from "react";
import { IUser } from "../models/user";

interface IUserContext {
  setUser: (user: IUser | undefined) => void;
  user: IUser | undefined;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
}

interface IUserContextHandlerProps {
  children: React.ReactNode;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  setUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const UserContextHandler: FC<IUserContextHandlerProps> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
