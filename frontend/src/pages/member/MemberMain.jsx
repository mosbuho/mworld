import MemberHeader from "../../components/member/MemberHeader";
import MainProduct from "../../components/member/MainProduct";
import MemberFooter from "../../components/member/MemberFooter";
import FixedButton from "../../components/member/FixedButton";
import { Outlet } from "react-router-dom";

const MemberMain = () => {

  return (
    <div >
      <MemberHeader />
      <Outlet />
      <MemberFooter />
      <FixedButton />
    </div>
  )
}

export default MemberMain;