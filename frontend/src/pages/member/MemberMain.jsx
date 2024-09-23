import MemberHeader from "../../components/member/MemberHeader";
import MemberCarousel from "../../components/member/MemberCarousel";
import MemberSearch from "../../components/member/MemberSearch";
import MainProduct from "../../components/member/MainProduct";
import MemberFooter from "../../components/member/MemberFooter";

const MemberMain = () => {

  return (
    <div >
      <MemberHeader />
      <MemberSearch />
      {/* <MemberCarousel /> */}
      <MainProduct />
      <MemberFooter />
    </div>
  )
}

export default MemberMain;