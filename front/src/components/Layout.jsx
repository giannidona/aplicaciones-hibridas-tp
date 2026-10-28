import { Outlet } from "react-router";
import Nav from "./Nav.jsx";

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
