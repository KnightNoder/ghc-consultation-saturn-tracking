import "../css/GenericButton.css";
import { useNavigate } from "react-router-dom";

const GenericButton = ({
  text,
  choice,
  conditionMet,
  vibrateText,
  newButton,
  directNavigate,
  navigateTo,
  radiusBottom,
  productNavigate,
  productLink,
  set_url_function,
  id,
}) => {
  const navigate = useNavigate();
  const navigateCheck = () => {
    if (directNavigate) {
      navigate(parseInt(navigateTo), { replace: true });
      set_url_function("/" + parseInt(navigateTo));
    } else if (productNavigate) {
      const redirectToCheckout = async () => {
          window.open(`https://${window.location.host}/cart/${productLink}`);
      };
      redirectToCheckout();
    } else {
      if (conditionMet) {
        navigate(window.location.pathname + choice);
        set_url_function(window.location.pathname + choice);
      } else {
        vibrateText();
      }
    }
  };

  return (
    <button
      target="_blank"
      id={id}
      className={`generic-button ${newButton ? "backButtonStyle" : ""} ${
        radiusBottom ? "borderRadiusBottom" : ""
      }`}
      onClick={(e) => {
        e.preventDefault();
        navigateCheck();
      }}
    >
      {text}
    </button>
  );
};

export default GenericButton;
