import MemberHeader from "../../components/member/MemberHeader";
import MemberFooter from "../../components/member/MemberFooter";
import FixedButton from "../../components/member/MemberFixedButton";
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