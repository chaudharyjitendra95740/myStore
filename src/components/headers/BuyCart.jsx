import { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
export default function BuyCart() {
  let showCount = useSelector((cartCount) => cartCount.CountStore.count);
  const navigate = useNavigate();
  const { isLogin } = useContext(LoginContext);
  function handleClick() {
    navigate("/buyProduct");
  }
  return (
    <>
      <i
        className="fa-solid fa-cart-arrow-down"
        style={{ color: "Green", fontSize: "35px", cursor: "pointer" }}
        onClick={handleClick}
      >
        <sup
          style={{
            fontSize: "16px",
            fontWeight:"bold",
            position: "relative",
            top: "-23px",
            right:'15px',
            color: "red",
            backgroundColor: "Green",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          {isLogin ? showCount : 0}
        </sup>
      </i>
    </>
  );
}
