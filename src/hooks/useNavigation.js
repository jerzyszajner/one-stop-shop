import { useNavigate } from "react-router-dom";

// Custom hook to handle navigation actions
export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (action, params = {}) => {
    switch (action) {
      case "signin": {
        const { user, from } = params;
        if (from === "cart" && user.emailVerified) {
          navigate("/delivery");
        } else if (!user.emailVerified) {
          navigate("/verify-email", { state: { from } });
        } else {
          navigate("/");
        }
        break;
      }

      case "cart": {
        const { user: cartUser } = params;
        if (cartUser?.emailVerified) {
          navigate("/delivery");
        } else {
          navigate("/sign-in", { state: { from: "cart" } });
        }
        break;
      }

      case "verification": {
        const { from: verifyFrom } = params;
        if (verifyFrom === "cart") {
          navigate("/delivery");
        } else {
          navigate("/");
        }
        break;
      }

      default:
        navigate("/");
    }
  };

  return { navigateTo };
};
