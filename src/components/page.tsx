import { styled } from "@mui/system";
import { FC, ReactNode } from "react";

export interface IPage {
  children: ReactNode;
}

export const Page: FC<IPage> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled("div")`
  display: flex;
  justify-content: center;
`;
