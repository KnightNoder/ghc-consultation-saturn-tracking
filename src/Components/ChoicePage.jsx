import ChoiceCard from "./ChoiceCard";
import ProceedTemplate from "./ProceedTemplate";
import "../css/ChoicePage.css";
import "../css/ChoiceCard.css";
import ImageCard from "./ImageCard";
import ProgressBarComp from "./ProgressBarComp";
import { useState, useEffect } from "react";
import CheckBoxCard from "./CheckBoxCard";

const ChoicePage = ({
  CustomComponent,
  question,
  options,
  clickHandler,
  state_Obj,
  proceed_link,
  back_link,
  set_url_function,
  overlay_screen_text,
  delay_time,
  CustomInputComponent,
  input_none,
  directNavigate,
  navigateTo,
  conditionMet,
  inputOptions,
  checkboxOptions,
  required,
  required_check,
  progress_bar,
  progress_bar_text,
  progress_step,
  consultation_completion_status
}) => {
  const [display_overlay_text, Set_display_overlay_text] = useState(true);
  const assessment_type = state_Obj["assessment_type"] == "30 sec" ? "short" : "long"
  const category = state_Obj["Select category for consultation"];
  const tracking_id= assessment_type+"-"+category+"-"+"button";
  if(required_check){
    state_Obj[question] = state_Obj[question] ? state_Obj[question] : {}; 
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      Set_display_overlay_text(false);
    }, delay_time);
  }, []);

  return (
    <>
      <div
        className={`${
          display_overlay_text ? "show-overlay-screen" : "hide-overlay-screen"
        }`}
      >
        {overlay_screen_text}
      </div>
      <div className="choice-container" style={{ display: "block" }}>
        {progress_bar ? (
          <div className="progress-bar-saturn-step">
            <ProgressBarComp
              progress_step={progress_step}
              img_1="https://cdn.shopify.com/s/files/1/0607/6029/3588/files/skin-1.png?v=1655109040"
              img_2="https://cdn.shopify.com/s/files/1/0607/6029/3588/files/skin-2.png?v=1655109040"
              img_3="https://cdn.shopify.com/s/files/1/0607/6029/3588/files/skin-3.png?v=1655109040"
              img_4="https://cdn.shopify.com/s/files/1/0607/6029/3588/files/skin-4.png?v=1655109040"
              text={progress_bar_text}
            />
          </div>
        ) : null}
        {/* <div className="assessment-image"> 
          <ImageCard />
        </div> */}
        <div className="assessment">
          <h5>{question} </h5>
          {required  ? (
            <div
              className={` error-text-checkbox ${
                !!state_Obj[question] ? "not-visible" : "visible"
              }`}
            >
              Please answer the question to proceed
            </div>
          ) : null}
          { !!(required_check && state_Obj[question])  ? (
            <div
              className={` error-text-checkbox ${
                Object.values(state_Obj[question])?.filter((x) => x == true).length ? "not-visible" : "visible"
              }`}
            >
              Please answer the question to proceed
            </div>
          ) : null}
          {options
            ? options.map((option) => {
                return (
                  <>
                    <CustomComponent
                      option={option}
                      clickHandler={(question, value) =>
                        clickHandler(question, value)
                      }
                      // key={option.value}
                      state_Obj={state_Obj}
                      question={question}
                    />
                  </>
                );
              })
            : null}

          {checkboxOptions
            ? checkboxOptions.map((option) => {
                return (
                  <>
                    <CheckBoxCard
                      value={option.value}
                      text={option.displayText}
                      state_Obj={state_Obj}
                      key={option.displayText}
                      onchange={(text, value, question) =>
                        option.onChange(text, value, question)
                      }
                      question={question}
                    />
                  </>
                );
              })
            : null}

            {inputOptions
              ? inputOptions.map((option) => {
                return (
                  <>
                    <CustomInputComponent
                      placeholder={option.placeholder}
                      requiredErrorText={option.requiredErrorText}
                      input_value={option.value}
                      heading={option.heading}
                      onchange={(heading, value) =>
                        option.clickHandler(heading, value)
                      }
                      required={option.required}
                      inputMode={option.inputMode}
                      validity={option.validity}
                      inputCheck={option.inputCheck ? option.inputCheck : null}
                      disable={option.disable}
                      invisible={option.invisible}
                    />
                  </>
                );
              })
            : null}

          {/* <div className="input-age">
            <h5 style={{ display: "inline-block" }}>Age</h5>
          </div>
          <input
            className="input"
            onChange={(e) => SetAge(e.target.value)}
            type="text"
            placeholder="Eg.24"
          />
          <div className={`error-text `} id="top">
            Please provide your age to proceed
          </div> */}
          {/* <div
            className={`${input_none ? "hide-overlay-screen" : "show-input"}`}
          >
            <CustomInputComponent
              heading={heading}
              required={required}
              placeholder={placeholder}
              requiredErrorText={requiredErrorText}
              clickHandler={clickHandler}
              onchange={(question, value) => inputHandler(question, value)}
            />
          </div> */}
          <div className="proceed-template">
            <ProceedTemplate
              proceed_text="Proceed"
              back_text="Back"
              conditionMet={!required_check ? (conditionMet || state_Obj[question]): 
                (Object.values(state_Obj[question])?.filter((x) => x == true).length) }
              choice={proceed_link}
              navigateTo={navigateTo}
              backLink={back_link}
              set_url_function={set_url_function}
              directNavigate={directNavigate}
              id={tracking_id}
              consultation_completion_status={consultation_completion_status}
            />
          </div>
        </div>
      </div>
      <div className="proceed-template-mobile">
        <ProceedTemplate
          proceed_text="Proceed"
          back_text="Back"
          conditionMet={!required_check ? (conditionMet || state_Obj[question]): 
            (Object.values(state_Obj[question])?.filter((x) => x == true).length)}
          choice={proceed_link}
          navigateTo={navigateTo}
          backLink={back_link}
          set_url_function={set_url_function}
          directNavigate={directNavigate}
          id={tracking_id}
          consultation_completion_status={consultation_completion_status}
        />
      </div>
    </>
  );
};

export default ChoicePage;
