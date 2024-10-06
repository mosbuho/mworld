import MemberHeader from "../../components/member/MemberHeader";
import MemberSearch from "../../components/member/MemberSearch";
import MainProduct from "../../components/member/MainProduct";
import MemberFooter from "../../components/member/MemberFooter";
import { Outlet } from "react-router-dom";

const MemberMain = () => {

  return (
    <div >
      <MemberHeader />
      <MemberSearch />
      {/* <MainProduct /> */}
      <Outlet />
      <MemberFooter />
    </div>
  )
}

export default MemberMain;