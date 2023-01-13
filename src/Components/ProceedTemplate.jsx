import "../css/ProceedTemplate.css";
import GenericButton from "../Components/GenericButton";

// !/[0-9]/.test(e.key) ? SetAge(e.target.value) : e.preventDefault();
const ProceedTemplate = ({
  proceed_text,
  back_text,
  choice,
  backLink,
  conditionMet,
  vibrate,
  vibrateText,
  directNavigate,
  navigateTo,
  productNavigate,
  productLink,
  set_url_function,
  id,
  consultation_completion_status
}) => {
  return (
    <div className="proceed-container">
      <div className="back-button">
        <GenericButton
          text={back_text}
          directNavigate={directNavigate}
          navigateTo={navigateTo}
          choice={backLink}
          newButton="true"
          conditionMet="true"
          vibrate={vibrate}
          vibrateText={vibrateText}
          set_url_function={set_url_function}
          id={`back-${id}`}
          consultation_completion_status={consultation_completion_status}
        />
      </div>
      <div className="proceed-button">
        <GenericButton
          text={proceed_text}
          choice={choice}
          productNavigate={productNavigate}
          productLink={productLink}
          conditionMet={conditionMet}
          vibrate={vibrate}
          vibrateText={vibrateText}
          set_url_function={set_url_function}
          id={`proceed-${id}`}
          consultation_completion_status={consultation_completion_status}
        />
      </div>
    </div>
  );
};

export default ProceedTemplate;
