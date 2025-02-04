import { styled } from "@mui/system";
import { useContext } from "react";
import { UserContext } from "../context/user";
import { Match } from "./match";
import { Login } from "./login";

export const Page = () => {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <>
      <Wrapper>{isLoggedIn ? <Match /> : <Login />}</Wrapper>
    </>
  );
};

const Wrapper = styled("div")`
  display: flex;
  justify-content: center;
`;
