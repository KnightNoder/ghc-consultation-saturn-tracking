import React from "react";
import "./styles.css";
import DynamicFieldBuilder from "rolling-fields";
import LandingPage from "./Components/LandingPage";
import CustomRadio from "./Components/CustomRadio";
import CheckBoxCard from "./Components/CheckBoxCard";
import ChoicePage from "./Components/ChoicePage";
import Recommendation from "./Components/Recommendation";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import InputCard from "./Components/InputCard";
import { useEffect, useState } from "react";
import posthog from 'posthog-js'

export default function App() {
  const { path } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  var fields = [];
  const [builder_fields, Set_builder_fields] = useState([]);
  const [query_params, Set_query_params] = useState({});
  const [path_params, Set_path_params] = useState();
  const [stateObj, Set_stateObj] = useState(
    JSON.parse(window.localStorage.getItem("stateObj")) || {}
  );

  useEffect(() => {
    posthog.init(process.env.REACT_APP_POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
    Set_query_params(window.location.search);
    document.documentElement.style.setProperty(
      "--border",
      process.env.REACT_APP_COLOR_BORDER
    );
    document.documentElement.style.setProperty(
      "--hover",
      process.env.REACT_APP_COLOR_HOVER
    );
    document.documentElement.style.setProperty(
      "--color-light",
      process.env.REACT_APP_COLOR_LIGHT
    );
    document.documentElement.style.setProperty(
      "--color-normal",
      process.env.REACT_APP_COLOR_NORMAL
    );
    document.documentElement.style.setProperty(
      "--color-dark",
      process.env.REACT_APP_COLOR_DARK
    );
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(query_params);
    window.localStorage.setItem("stateObj", JSON.stringify(stateObj));
    let allPages = [];
    allPages = eval(
      `allPages_${process.env.REACT_APP_BRAND}_${
        stateObj["assessment_type"] == "30 sec" ? "Short" : "Long"
      }`
    );
    if (queryParams.get("type")) {
      fields = allPages[`${queryParams.get("type")}${queryParams.get("page")}`];
      Set_builder_fields(fields);
    } else if (queryParams.get("category")) {
      fields = allPages.category;
      Set_builder_fields(fields);
    } else if (queryParams.get("userinfo")) {
      fields = allPages.userinfo;
      Set_builder_fields(fields);
    } else if (queryParams.get("appointment")) {
      window.localStorage.setItem('visit_number',0);
      fields = allPages.appointment;
      Set_builder_fields(fields);
    } else if (queryParams.get("recommendation")) {
      window.localStorage.setItem('visit_number',parseInt(window.localStorage.getItem('visit_number'))+1);
      fields = allPages.recommendation;
      Set_builder_fields(fields);
    } else {
      fields = allPages.assessment;
      Set_builder_fields(fields);
    }
  }, [query_params, stateObj]);

  const redirect_to_set_query_params = (query) => {
    Set_query_params(window.location.search);
  };

  const phone_number_check = () => {
    let number = stateObj["Phone Number"];
    if (number) {
      if(process.env.REACT_APP_COUNTRY == 'USA'){
        if(number.length == 10){
          return true;
        }
      }
      if (
        number.length == 10 &&
        (number.startsWith("6") ||
          number.startsWith("7") ||
          number.startsWith("8") ||
          number.startsWith("9"))
      ){
        return true;
      }
    }
  };

  const email_check = () => {
    let email = stateObj["Email"];
    if (email) {
      if (email.includes("@")) return true;
    }
  };

  const age_check = () => {
    let age = stateObj["Age"];
    if (age > 0 && age < 200) return true;
  };

  const input_check = (e) => {
    var key;
    var keychar;

    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);

    // control keys
    if (
      key == 0 ||
      key == 8 ||
      key == 9 ||
      key == 13 ||
      key == 27 ||
      key == 37 ||
      key == 39 ||
      key == 46 || 
      key == 96 ||
      key == 97 ||
      key == 98 ||
      key == 99 ||
      key == 100 ||
      key == 101 ||
      key == 102 ||
      key == 103 ||
      key == 104 ||
      key == 105
    )
      return true;
    // numbers
    else if ("0123456789".indexOf(keychar) > -1) return true;
    else e.preventDefault();
  };
  
  const choice_clickHandler = (question, value) => {
    Set_stateObj((prevState) => {
      return { ...prevState, [question]: value };
    });
  };

  const category_click_Handler = (question, value) => {
    Set_stateObj((prevState) => {
      return {
        assessment_type: prevState["assessment_type"],
        [question]: value,
      };
    });
  };

  const clickHandler_clear = (question, value) => {
    Set_stateObj(() => {
      return { [question]: value };
    });
  };

  const checkBoxHandler = (text, value, question) => {
    if (text == "No such problems" || text == "None") {
      Set_stateObj((prevState) => {
        return {
          ...prevState,
          [question]: {
            [text]: value,
          },
        };
      });
    } else {
      Set_stateObj((prevState) => {
        return {
          ...prevState,
          [question]: {
            ...prevState[question],
            [text]: value,
            ["No such problems"]: false,
            ["None"]: false,
          },
        };
      });
    }
  };

  const getBackPage = () => {
    const category = stateObj["Select category for consultation"];
    const assessment_type = stateObj["assessment_type"];
    if (process.env.REACT_APP_BRAND == "Saturn") {
      if (assessment_type == "30 sec") {
        if (category == "skin") return "?page=3&type=skin";
        if (category == "weightloss") return "?page=4&type=weightloss";
        if (category == "hair") return "?page=4&type=hair";
      } else {
        if (category == "skin") return "?page=18&type=skin";
        if (category == "weightloss") return "?page=12&type=weightloss";
        if (category == "hair") return "?page=15&type=hair";
      }
    } else {
      if (assessment_type == "30 sec") {
        if (category == "skin") return "?page=3&type=skin";
        if (category == "weightloss") return "?page=4&type=weightloss";
        if (category == "hair") return "?page=5&type=hair";
        if (category == "beard") return "?page=3&type=beard";
        if (category == "performance") return "?page=5&type=performance";
      } else {
        if (category == "skin") return "?page=18&type=skin";
        if (category == "weightloss") return "?page=13&type=weightloss";
        if (category == "hair") return "?page=16&type=hair";
        if (category == "beard") return "?page=15&type=beard";
        if (category == "performance") return "?page=17&type=performance";
      }
    }
  };

  const getProgressBarText = () => {
    const category = stateObj["Select category for consultation"];
    if (process.env.REACT_APP_BRAND == "Saturn") {
      if (category == "skin") return "My Skin";
      if (category == "weightloss") return "My Wellness";
      if (category == "hair") return "My Hair";
      if (category == undefined) return "Category"
    } else {
      if (category == "skin") return "My Skin";
      if (category == "weightloss") return "My Wellness";
      if (category == "hair") return "My Hair";
      if (category == "beard") return "My Beard";
      if (category == "performance") return "My Performance";
      if (category == undefined) return "Category"
    }
  };

  const allPages_Saturn_Short = {
    assessment: [
      {
        name: "assessment_page",
        type: "assessment",
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
    category: [
      {
        name: "category",
        type: "category",
        question: "Select category for consultation",
        clickHandler: choice_clickHandler,
        inputHandler: choice_clickHandler,
        state_Obj: stateObj,
        set_url_function: redirect_to_set_query_params,
        proceed_link: `?userinfo=yes`,
        back_link: "?assessment=yes",
        required: "true",
        options: [
          {
            displayText: "Skin",
            value: "skin",
          },
          {
            value: "weightloss",
            displayText: "Wellness",
          },
          {
            value: "hair",
            displayText: "Hair",
          },
        ],
      },
    ],
    userinfo: [
      {
        name: "userinfo",
        type: "category",
        question: "Fill up the details below :",
        state_Obj: stateObj,
        set_url_function: { redirect_to_set_query_params },
        proceed_link: `?page=1&type=${stateObj["Select category for consultation"]}`,
        back_link: "?category=yes",
        overlay_screen_text: "Tell me about yourself",
        delay_time: "1000",
        conditionMet:
          stateObj["Name"] &&
          phone_number_check(stateObj["Phone Number"]) ,
        consultation_completion_status:"started",
        inputOptions: [
          {
            placeholder: "Eg: Jane Doe",
            requiredErrorText: "Please enter valid name",
            heading: "Name",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Name"],
            validity: stateObj["Name"],
          },
          {
            placeholder: "Eg: 9876543210",
            requiredErrorText: "Please enter valid phone number",
            heading: "Phone Number",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Phone Number"],
            inputMode: "numeric",
            validity: phone_number_check(),
            inputCheck: input_check,
          },
        ],
      },
    ],
    hair1: [
      {
        name: "hair page 1",
        type: "category",
        question: "What best describes the current condition of your hair?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=hair",
        back_link: "?userinfo=yes",
        required: "true",
        options: [
          {
            value: "Receding hairline",
            displayText: "Receding hairline",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/receding.png?v=1659695198",
          },
          {
            value: "Thinning at the crown",
            displayText: "Thinning at the crown",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/crown_thin.png?v=1659695198",
          },
          {
            value: "Overall hair loss/thinning",
            displayText: "Overall hair loss/thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/overall.png?v=1659695198",
          },
          {
            value: "Receding + Overall thinning",
            displayText: "Receding + Overall thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/receding_thin.png?v=1659695198",
          },
        ],
      },
    ],
    hair2: [
      {
        name: "hair page 2",
        type: "category",
        question: "What results are you looking for?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=hair",
        back_link: "?page=1&type=hair",
        required: "true",
        options: [
          {
            value: "Regrowing your hair",
            displayText: "Regrowing your hair",
          },
          {
            value: "Preventing future hair loss",
            displayText: "Preventing future hair loss",
          },
          {
            value: "Both regrowth & loss prevention",
            displayText: "Both regrowth & loss prevention",
          },
        ],
      },
    ],
    hair3: [
      {
        name: "hair page 3",
        type: "category",
        question: "Does anyone in your family have hair loss?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=hair",
        back_link: "?page=2&type=hair",
        conditionMet: true,
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair4: [
      {
        name: "hair page 5",
        type: "category",
        question:
          "Do you have any upcoming functions in the family in the next 30 days?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=3&type=hair",
        required: "true",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    skin1: [
      {
        name: "skin page 1",
        type: "category",
        question: "What are you concerned about?",
        clickHandler: choice_clickHandler,
        category_key: "category",
        state_Obj: stateObj,
        proceed_link: "?page=2&type=skin",
        back_link: "?userinfo=yes",
        delay_time: 1000,
        overlay_screen_text: `Answer a few questions so we can help`,
        required: "true",
        options: [
          {
            value: "Open pores",
            displayText: "Open pores",
          },
          {
            value: "Pigmentation",
            displayText: "Pigmentation",
          },
          {
            value: "Active Acne",
            displayText: "Active Acne",
          },
          {
            value: "Aging",
            displayText: "Aging",
          },
          {
            value: "Dark circles",
            displayText: "Dark circles",
          },
          {
            value: "Spots & Marks",
            displayText: "Spots & Marks",
          },
          {
            value: "Dull Skin",
            displayText: "Dull Skin (general skincare)",
          },
        ],
      },
    ],
    skin2: [
      {
        name: "skin page 2",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What is your skin type?",
        state_Obj: stateObj,
        proceed_link: "?page=3&type=skin",
        back_link: "?page=1&type=skin",
        delay_time: 3000,
        overlay_screen_text: `Skin concerns are unique to each individual and one needs the right care
        to keep up with good skin health`,
        // overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        input_none: true,
        conditionMet: true,
        conditionMet: true,
        options: [
          {
            value: "Oily",
            displayText: "Oily",
          },
          {
            value: "Dry",
            displayText: "Dry",
          },
          {
            value: "Normal ",
            displayText: "Normal ",
          },
        ],
      },
    ],
    skin3: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Are you allergic to any of these ingredients?",
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=2&type=skin",
        delay_time: 3000,
        overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        required: "true",
        options: [
          {
            value: "Vitamin C",
            displayText: "Vitamin C",
          },
          {
            value: "Salicylic Acid",
            displayText: "Salicylic Acid",
          },
          {
            value: "Retinol",
            displayText: "Retinol",
          },
          {
            value: "Kojic Acid",
            displayText: "Kojic Acid",
          },
          {
            value: "None",
            displayText: "None",
          },
        ],
      },
    ],
    weightloss1: [
      {
        name: "Weight loss page 1",
        type: "category",
        question: `Please enter your height and weight below`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=weightloss",
        back_link: "?userinfo=yes",
        conditionMet: stateObj["Height"] && stateObj["Weight"],
        delay_time: 3000,
        overlay_screen_text: `Answer few questions so we can help`,
        inputOptions: [
          {
            heading: "Height",
            placeholder: "Height(in cms)",
            requiredErrorText: "Please enter valid height to proceed",
            value: stateObj["Height"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Height"],
            inputCheck: input_check,
          },
          {
            heading: "Weight",
            placeholder: process.env.REACT_APP_COUNTRY != 'USA' ? "Weight(in Kgs)" : "Weight(in Pounds)",
            requiredErrorText: "Please enter valid weight to proceed",
            value: stateObj["Weight"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Weight"],
            inputCheck: input_check,
          },
        ],
      },
    ],
    weightloss2: [
      {
        name: "Weight loss page 2",
        type: "category",
        question: `What best describes your current body condition?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=weightloss",
        back_link: "?page=1&type=weightloss",
        overlay_screen_text:
          "Measuring your weight everyday helps you lose weight faster",
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "OverWeight/Obese"
              ] || 0,
            displayText: "OverWeight/Obese",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak bones/muscles"
              ] || 0,
            displayText: "Weak bones/muscles",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak Joints"
              ] || 0,
            displayText: "Weak Joints",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Knee/Shoulder/Joint Pain"
              ] || 0,
            displayText: "Knee/Shoulder/Joint Pain",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Body Fatigue"
              ] || 0,
            displayText: "Body Fatigue",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stretch Marks on the skin"
              ] || 0,
            displayText: "Stretch Marks on the skin",
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss3: [ 
      {
        name: "Weight loss page 5",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=weightloss",
        back_link: "?page=2&type=weightloss",
        conditionMet: true,
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ] || 0,
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"] ||
              0,
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"] ||
              0,
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Diabetes"
              ] || 0,
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"] ||
              0,
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ] || 0,
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ] || 0,
            displayText: "Others",
            onChange: checkBoxHandler,
          }
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            // disable: !Object.keys(stateObj[`Do you have any pre-existing health issues?`])?.filter((x) => 
            // stateObj[`Do you have any pre-existing health issues?`][x] == true )?.includes("Others")
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined)) 
          },
        ]
      },
    ],
    weightloss4: [
      {
        name: "Weight loss page 4",
        type: "category",
        question: `Have you ever had allergic reactions to any of the components below?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=3&type=weightloss",
        required: false,
        conditionMet: false,
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Glucosamine"] || 0,
            displayText: `Glucosamine`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Chondroitin"] || 0,
            displayText: `Chondroitin`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Methylsulfonylmethane(MSM)"] || 0,
            displayText: `Methylsulfonylmethane(MSM)`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["None"] || 0,
            displayText: `None`,
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss5: [
      {
        name: "Weight loss page 4",
        type: "category",
        question: `How many days do you exercise in a week?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=4&type=weightloss",
        conditionMet: true,
        options: [
          {
            value: `Don't work out at all`,
            displayText: `Don't work out at all`,
          },
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "5-6 times a week",
            displayText: "5-6 times a week",
          },
          {
            value: "1-2 times a week",
            displayText: "1-2 times a week",
          },
        ],
      },
    ],
    appointment: [
      {
        name: "Appointment page",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?",
        state_Obj: stateObj,
        proceed_link: "?recommendation=yes",
        back_link: getBackPage(),
        required: "true",
        consultation_completion_status:"completed",
        options: [
          {
            value: "Yes, please",
            displayText: "Yes, please",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
    recommendation: [
      {
        name: "Recommendation page",
        type: "recommendation",
        stateObj: stateObj,
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
  };

  const allPages_Saturn_Long = {
    assessment: [
      {
        name: "assessment_page",
        type: "assessment",
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
    category: [
      {
        name: "category",
        type: "category",
        question: "Select category for consultation",
        clickHandler: choice_clickHandler,
        inputHandler: choice_clickHandler,
        CustomRadioComponent: { CustomRadio },
        state_Obj: stateObj,
        set_url_function: { redirect_to_set_query_params },
        proceed_link: `?userinfo=yes`,
        back_link: "?assessment=yes",
        heading: "Age",
        required: "*",
        placeholder: "Eg: 24",
        requiredErrorText: "Please enter valid age to proceed",
        progress_bar: true,
        progress_bar_text: getProgressBarText(),
        progress_step: "11",
        options: [
          {
            displayText: "Skin",
            value: "skin",
          },
          {
            value: "weightloss",
            displayText: "Wellness",
          },
          {
            value: "hair",
            displayText: "Hair",
          },
        ],
      },
    ],
    userinfo: [
      {
        name: "userinfo",
        type: "category",
        question: "Fill up the details below :",
        clickHandler: clickHandler_clear,
        state_Obj: stateObj,
        set_url_function: { redirect_to_set_query_params },
        proceed_link: `?page=1&type=${stateObj["Select category for consultation"]}`,
        back_link: "?category=yes",
        overlay_screen_text: "Tell me about yourself",
        delay_time: "1000",
        conditionMet:
          stateObj["Name"] &&
          phone_number_check(stateObj["Phone Number"]),
        consultation_completion_status:"started",
        progress_bar: true,
        progress_bar_text: getProgressBarText(),
        progress_step: "22",
        inputOptions: [
          {
            placeholder: "Eg: Jane Doe",
            requiredErrorText: "Please enter name",
            heading: "Name",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Name"],
            validity: stateObj["Name"],
          },
          {
            placeholder: "Eg: 9876543210",
            requiredErrorText: "Please enter valid phone number",
            heading: "Phone Number",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Phone Number"],
            inputMode: "numeric",
            validity: phone_number_check(),
            inputCheck: input_check,
          },
        ],
      },
    ],
    skin1: [
      {
        name: "skin page 1",
        type: "category",
        question: "What are you concerned about?",
        clickHandler: choice_clickHandler,
        category_key: "category",
        state_Obj: stateObj,
        proceed_link: "?page=2&type=skin",
        back_link: "?userinfo=yes",
        delay_time: 1000,
        overlay_screen_text: `Answer a few questions so we can help`,
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "33",
        options: [
          {
            value: "Open pores",
            displayText: "Open pores",
          },
          {
            value: "Pigmentation",
            displayText: "Pigmentation",
          },
          {
            value: "Active Acne",
            displayText: "Active Acne",
          },
          {
            value: "Aging",
            displayText: "Aging",
          },
          {
            value: "Dark circles",
            displayText: "Dark circles",
          },
          {
            value: "Spots & Marks",
            displayText: "Spots & Marks",
          },
          {
            value: "Dull Skin",
            displayText: "Dull Skin (general skincare)",
          },
        ],
      },
    ],
    skin2: [
      {
        name: "skin page 2",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What is your skin type?",
        state_Obj: stateObj,
        proceed_link: "?page=3&type=skin",
        back_link: "?page=1&type=skin",
        delay_time: 3000,
        overlay_screen_text: `Skin concerns are unique to each individual and one needs the right care
        to keep up with good skin health`,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "37.7",
        options: [
          {
            value: "Oily",
            displayText: "Oily",
          },
          {
            value: "Dry",
            displayText: "Dry",
          },
          {
            value: "Normal ",
            displayText: "Normal ",
          },
        ],
      },
    ],
    skin3: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How frequently do you get Active Acne?",
        state_Obj: stateObj,
        proceed_link: "?page=4&type=skin",
        back_link: "?page=2&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "42.4",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Once a month or 2 months",
            displayText: "Once a month or 2 months",
          },
          {
            value: "Always have Active Acne",
            displayText: "Always have Active Acne",
          },
          {
            value: "Very rarely",
            displayText: "Very rarely",
          },
          {
            value: "No Active Acne",
            displayText: "No Active Acne",
          },
        ],
      },
    ],
    skin4: [
      {
        name: "skin page 4",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have blackheads/ whiteheads on your skin?",
        state_Obj: stateObj,
        proceed_link: "?page=5&type=skin",
        back_link: "?page=3&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "47.11",
        options: [
          {
            value: "Chin",
            displayText: "Chin",
          },
          {
            value: "Cheeks",
            displayText: "Cheeks",
          },
          {
            value: "Forehead",
            displayText: "Forehead",
          },
        ],
      },
    ],
    skin5: [
      {
        name: "skin page 5",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have any Active Acne scars or spots?",
        state_Obj: stateObj,
        proceed_link: "?page=6&type=skin",
        back_link: "?page=4&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "51.8",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    skin6: [
      {
        name: "skin page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have active pimples/Pitted Active Acne?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=skin",
        back_link: "?page=5&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "56.5",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    skin7: [
      {
        name: "skin page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have wrinkles or early signs of skin aging?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=skin",
        back_link: "?page=6&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "61.2",
        options: [
          {
            value: "No wrinkles",
            displayText: "No wrinkles",
          },
          {
            value: "Early signs of ageing",
            displayText: "Early signs of ageing",
          },
          {
            value: "I have wrinkles around my eyes and cheeks",
            displayText: "I have wrinkles around my eyes and cheeks",
          },
          {
            value: "I have ageing lines on my forehead",
            displayText: "I have ageing lines on my forehead",
          },
        ],
      },
    ],
    skin8: [
      {
        name: "skin page 8",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Where are the wrinkles on your face?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=skin",
        back_link: "?page=7&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "66",
        options: [
          {
            value: "Around the eyes",
            displayText: "Around the eyes",
          },
          {
            value: "Around the nose",
            displayText: "Around the nose",
          },
          {
            value: "Around the mouth",
            displayText: "Around the mouth",
          },
          {
            value: "Around the lips",
            displayText: "Around the lips",
          },
          {
            value: "None of the above",
            displayText: "None of the above",
          },
        ],
      },
    ],
    skin9: [
      {
        name: "skin page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=skin",
        back_link: "?page=8&type=skin",
        overlay_screen_text:
          "We would love to get to know you better! Can you tell us more about your lifestyle?",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "71.5",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    skin10: [
      {
        name: "skin page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=skin",
        back_link: "?page=9&type=skin",
        conditionMet: true,
        overlay_screen_text: "There is nothing like mom's meals!",
        delay_time: 1000,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "77",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin11: [
      {
        name: "skin page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=12&type=skin",
        back_link: "?page=10&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "82.5",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin12: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=13&type=skin",
        back_link: "?page=11&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "88",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    skin13: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=skin",
        back_link: "?page=12&type=skin",
        overlay_screen_text:
          "A good diet and sufficient rest are crucial to maintaining healthy skin.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "93.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    skin14: [
      {
        name: "skin page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=15&type=skin",
        back_link: "?page=13&type=skin",
        overlay_screen_text:
          "Let's not tell your boss how many hours you worked yesterday.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "97",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    skin15: [
      {
        name: "skin page 15",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you smoke or drink?",
        state_Obj: stateObj,
        proceed_link: "?page=16&type=skin",
        back_link: "?page=14&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin16: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Are you allergic to any of these ingredients?",
        state_Obj: stateObj,
        proceed_link: "?page=17&type=skin",
        back_link: "?page=15&type=skin",
        delay_time: 3000,
        overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Vitamin C",
            displayText: "Vitamin C",
          },
          {
            value: "Salicylic Acid",
            displayText: "Salicylic Acid",
          },
          {
            value: "Retinol",
            displayText: "Retinol",
          },
          {
            value: "Kojic Acid",
            displayText: "Kojic Acid",
          },
          {
            value: "None",
            displayText: "None",
          },
        ],
      },
    ],
    skin17: [
      {
        name: "Skin page 17",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=18&type=skin",
        back_link: "?page=16&type=skin",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Hypertension"
              ],
            displayText: "Hypertension",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"],
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"],
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Diabetes"],
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"],
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Indigestion"
              ],
            displayText: "Indigestion",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ],
            displayText: "Others",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ],
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            // disable: !Object.keys(stateObj[`Do you have any pre-existing health issues?`])?.filter((x) => 
            // stateObj[`Do you have any pre-existing health issues?`][x] == true )?.includes("Others")
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined))
          },
        ]
      },
    ],
    skin18: [
      {
        name: "skin page 18",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Have you ever had side effects from skin products?",
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=17&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            heading: "Allergic skin products used",
            clickHandler: choice_clickHandler,
            placeholder:"List all the products here",
            value: stateObj["Allergic skin products used"],
            invisible: !(stateObj["Have you ever had side effects from skin products?"] == "Yes")
          },
        ]
      },
    ],
    weightloss1: [
      {
        name: "Weight loss page 1",
        type: "category",
        question: `Please enter your height and weight below`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=weightloss",
        back_link: "?userinfo=yes",
        conditionMet: stateObj["Height"] && stateObj["Weight"],
        delay_time: 3000,
        overlay_screen_text: `Answer few questions so we can help`,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "33",
        inputOptions: [
          {
            heading: "Height",
            placeholder: "Height(in cms)",
            requiredErrorText: "Please enter valid height to proceed",
            value: stateObj["Height"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Height"],
            inputCheck: input_check,
          },
          {
            heading: "Weight",
            placeholder: process.env.REACT_APP_COUNTRY != 'USA' ? "Weight(in Kgs)" : "Weight(in Pounds)",
            requiredErrorText: "Please enter valid weight to proceed",
            value: stateObj["Weight"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Weight"],
            inputCheck: input_check,
          },
        ],
      },
    ],
    weightloss2: [
      {
        name: "Weight loss page 3",
        type: "category",
        question: `What best describes your current body condition?`,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=weightloss",
        back_link: "?page=1&type=weightloss",
        overlay_screen_text:
          "Your metabolism is highly responsive to your daily routine and adjusts accordingly.",
        delay_time: 3000,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "44",
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "OverWeight/Obese"
              ] || 0,
            displayText: "OverWeight/Obese",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak bones/muscles"
              ] || 0,
            displayText: "Weak bones/muscles",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak Joints"
              ] || 0,
            displayText: "Weak Joints",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Knee/Shoulder/Joint Pain"
              ] || 0,
            displayText: "Knee/Shoulder/Joint Pain",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Body Fatigue"
              ] || 0,
            displayText: "Body Fatigue",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stretch Marks on the skin"
              ] || 0,
            displayText: "Stretch Marks on the skin",
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss3: [
      {
        name: "Weight loss page 2",
        type: "category",
        question: `How often do you eat in a day (including tea, coffee, fruits, salads, 
          and snacks)`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=weightloss",
        back_link: "?page=2&type=weightloss",
        overlay_screen_text:
          "Measuring your weight everyday helps you lose weight faster",
        delay_time: "3000",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "55",
        options: [
          {
            value: `Greater than 6 times`,
            displayText: `Greater than 6 times`,
          },
          {
            value: "4-6 times",
            displayText: "4-6 times",
          },
          {
            value: "3 times",
            displayText: "3 times",
          },
          {
            value: "Less than 3 times",
            displayText: "Less than 3 times",
          },
        ],
      },
    ],
    weightloss4: [
      {
        name: "weightloss page 4",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=5&type=weightloss",
        back_link: "?page=3&type=weightloss",
        overlay_screen_text:
          "We would love to get to know you better! Can you tell us more about your lifestyle?",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "66",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    weightloss5: [
      {
        name: "weight loss page 5",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=6&type=weightloss",
        back_link: "?page=4&type=weightloss",
        conditionMet: true,
        overlay_screen_text:
          "There's something special about outside food--tastier, love! Though homemade food is healthy :)",
        delay_time: 3000,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "71.5",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss6: [
      {
        name: "weightloss page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=weightloss",
        back_link: "?page=5&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "77",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss7: [
      {
        name: "weight loss page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=weightloss",
        back_link: "?page=6&type=weightloss",
        overlay_screen_text:
          "A good diet and sufficient rest are crucial to maintaining healthy skin.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "82.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    weightloss8: [
      {
        name: "weight loss page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=weightloss",
        back_link: "?page=7&type=weightloss",
        overlay_screen_text:
          "Let's not tell your boss how many hours you worked yesterday.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "88",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    weightloss9: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=weightloss",
        back_link: "?page=8&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "93.5",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],  
    weightloss10: [
      {
        name: "Weight loss page 10",
        type: "category",
        question: `How often do you smoke or drink?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=11&type=weightloss",
        back_link: "?page=9&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Daily`,
            displayText: `Daily`,
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss11: [
      {
        name: "Weight loss page 11",
        type: "category",
        question: `How many days do you exercise in a week?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=12&type=weightloss",
        back_link: "?page=10&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Don't work out at all`,
            displayText: `Don't work out at all`,
          },
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "5-6 times a week",
            displayText: "5-6 times a week",
          },
          {
            value: "1-2 times a week",
            displayText: "1-2 times a week",
          },
        ],
      },
    ],
    weightloss12: [
      {
        name: "Weight loss page 4",
        type: "category",
        question: `Have you ever had allergic reactions to any of the components below?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=13&type=weightloss",
        back_link: "?page=11&type=weightloss",
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Glucosamine"] || 0,
            displayText: `Glucosamine`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Chondroitin"] || 0,
            displayText: `Chondroitin`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Methylsulfonylmethane(MSM)"] || 0,
            displayText: `Methylsulfonylmethane(MSM)`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["None"] || 0,
            displayText: `None`,
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss13: [
      {
        name: "Weight loss page 13",
        type: "category",
        question: `Have you used any healthcare/nutritional products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=12&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used any healthcare/nutritional products before?"] == "Yes")
            // disable: !Object.keys(stateObj[`Do you have any pre-existing problems?`])?.filter((x) => 
            // stateObj[`Do you have any pre-existing problems?`][x] == true )?.includes("Others")
          },
        ]
      },
    ],
    hair1: [
      {
        name: "hair page 1",
        type: "category",
        question: "What best describes the current condition of your hair?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=hair",
        back_link: "?userinfo=yes",
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "33",
        options: [
          {
            value: "Receding hairline",
            displayText: "Receding hairline",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/receding.png?v=1659695198",
          },
          {
            value: "Thinning at the crown",
            displayText: "Thinning at the crown",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/crown_thin.png?v=1659695198",
          },
          {
            value: "Overall hair loss/thinning",
            displayText: "Overall hair loss/thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/overall.png?v=1659695198",
          },
          {
            value: "Receding + Overall thinning",
            displayText: "Receding + Overall thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/receding_thin.png?v=1659695198",
          },
        ],
      },
    ],
    hair2: [
      {
        name: "hair page 2",
        type: "category",
        question: "What results are you looking for?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=hair",
        back_link: "?page=1&type=hair",
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "44",
        options: [
          {
            value: "Regrowing your hair",
            displayText: "Regrowing your hair",
          },
          {
            value: "Preventing future hair loss",
            displayText: "Preventing future hair loss",
          },
          {
            value: "Both regrowth & loss prevention",
            displayText: "Both regrowth & loss prevention",
          },
        ],
      },
    ],
    hair3: [
      {
        name: "hair page 3",
        type: "category",
        question: "Does anyone in your family have hair loss?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=hair",
        back_link: "?page=2&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "55",

        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair4: [
      {
        name: "hair page 4",
        type: "category",
        question:
          "Do you have any upcoming functions in the family in the next 30 days?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=hair",
        back_link: "?page=3&type=hair",
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "66",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair5: [
      {
        name: "hair page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=6&type=hair",
        back_link: "?page=4&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "66",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    hair6: [
      {
        name: "hair page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=hair",
        back_link: "?page=5&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "71.5",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair7: [
      {
        name: "skin page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=hair",
        back_link: "?page=6&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "77",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair8: [
      {
        name: "hair page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=hair",
        back_link: "?page=7&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "82.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    hair9: [
      {
        name: "hair page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=hair",
        back_link: "?page=8&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "88",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    hair10: [
      {
        name: "hair page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=hair",
        back_link: "?page=9&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "93.5",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    hair11: [
      {
        name: "Hair page 3",
        type: "category",
        question: `How often do you smoke or drink?`,
        clickHandler: choice_clickHandler,
        CustomComponent: { CustomRadio },
        state_Obj: stateObj,
        proceed_link: "?page=12&type=hair",
        back_link: "?page=10&type=hair",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: `Daily`,
            displayText: `Daily`,
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair12: [
      {
        name: "hair page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How long have you been struggling with hair loss?",
        state_Obj: stateObj,
        proceed_link: "?page=13&type=hair",
        back_link: "?page=11&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: "Days",
            displayText: "Days",
          },
          {
            value: "Months",
            displayText: "Months",
          },
          {
            value: "Years",
            displayText: "Years",
          },
        ],
      },
    ],
    hair13: [
      {
        name: "hair page 13",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What was your hair structure like before hair loss? ",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=hair",
        back_link: "?page=12&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: "Thick",
            displayText: "Thick",
          },
          {
            value: "Medium",
            displayText: "Medium",
          },
          {
            value: "Thin",
            displayText: "Thin",
          },
        ],
      },
    ],
    hair14: [
      {
        name: "Hair page 5",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        state_Obj: stateObj,
        proceed_link: "?page=15&type=hair",
        back_link: "?page=13&type=hair",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ],
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"],
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"],
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Diabetes"],
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"],
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ],
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ],
            displayText: "Others",
            onChange: checkBoxHandler,
          },
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined))
          },
        ]
      },
    ],
    hair15: [
      {
        name: "Hair page 15",
        type: "category",
        question: `Have you used hair products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=14&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used hair products before?"] == "Yes")
          },
        ]
      },
    ],
    appointment: [
      {
        name: "Appointment page",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?",
        state_Obj: stateObj,
        proceed_link: "?recommendation=yes",
        back_link: getBackPage(),
        required: "true",
        consultation_completion_status:"completed",
        options: [
          {
            value: "Yes, please",
            displayText: "Yes, please",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
    recommendation: [
      {
        name: "Appointment page",
        type: "recommendation",
        clickHandler: choice_clickHandler,
        stateObj: stateObj,
        conditionMet: true,
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
  };

  const allPages_Mars_Short = {
    assessment: [
      {
        name: "assessment_page",
        type: "assessment",
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
    category: [
      {
        name: "category",
        type: "category",
        question: "Select category for consultation",
        clickHandler: choice_clickHandler,
        inputHandler: choice_clickHandler,
        state_Obj: stateObj,
        set_url_function: redirect_to_set_query_params,
        proceed_link: `?userinfo=yes`,
        back_link: "?assessment=yes",
        required: "true",
        options: [
          {
            displayText: "Skin",
            value: "skin",
          },
          {
            value: "weightloss",
            displayText: "Wellness",
          },
          {
            value: "hair",
            displayText: "Hair",
          },
          {
            value: "performance",
            displayText: "Performance",
          },
          {
            value: "beard",
            displayText: "Beard",
          },
        ],
      },
    ],
    userinfo: [
      {
        name: "userinfo",
        type: "category",
        question: "Fill up the details below :",
        clickHandler: clickHandler_clear,
        state_Obj: stateObj,
        set_url_function: { redirect_to_set_query_params },
        proceed_link: `?page=1&type=${stateObj["Select category for consultation"]}`,
        back_link: "?category=yes",
        overlay_screen_text: "Tell me about yourself",
        delay_time: "1000",
        conditionMet:
          stateObj["Name"] &&
          phone_number_check(stateObj["Phone Number"]),
        consultation_completion_status:"started",
        inputOptions: [
          {
            placeholder: "Eg: John Doe",
            requiredErrorText: "Please enter name",
            heading: "Name",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Name"],
            validity: stateObj["Name"],
          },
          {
            placeholder: "Eg: 9876543210",
            requiredErrorText: "Please enter valid phone number",
            heading: "Phone Number",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Phone Number"],
            inputMode: "numeric",
            validity: phone_number_check(),
            inputCheck: input_check,
          },
        ],
      },
    ],
    hair1: [
      {
        name: "hair page 1",
        type: "category",
        question: "What best describes the current condition of your hair?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=hair",
        back_link: "?userinfo=yes",
        required: "true",
        options: [
          {
            value: "Receding hairline",
            displayText: "Receding hairline",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-two.png?v=1661159739",
          },
          {
            value: "Thinning at the crown",
            displayText: "Thinning at the crown",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-four.png?v=1661159718",
          },
          {
            value: "Overall hair loss/thinning",
            displayText: "Overall hair loss/thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-one.png?v=1661159739",
          },
          {
            value: "Receding + Overall thinning",
            displayText: "Receding + Overall thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-three.png?v=1661159739",
          },
        ],
      },
    ],
    hair2: [
      {
        name: "hair page 2",
        type: "category",
        question: "What results are you looking for?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=hair",
        back_link: "?page=1&type=hair",
        delay_time: 1000,
        overlay_screen_text:  ` Hair loss affects 60.5 % of the total Men population in World`,
        required: "true",
        options: [
          {
            value: "Regrowing your hair",
            displayText: "Regrowing your hair",
          },
          {
            value: "Preventing future hair loss",
            displayText: "Preventing future hair loss",
          },
          {
            value: "Both regrowth & loss prevention",
            displayText: "Both regrowth & loss prevention",
          },
        ],
      },
    ],
    hair3: [
      {
        name: "hair page 3",
        type: "category",
        question: "Does anyone in your family have hair loss?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=hair",
        back_link: "?page=2&type=hair",
        delay_time: 3000,
        overlay_screen_text: `50% of the male pattern baldness can be attributed due to  hereditary roots.
        However, hereditary male pattern baldness is treatable by taking early 
        preventive actions`,
        conditionMet: true,
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair4: [
      {
        name: "hair page 4",
        type: "category",
        question: "Have you had a history of allergic reactions to any medicines?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=hair",
        back_link: "?page=3&type=hair",
        delay_time: 3000,
        overlay_screen_text: `Knowing your medical allergies helps us to suggest the best treatment 
        plan for you`,
        conditionMet: true,
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair5: [
      {
        name: "hair page 5",
        type: "category",
        question:
          "Do you have any upcoming functions in the family in the next 60 days?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=4&type=hair",
        delay_time: 3000,
        overlay_screen_text: `FACT: Every time we try a new medication it takes time for our body to 
        react. Similarly, we can observe minimal hair loss when we start to use
        minoxidil for a few days`,
        required: "true",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    weightloss1: [
      {
        name: "Weight loss page 1",
        type: "category",
        question: `Please enter your height and weight below`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=weightloss",
        back_link: "?userinfo=yes",
        conditionMet: stateObj["Height"] && stateObj["Weight"],
        delay_time: 3000,
        overlay_screen_text: `Answer few questions so we can help`,
        inputOptions: [
          {
            heading: "Height",
            placeholder: "Height(in cms)",
            requiredErrorText: "Please enter valid height to proceed",
            value: stateObj["Height"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Height"],
            inputCheck: input_check,
          },
          {
            heading: "Weight",
            placeholder: process.env.REACT_APP_COUNTRY != 'USA' ? "Weight(in Kgs)" : "Weight(in Pounds)",
            requiredErrorText: "Please enter valid weight to proceed",
            value: stateObj["Weight"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Weight"],
            inputCheck: input_check,
          },
        ],
      },
    ],
    weightloss2: [
      {
        name: "Weight loss page 2",
        type: "category",
        question: `What best describes your current body condition?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=weightloss",
        back_link: "?page=1&type=weightloss",
        overlay_screen_text:
          "Measuring your weight everyday helps you lose weight faster",
        delay_time: "3000",
        input_none: true,
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "OverWeight/Obese"
              ] || 0,
            displayText: "OverWeight/Obese",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak bones/muscles"
              ] || 0,
            displayText: "Weak bones/muscles",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak Joints"
              ] || 0,
            displayText: "Weak Joints",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Knee/Shoulder/Joint Pain"
              ] || 0,
            displayText: "Knee/Shoulder/Joint Pain",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Body Fatigue"
              ] || 0,
            displayText: "Body Fatigue",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stress/Hormonal Imbalance"
              ] || 0,
            displayText: "Stress/Hormonal Imbalance",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stretch Marks on the skin"
              ] || 0,
            displayText: "Stretch Marks on the skin",
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss3: [ 
      {
        name: "Weight loss page 5",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=weightloss",
        back_link: "?page=2&type=weightloss",
        conditionMet: true,
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ] || 0,
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"] ||
              0,
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"] ||
              0,
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Diabetes"
              ] || 0,
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"] ||
              0,
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ] || 0,
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ] || 0,
            displayText: "Others",
            onChange: checkBoxHandler,
          }
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            // disable: !Object.keys(stateObj[`Do you have any pre-existing health issues?`])?.filter((x) => 
            // stateObj[`Do you have any pre-existing health issues?`][x] == true )?.includes("Others")
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined)) 
          },
        ]
      },
    ],
    weightloss4: [
      {
        name: "Weight loss page 4",
        type: "category",
        question: `Have you ever had allergic reactions to any of the components below?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=3&type=weightloss",
        required: false,
        conditionMet: false,
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Glucosamine"] || 0,
            displayText: `Glucosamine`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Chondroitin"] || 0,
            displayText: `Chondroitin`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Methylsulfonylmethane(MSM)"] || 0,
            displayText: `Methylsulfonylmethane(MSM)`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["None"] || 0,
            displayText: `None`,
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    skin1: [
      {
        name: "skin page 1",
        type: "category",
        question: "What are you concerned about?",
        clickHandler: choice_clickHandler,
        category_key: "category",
        state_Obj: stateObj,
        proceed_link: "?page=2&type=skin",
        back_link: "?userinfo=yes",
        required: "true",
        options: [
          {
            value: "Open pores",
            displayText: "Open pores",
          },
          {
            value: "Pigmentation",
            displayText: "Pigmentation",
          },
          {
            value: "Active Acne",
            displayText: "Active Acne",
          },
          {
            value: "Aging",
            displayText: "Aging",
          },
          {
            value: "Dark circles",
            displayText: "Dark circles",
          },
          {
            value: "Spots & Marks",
            displayText: "Spots & Marks",
          },
          {
            value: "Dull Skin",
            displayText: "Dull Skin (general skincare)",
          },
        ],
      },
    ],
    skin2: [
      {
        name: "skin page 2",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What is your skin type?",
        state_Obj: stateObj,
        proceed_link: "?page=3&type=skin",
        back_link: "?page=1&type=skin",
        delay_time: 3000,
        overlay_screen_text: `Skin concerns are unique to each individual and one needs the right care
        to keep up with good skin health`,
        conditionMet: true,
        options: [
          {
            value: "Oily",
            displayText: "Oily",
          },
          {
            value: "Dry",
            displayText: "Dry",
          },
          {
            value: "Normal ",
            displayText: "Normal ",
          },
        ],
      },
    ],
    skin3: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Are you allergic to any of these ingredients?",
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=2&type=skin",
        delay_time: 3000,
        overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        required: "true",
        options: [
          {
            value: "Vitamin C",
            displayText: "Vitamin C",
          },
          {
            value: "Salicylic Acid",
            displayText: "Salicylic Acid",
          },
          {
            value: "Retinol",
            displayText: "Retinol",
          },
          {
            value: "Kojic Acid",
            displayText: "Kojic Acid",
          },
          {
            value: "None",
            displayText: "None",
          },
        ],
      },
    ],
    beard1: [
      {
        name: "beard page 1",
        type: "category",
        question: "How is your beard condition currently?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=beard",
        back_link: "?userinfo=yes",
        required: "true",
        options: [
          {
            value: "Patchy beard",
            displayText: "Patchy beard",
          },
          {
            value: "No Beard",
            displayText: "No beard",
          },
          {
            value: "Very less beard",
            displayText: "Very less beard (Only mustaches and chin hair)",
          },
          {
            value: "Excellent",
            displayText: "Excellent beard, just need something for beard care",
          },
        ],
      },
    ],
    beard2: [
      {
        name: "beard page 2",
        type: "category",
        question: "Does anyone in your family have beard growth issues?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=beard",
        back_link: "?page=1&type=beard",
        delay_time: 3000,
        overlay_screen_text: `The speed of your beard growth is controlled by things like your
        genetics, your levels of testosterone and DHT, your lifestyle habits.`,
        conditionMet: true,
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    beard3: [
      {
        name: "beard page 3",
        type: "category",
        question: "How do you trim your beard?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=2&type=beard",
        conditionMet: true,
        options: [
          {
            value: "I generally shave my beard",
            displayText: "I generally shave my beard",
          },
          {
            value: "I use a trimmer to shape it up",
            displayText: "I use a trimmer to shape it up",
          },
        ],
      },
    ],
    performance1: [
      {
        name: "performance page 2",
        type: "category",
        question: "How is your sexual drive over the last year?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=performance",
        back_link: "?userinfo=yes",
        conditionMet: true,
        options: [
          {
            value: `Low (Don’t feel like doing it)`,
            displayText: `Low (Don’t feel like doing it)`,
          },
          {
            value: "Medium (sometimes feel like doing it)",
            displayText: "Medium (Sometimes feel like doing it)",
          },
          {
            value: "High (Regularly feel like doing it)",
            displayText: "High (Regularly feel like doing it)",
          },
        ],
      },
    ],
    performance2: [
      {
        name: "performance page 2",
        type: "category",
        question:
          "How often do you have trouble getting or keeping an erection during sex?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=performance",
        back_link: "?page=1&type=performance",
        required: true,
        options: [
          {
            value: `Every time`,
            displayText: `Every time`,
          },
          {
            value: "Half of the time",
            displayText: "Half of the time",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
        ],
      },
    ],
    performance3: [
      {
        name: "performance page 3",
        type: "category",
        question:
          "How often are you climaxing sooner than you would like during sex?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=performance",
        back_link: "?page=2&type=performance",
        delay_time: 1000,
        overlay_screen_text: `40% of Men experience symptoms like this by the age of 40`,
        required: true,
        options: [
          {
            value: `Every time`,
            displayText: `Every time`,
          },
          {
            value: "Half of the time",
            displayText: "Half of the time",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "No issues with ejaculation",
            displayText: "No issues with ejaculation",
          },
        ],
      },
    ],
    performance4: [
      {
        name: "performance page 4",
        type: "category",
        question: "Do you have any existing or any history of Heart issues?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=performance",
        back_link: "?page=3&type=performance",
        delay_time: 3000,
        overlay_screen_text: `30-40% of the Men experience this at some point in their lives.
        Understanding more about your condition helps us suggest the 
        best-suited plan for you`,
        required: true,
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
          {
            value: "Have high blood pressure, but don’t have any heart issues",
            displayText:
              "Have high blood pressure, but don’t have any heart issues",
          },
        ],
      },
    ],
    performance5: [
      {
        name: "performance page 5",
        type: "category",
        question:
          "Do you experience cramps or tiredness while performing sex? ",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=4&type=performance",
        delay_time: 3000,
        overlay_screen_text: `Knowing your physical strength during intercourse helps us 
        navigate to the right treatment for you`,
        conditionMet: true,
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    appointment: [
      {
        name: "Appointment page",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?",
        state_Obj: stateObj,
        proceed_link: "?recommendation=yes",
        back_link: getBackPage(),
        required: "true",
        consultation_completion_status:"completed",
        options: [
          {
            value: "Yes, please",
            displayText: "Yes, please",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
    recommendation: [
      {
        name: "Appointment page",
        type: "recommendation",
        clickHandler: choice_clickHandler,
        stateObj: stateObj,
        conditionMet: true,
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
        options: [
          {
            value: "Yes, please ",
            displayText: "Yes, please ",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
  };

  const allPages_Mars_Long = {
    assessment: [
      {
        name: "assessment_page",
        type: "assessment",
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
      },
    ],
    category: [
      {
        name: "category",
        type: "category",
        question: "Select category for consultation",
        clickHandler: choice_clickHandler,
        inputHandler: choice_clickHandler,
        state_Obj: stateObj,
        set_url_function: redirect_to_set_query_params,
        proceed_link: `?userinfo=yes`,
        back_link: "?assessment=yes",
        required: "true",
        progress_bar: true,
        progress_bar_text: getProgressBarText(),
        progress_step: "11",
        options: [
          {
            displayText: "Skin",
            value: "skin",
          },
          {
            value: "weightloss",
            displayText: "Wellness",
          },
          {
            value: "hair",
            displayText: "Hair",
          },
          {
            value: "performance",
            displayText: "Performance",
          },
          {
            value: "beard",
            displayText: "Beard",
          },
        ],
      },
    ],
    userinfo: [
      {
        name: "userinfo",
        type: "category",
        question: "Fill up the details below :",
        state_Obj: stateObj,
        set_url_function: { redirect_to_set_query_params },
        proceed_link: `?page=1&type=${stateObj["Select category for consultation"]}`,
        back_link: "?category=yes",
        overlay_screen_text: "Tell me about yourself",
        delay_time: "1000",
        progress_bar: true,
        progress_bar_text: getProgressBarText(),
        progress_step: "22",
        conditionMet:
          stateObj["Name"] &&
          phone_number_check(stateObj["Phone Number"]),
        consultation_completion_status:"started",
        inputOptions: [
          {
            placeholder: "Eg: John Doe",
            requiredErrorText: "Please enter name",
            heading: "Name",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Name"],
            validity: stateObj["Name"],
          },
          {
            placeholder: "Eg: 9876543210",
            requiredErrorText: "Please enter valid phone number",
            heading: "Phone Number",
            clickHandler: choice_clickHandler,
            required: "*",
            value: stateObj["Phone Number"],
            inputMode: "numeric",
            validity: phone_number_check(),
            inputCheck: input_check,
          },
        ],
      },
    ],
    hair1: [
      {
        name: "hair page 1",
        type: "category",
        question: "What best describes the current condition of your hair?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=hair",
        back_link: "?userinfo=yes",
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "33",
        options: [
          {
            value: "Receding hairline",
            displayText: "Receding hairline",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-one.png?v=1661159739",
          },
          {
            value: "Thinning at the crown",
            displayText: "Thinning at the crown",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-two.png?v=1661159739",
          },
          {
            value: "Overall hair loss/thinning",
            displayText: "Overall hair loss/thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-three.png?v=1661159739",
          },
          {
            value: "Receding + Overall thinning",
            displayText: "Receding + Overall thinning",
            image_exists: true,
            image:
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/hair-two.png?v=1661159739",
          },
        ],
      },
    ],
    hair2: [
      {
        name: "hair page 2",
        type: "category",
        question: "What results are you looking for?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=hair",
        back_link: "?page=1&type=hair",
        delay_time: 1000,
        overlay_screen_text: `Hair loss affects 60.5 % of the total Men population in World`,
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "41.25",
        options: [
          {
            value: "Regrowing your hair",
            displayText: "Regrowing your hair",
          },
          {
            value: "Preventing future hair loss",
            displayText: "Preventing future hair loss",
          },
          {
            value: "Both regrowth & loss prevention",
            displayText: "Both regrowth & loss prevention",
          },
        ],
      },
    ],
    hair3: [
      {
        name: "hair page 3",
        type: "category",
        question: "Does anyone in your family have hair loss?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=hair",
        back_link: "?page=2&type=hair",
        conditionMet: true,
        delay_time: 3000,
        overlay_screen_text: `50% of the male pattern baldness can be attributed due to  hereditary roots.
        However, hereditary male pattern baldness is treatable by taking early 
        preventive actions`,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "49.5",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair4: [
      {
        name: "hair page 4",
        type: "category",
        question: "Have you had a history of allergic reactions to any medicines?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=hair",
        back_link: "?page=3&type=hair",
        conditionMet: true,
        delay_time: 1000,
        overlay_screen_text: `Knowing your medical allergies helps us to suggest the best treatment 
        plan for you`,
        delay_time: 1000,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "57.75",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair5: [
      {
        name: "hair page 5",
        type: "category",
        question:
          "Do you have any upcoming functions in the family in the next 60 days?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=6&type=hair",
        back_link: "?page=4&type=hair",
        required: "true",
        overlay_screen_text: `FACT: Every time we try a new medication it takes time for our body to 
        react. Similarly, we can observe minimal hair loss when we start to use
        minoxidil for a few days`,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "66",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    hair6: [
      {
        name: "hair page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=hair",
        back_link: "?page=5&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "71.5",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    hair7: [
      {
        name: "hair page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=hair",
        back_link: "?page=6&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "77",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair8: [
      {
        name: "hair page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=hair",
        back_link: "?page=7&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "82.5",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair9: [
      {
        name: "hair page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=hair",
        back_link: "?page=8&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "88",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    hair10: [
      {
        name: "hair page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=hair",
        back_link: "?page=9&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "93.5",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    hair11: [
      {
        name: "hair page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=12&type=hair",
        back_link: "?page=10&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "97",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    hair12: [
      {
        name: "Hair page 12",
        type: "category",
        question: `How often do you smoke or drink?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=13&type=hair",
        back_link: "?page=11&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: `Daily`,
            displayText: `Daily`,
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    hair13: [
      {
        name: "hair page 13",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How long have you been struggling with hair loss?",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=hair",
        back_link: "?page=12&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: "Days",
            displayText: "Days",
          },
          {
            value: "Months",
            displayText: "Months",
          },
          {
            value: "Years",
            displayText: "Years",
          },
        ],
      },
    ],
    hair14: [
      {
        name: "hair page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What was your hair structure like before hair loss?",
        state_Obj: stateObj,
        proceed_link: "?page=15&type=hair",
        back_link: "?page=13&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: "Thick",
            displayText: "Thick",
          },
          {
            value: "Medium",
            displayText: "Medium",
          },
          {
            value: "Thin",
            displayText: "Thin",
          },
        ],
      },
    ],
    hair15: [
      {
        name: "Hair page 5",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        state_Obj: stateObj,
        proceed_link: "?page=16&type=hair",
        back_link: "?page=14&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ],
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"],
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"],
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Diabetes"],
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"],
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ],
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ],
            displayText: "Others",
            onChange: checkBoxHandler,
          },
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined))
          },
        ]
      },
    ],
    hair16: [
      {
        name: "Hair page 15",
        type: "category",
        question: `Have you used hair products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=15&type=hair",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Hair",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used hair products before?"] == "Yes")
          },
        ]
      },
    ],
    beard1: [
      {
        name: "beard page 1",
        type: "category",
        question: "What exactly are you looking for?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=beard",
        back_link: "?userinfo=yes",
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "33",
        options: [
          {
            value: "Beard Growth",
            displayText: "Beard Growth",
          },
          {
            value: "Beard Care",
            displayText: "Beard Care",
          },
        ],
      },
    ],
    beard2: [
      {
        name: "beard page 2",
        type: "category",
        question: "How is your beard condition currently?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=beard",
        back_link: "?page=1&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "41.5",
        options: [
          {
            value: "Patchy beard",
            displayText: "Patchy beard",
          },
          {
            value: "No Beard",
            displayText: "No Beard",
          },
          {
            value: "Very less",
            displayText: "Very less (Only mustaches and chin hair)",
          },
          {
            value: "Excellent",
            displayText: "Excellent beard, just need something for beard care",
          },
        ],
      },
    ],
    beard3: [
      {
        name: "beard page 1",
        type: "category",
        question: "Does anyone in your family have beard growth issues?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=beard",
        back_link: "?page=2&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "49",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    beard4: [
      {
        name: "beard page 1",
        type: "category",
        question: "How do you trim your beard?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=beard",
        back_link: "?page=3&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "57.5",
        options: [
          {
            value: "I generally shave my beard",
            displayText: "I generally shave my beard",
          },
          {
            value: "I use a trimmer to shape it up",
            displayText: "I use a trimmer to shape it up",
          },
        ],
      },
    ],
    beard5: [
      {
        name: "beard page 5",
        type: "category",
        question:
          "Do you have any upcoming functions in the family in the next 30 days?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=6&type=beard",
        back_link: "?page=4&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "66",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    beard6: [
      {
        name: "beard page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=beard",
        back_link: "?page=5&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "71.5",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    beard7: [
      {
        name: "beard page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=beard",
        back_link: "?page=6&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "77",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    beard8: [
      {
        name: "beard page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=beard",
        back_link: "?page=7&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "82.5",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    beard9: [
      {
        name: "beard page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=beard",
        back_link: "?page=8&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "88",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    beard10: [
      {
        name: "beard page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=beard",
        back_link: "?page=9&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "93.5",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    beard11: [
      {
        name: "beard page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=12&type=beard",
        back_link: "?page=10&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "96",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    beard12: [
      {
        name: "beard page 12",
        type: "category",
        question: `How often do you smoke or drink?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=13&type=beard",
        back_link: "?page=11&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "100",
        options: [
          {
            value: `Daily`,
            displayText: `Daily`,
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    beard13: [
      {
        name: "beard page 13",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Since when are you facing beard loss?",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=beard",
        back_link: "?page=12&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "100",
        options: [
          {
            value: "Days",
            displayText: "Days",
          },
          {
            value: "Months",
            displayText: "Months",
          },
          {
            value: "Years",
            displayText: "Years",
          },
        ],
      },
    ],
    beard14: [
      {
        name: "beard page 5",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        state_Obj: stateObj,
        proceed_link: "?page=15&type=beard",
        back_link: "?page=13&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "100",
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ],
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"],
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"],
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Diabetes"],
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"],
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ],
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ],
            displayText: "Others",
            onChange: checkBoxHandler,
          },
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined))
          },
        ]
      },
    ],
    beard15: [
      {
        name: "beard page 15",
        type: "category",
        question: `Have you used beard products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=14&type=beard",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Beard",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used beard products before?"] == "Yes")
          },
        ]
      },
    ],
    skin1: [
      {
        name: "skin page 1",
        type: "category",
        question: "What are you concerned about?",
        clickHandler: choice_clickHandler,
        category_key: "category",
        state_Obj: stateObj,
        proceed_link: "?page=2&type=skin",
        back_link: "?userinfo=yes",
        delay_time: 1000,
        overlay_screen_text: `Answer a few questions so we can help`,
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "33",
        options: [
          {
            value: "Open pores",
            displayText: "Open pores",
          },
          {
            value: "Pigmentation",
            displayText: "Pigmentation",
          },
          {
            value: "Active Acne",
            displayText: "Active Acne",
          },
          {
            value: "Aging",
            displayText: "Aging",
          },
          {
            value: "Dark circles",
            displayText: "Dark circles",
          },
          {
            value: "Spots & Marks",
            displayText: "Spots & Marks",
          },
          {
            value: "Dull Skin",
            displayText: "Dull Skin (general skincare)",
          },
        ],
      },
    ],
    skin2: [
      {
        name: "skin page 2",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What is your skin type?",
        state_Obj: stateObj,
        proceed_link: "?page=3&type=skin",
        back_link: "?page=1&type=skin",
        delay_time: 3000,
        overlay_screen_text: `Skin concerns are unique to each individual and one needs the right care
        to keep up with good skin health`,
        // overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "37.5",
        options: [
          {
            value: "Oily",
            displayText: "Oily",
          },
          {
            value: "Dry",
            displayText: "Dry",
          },
          {
            value: "Normal ",
            displayText: "Normal ",
          },
        ],
      },
    ],
    skin3: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How frequently do you get Active Acne?",
        state_Obj: stateObj,
        proceed_link: "?page=4&type=skin",
        back_link: "?page=2&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "42",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Once a month or 2 months",
            displayText: "Once a month or 2 months",
          },
          {
            value: "Always have Active Acne",
            displayText: "Always have Active Acne",
          },
          {
            value: "Very rarely",
            displayText: "Very rarely",
          },
          {
            value: "No Active Acne",
            displayText: "No Active Acne",
          },
        ],
      },
    ],
    skin4: [
      {
        name: "skin page 4",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have blackheads/ whiteheads on your skin?",
        state_Obj: stateObj,
        proceed_link: "?page=5&type=skin",
        back_link: "?page=3&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "46.5",
        options: [
          {
            value: "Chin",
            displayText: "Chin",
          },
          {
            value: "Cheeks",
            displayText: "Cheeks",
          },
          {
            value: "Forehead",
            displayText: "Forehead",
          },
        ],
      },
    ],
    skin5: [
      {
        name: "skin page 5",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have any Active Acne scars or spots?",
        state_Obj: stateObj,
        proceed_link: "?page=6&type=skin",
        back_link: "?page=4&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "51",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    skin6: [
      {
        name: "skin page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have active pimples/Pitted Active Acne?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=skin",
        back_link: "?page=5&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "55.5",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    skin7: [
      {
        name: "skin page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Do you have wrinkles or early signs of skin aging?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=skin",
        back_link: "?page=6&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "60",
        options: [
          {
            value: "No wrinkles",
            displayText: "No wrinkles",
          },
          {
            value: "Early signs of ageing",
            displayText: "Early signs of ageing",
          },
          {
            value: "I have wrinkles around my eyes and cheeks",
            displayText: "I have wrinkles around my eyes and cheeks",
          },
          {
            value: "I have ageing lines on my forehead",
            displayText: "I have ageing lines on my forehead",
          },
        ],
      },
    ],
    skin8: [
      {
        name: "skin page 8",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Where are the wrinkles on your face?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=skin",
        back_link: "?page=7&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "66",
        options: [
          {
            value: "Around the eyes",
            displayText: "Around the eyes",
          },
          {
            value: "Around the nose",
            displayText: "Around the nose",
          },
          {
            value: "Around the mouth",
            displayText: "Around the mouth",
          },
          {
            value: "Around the lips",
            displayText: "Around the lips",
          },
          {
            value: "None of the above",
            displayText: "None of the above",
          },
        ],
      },
    ],
    skin9: [
      {
        name: "skin page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=skin",
        back_link: "?page=8&type=skin",
        overlay_screen_text:
          "We would love to get to know you better! Can you tell us more about your lifestyle?",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "71.5",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    skin10: [
      {
        name: "skin page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=skin",
        back_link: "?page=9&type=skin",
        conditionMet: true,
        overlay_screen_text: "There is nothing like mom's meals!",
        delay_time: 1000,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "77",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin11: [
      {
        name: "skin page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=12&type=skin",
        back_link: "?page=10&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "82.5",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin12: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=13&type=skin",
        back_link: "?page=11&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "88",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    skin13: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=skin",
        back_link: "?page=12&type=skin",
        overlay_screen_text:
          "A good diet and sufficient rest are crucial to maintaining healthy skin.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "93.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    skin14: [
      {
        name: "skin page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=15&type=skin",
        back_link: "?page=13&type=skin",
        overlay_screen_text:
          "Let's not tell your boss how many hours you worked yesterday.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "96",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    skin15: [
      {
        name: "skin page 15",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you smoke or drink?",
        state_Obj: stateObj,
        proceed_link: "?page=16&type=skin",
        back_link: "?page=14&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    skin16: [
      {
        name: "skin page 3",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Are you allergic to any of these ingredients?",
        state_Obj: stateObj,
        proceed_link: "?page=17&type=skin",
        back_link: "?page=15&type=skin",
        delay_time: 3000,
        overlay_screen_text: `It's important to listen to our bodies and understand allergies before beginning any treatment.`,
        required: "true",
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Vitamin C",
            displayText: "Vitamin C",
          },
          {
            value: "Salicylic Acid",
            displayText: "Salicylic Acid",
          },
          {
            value: "Retinol",
            displayText: "Retinol",
          },
          {
            value: "Kojic Acid",
            displayText: "Kojic Acid",
          },
          {
            value: "None",
            displayText: "None",
          },
        ],
      },
    ],
    skin17: [
      {
        name: "Skin page 17",
        type: "category",
        question: `Do you have any pre-existing health issues?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=18&type=skin",
        back_link: "?page=16&type=skin",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        checkboxOptions: [
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Cholestrol"
              ],
            displayText: "Cholestrol",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Thyroid"],
            displayText: "Thyroid",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Heart"],
            displayText: "Heart",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Diabetes"],
            displayText: "Diabetes",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.["Kidney"],
            displayText: "Kidney",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "No such problems"
              ],
            displayText: "No such problems",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`Do you have any pre-existing health issues?`]?.[
                "Others"
              ],
            displayText: "Others",
            onChange: checkBoxHandler,
          },
        ],
        inputOptions: [
          {
            heading: "Specify",
            clickHandler: choice_clickHandler,
            value: stateObj["Other problems"],
            invisible: !(stateObj[`Do you have any pre-existing health issues?`]?.[
              "Others"] == (true || undefined))
          },
        ]
      },
    ],
    skin18: [
      {
        name: "skin page 18",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Have you ever had side effects from skin products?",
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=17&type=skin",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Skin",
        progress_step: "100",
        options: [
          {
            value: "Yes",
            displayText: "Yes",
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you ever had side effects from skin products?"] == "Yes")
          },
        ]
      },
    ],
    weightloss1: [
      {
        name: "Weight loss page 1",
        type: "category",
        question: `Please enter your height and weight below`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=weightloss",
        back_link: "?userinfo=yes",
        conditionMet: stateObj["Height"] && stateObj["Weight"],
        delay_time: 3000,
        overlay_screen_text: `Answer few questions so we can help`,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "33",
        inputOptions: [
          {
            heading: "Height",
            placeholder: "Height(in cms)",
            requiredErrorText: "Please enter valid height to proceed",
            value: stateObj["Height"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Height"],
            inputCheck: input_check,
          },
          {
            heading: "Weight",
            placeholder: process.env.REACT_APP_COUNTRY != 'USA' ? "Weight(in Kgs)" : "Weight(in Pounds)",
            requiredErrorText: "Please enter valid weight to proceed",
            value: stateObj["Weight"],
            inputMode: "numeric",
            clickHandler: choice_clickHandler,
            required: "*",
            validity: stateObj["Weight"],
            inputCheck: input_check,
          },
        ],
      },
    ],
    weightloss2: [
      {
        name: "Weight loss page 3",
        type: "category",
        question: `What best describes your current body condition?`,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=weightloss",
        back_link: "?page=1&type=weightloss",
        overlay_screen_text:
          "Your metabolism is highly responsive to your daily routine and adjusts accordingly.",
        delay_time: 3000,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "44",
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "OverWeight/Obese"
              ] || 0,
            displayText: "OverWeight/Obese",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak bones/muscles"
              ] || 0,
            displayText: "Weak bones/muscles",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Weak Joints"
              ] || 0,
            displayText: "Weak Joints",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Knee/Shoulder/Joint Pain"
              ] || 0,
            displayText: "Knee/Shoulder/Joint Pain",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Body Fatigue"
              ] || 0,
            displayText: "Body Fatigue",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stress/Hormonal Imbalance"
              ] || 0,
            displayText: "Stress/Hormonal Imbalance",
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[`What best describes your current body condition?`]?.[
                "Stretch Marks on the skin"
              ] || 0,
            displayText: "Stretch Marks on the skin",
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss3: [
      {
        name: "Weight loss page 2",
        type: "category",
        question: `How often do you eat in a day (including tea, coffee, fruits, salads, 
          and snacks)`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=weightloss",
        back_link: "?page=2&type=weightloss",
        overlay_screen_text:
          "Measuring your weight everyday helps you lose weight faster",
        delay_time: "3000",
        input_none: true,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "55",
        options: [
          {
            value: `Greater than 6 times`,
            displayText: `Greater than 6 times`,
          },
          {
            value: "4-6 times",
            displayText: "4-6 times",
          },
          {
            value: "3 times",
            displayText: "3 times",
          },
          {
            value: "Less than 3 times",
            displayText: "Less than 3 times",
          },
        ],
      },
    ],
    weightloss4: [
      {
        name: "weightloss page 4",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=5&type=weightloss",
        back_link: "?page=3&type=weightloss",
        overlay_screen_text:
          "We would love to get to know you better! Can you tell us more about your lifestyle?",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "66",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    weightloss5: [
      {
        name: "weight loss page 5",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=6&type=weightloss",
        back_link: "?page=4&type=weightloss",
        conditionMet: true,
        overlay_screen_text:
          "There's something special about outside food--tastier, love! Though homemade food is healthy :)",
        delay_time: 3000,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "71.5",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss6: [
      {
        name: "weightloss page 6",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=weightloss",
        back_link: "?page=5&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "77",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss7: [
      {
        name: "weight loss page 7",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=weightloss",
        back_link: "?page=6&type=weightloss",
        overlay_screen_text:
          "A good diet and sufficient rest are crucial to maintaining healthy skin.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "82.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    weightloss8: [
      {
        name: "weight loss page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=weightloss",
        back_link: "?page=7&type=weightloss",
        overlay_screen_text:
          "Let's not tell your boss how many hours you worked yesterday.",
        delay_time: 3000,
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "88",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    weightloss9: [
      {
        name: "skin page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=weightloss",
        back_link: "?page=8&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "93.5",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],  
    weightloss10: [
      {
        name: "Weight loss page 10",
        type: "category",
        question: `How often do you smoke or drink?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=11&type=weightloss",
        back_link: "?page=9&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Daily`,
            displayText: `Daily`,
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    weightloss11: [
      {
        name: "Weight loss page 11",
        type: "category",
        question: `How many days do you exercise in a week?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=12&type=weightloss",
        back_link: "?page=10&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Don't work out at all`,
            displayText: `Don't work out at all`,
          },
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "5-6 times a week",
            displayText: "5-6 times a week",
          },
          {
            value: "1-2 times a week",
            displayText: "1-2 times a week",
          },
        ],
      },
    ],
    weightloss12: [
      {
        name: "Weight loss page 4",
        type: "category",
        question: `Have you ever had allergic reactions to any of the components below?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=13&type=weightloss",
        back_link: "?page=11&type=weightloss",
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        required_check: true,
        checkboxOptions: [
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Glucosamine"] || 0,
            displayText: `Glucosamine`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Chondroitin"] || 0,
            displayText: `Chondroitin`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["Methylsulfonylmethane(MSM)"] || 0,
            displayText: `Methylsulfonylmethane(MSM)`,
            onChange: checkBoxHandler,
          },
          {
            value:
              stateObj[
                `Have you ever had allergic reactions to any of the components below?`
              ]?.["None"] || 0,
            displayText: `None`,
            onChange: checkBoxHandler,
          },
        ],
      },
    ],
    weightloss13: [
      {
        name: "Weight loss page 12",
        type: "category",
        question: `Have you used any healthcare/nutritional products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=12&type=weightloss",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Wellness",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used any healthcare/nutritional products before?"] == "Yes")
            // disable: !Object.keys(stateObj[`Do you have any pre-existing health issues?`])?.filter((x) => 
            // stateObj[`Do you have any pre-existing health issues?`][x] == true )?.includes("Others")
          },
        ]
      },
    ],
    performance1: [
      {
        name: "performance page 2",
        type: "category",
        question: "How is your sexual drive over the last year?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=2&type=performance",
        back_link: "?userinfo=yes",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "33",
        options: [
          {
            value: `Low (Don’t feel like doing it)`,
            displayText: `Low (Don’t feel like doing it)`,
          },
          {
            value: "Medium (sometimes feel like doing it)",
            displayText: "Medium (Sometimes feel like doing it)",
          },
          {
            value: "High (Regularly feel like doing it)",
            displayText: "High (Regularly feel like doing it)",
          },
        ],
      },
    ],
    performance2: [
      {
        name: "performance page 2",
        type: "category",
        question:
          "How often do you have trouble getting or keeping an erection during sex?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=3&type=performance",
        back_link: "?page=1&type=performance",
        input_none: true,
        required: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "41.5",
        options: [
          {
            value: `Every time`,
            displayText: `Every time`,
          },
          {
            value: "Half of the time",
            displayText: "Half of the time",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
        ],
      },
    ],
    performance3: [
      {
        name: "performance page 3",
        type: "category",
        question:
          "How often are you climaxing sooner than you would like during sex?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=4&type=performance",
        back_link: "?page=2&type=performance",
        required: true,
        delay_time: 1000,
        overlay_screen_text: `40% of Men experience symptoms like this by the age of 40`,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "49",
        options: [
          {
            value: `Every time`,
            displayText: `Every time`,
          },
          {
            value: "Half of the time",
            displayText: "Half of the time",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "No issues with ejaculation",
            displayText: "No issues with ejaculation",
          },
        ],
      },
    ],
    performance4: [
      {
        name: "performance page 4",
        type: "category",
        question: "Do you have any existing or any history of Heart issues?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=5&type=performance",
        back_link: "?page=3&type=performance",
        input_none: true,
        required: true,
        delay_time: 3000,
        overlay_screen_text: `30-40% of the Men experience this at some point in their lives.
        Understanding more about your condition helps us suggest the 
        best-suited plan for you`,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "57.5",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
          {
            value: "Have high blood pressure, but don’t have any heart issues",
            displayText:
              "Have high blood pressure, but don’t have any heart issues",
          },
        ],
      },
    ],
    performance5: [
      {
        name: "performance page 5",
        type: "category",
        question:
          "Do you experience cramps or tiredness while performing sex? ",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=6&type=performance",
        back_link: "?page=4&type=performance",
        conditionMet: true,
        delay_time: 3000,
        overlay_screen_text: `Knowing your physical strength during intercourse helps us 
        navigate to the right treatment for you`,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "66",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    performance6: [
      {
        name: "performance page 9",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many litres of water do you drink per day?",
        state_Obj: stateObj,
        proceed_link: "?page=7&type=performance",
        back_link: "?page=5&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "71.5",
        options: [
          {
            value: "1-2 litres",
            displayText: "1-2 litres",
          },
          {
            value: "2-3 litres",
            displayText: "2-3 litres",
          },
          {
            value: "3-4 litres",
            displayText: "3-4 litres",
          },
          {
            value: "4-5 litres",
            displayText: "4-5 litres",
          },
        ],
      },
    ],
    performance7: [
      {
        name: "performance page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat out?",
        state_Obj: stateObj,
        proceed_link: "?page=8&type=performance",
        back_link: "?page=6&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "77",
        options: [
          {
            value: "Once a week",
            displayText: "Once a week",
          },
          {
            value: "Multiple times a week",
            displayText: "Multiple times a week",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    performance8: [
      {
        name: "performance page 10",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you eat junk food?",
        state_Obj: stateObj,
        proceed_link: "?page=9&type=performance",
        back_link: "?page=7&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "82.5",
        options: [
          {
            value: "Frequently",
            displayText: "Frequently",
          },
          {
            value: "Rarely",
            displayText: "Rarely",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    performance9: [
      {
        name: "performance page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "What type of diet do you follow?",
        state_Obj: stateObj,
        proceed_link: "?page=10&type=performance",
        back_link: "?page=8&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "88",
        options: [
          {
            value: "Vegetarian including milk products",
            displayText: "Vegetarian including milk products",
          },
          {
            value: "Vegetarian without milk products",
            displayText: "Vegetarian without milk products",
          },
          {
            value: "Non-vegetarian",
            displayText: "Non-vegetarian",
          },
        ],
      },
    ],
    performance10: [
      {
        name: "performance page 12",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you sleep?",
        state_Obj: stateObj,
        proceed_link: "?page=11&type=performance",
        back_link: "?page=9&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "93.5",
        options: [
          {
            value: "3-5 hours",
            displayText: "3-5 hours",
          },
          {
            value: "5-6 hours",
            displayText: "5-6 hours",
          },
          {
            value: "6-8 hours",
            displayText: "6-8 hours",
          },
          {
            value: "8-10 hours",
            displayText: "8-10 hours",
          },
        ],
      },
    ],
    performance11: [
      {
        name: "performance page 14",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How many hours do you work in a day? ",
        state_Obj: stateObj,
        proceed_link: "?page=12&type=performance",
        back_link: "?page=10&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "96",
        options: [
          {
            value: "<9 hours",
            displayText: "<9 hours",
          },
          {
            value: "9-10 hours",
            displayText: "9-10 hours",
          },
          {
            value: "10-12 hours",
            displayText: "10-12 hours",
          },
          {
            value: "12 and above",
            displayText: "12 and above",
          },
        ],
      },
    ],
    performance12: [
      {
        name: "performance page 15",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "How often do you smoke or drink?",
        state_Obj: stateObj,
        proceed_link: "?page=13&type=performance",
        back_link: "?page=11&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: "Daily",
            displayText: "Daily",
          },
          {
            value: "Occasionally",
            displayText: "Occasionally",
          },
          {
            value: "Never",
            displayText: "Never",
          },
        ],
      },
    ],
    performance13: [
      {
        name: "performance page 15",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "Since how long you are married?",
        state_Obj: stateObj,
        proceed_link: "?page=14&type=performance",
        back_link: "?page=12&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: "Days",
            displayText: "Days",
          },
          {
            value: "Months",
            displayText: "Months",
          },
          {
            value: "Years",
            displayText: "Years",
          },
        ],
      },
    ],
    performance14: [
      {
        name: "performance page 5",
        type: "category",
        question:
          "Do you want to increase sexual performance duration?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=15&type=performance",
        back_link: "?page=13&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
      },
    ],
    performance15: [
      {
        name: "performance page 5",
        type: "category",
        question:
          "Do you have observed Erectile dysfunction problem?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=16&type=performance",
        back_link: "?page=14&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"Input in days,months or years",
            heading: "Since how long(ED problem)",
            clickHandler: choice_clickHandler,
            value: stateObj["Since how long(ED problem)"],
            invisible: !(stateObj["Do you have observed Erectile dysfunction problem?"] == "Yes")
          },
        ]
      },
    ],
    performance16: [
      {
        name: "performance page 5",
        type: "category",
        question:
          "Do you have observed Pre-mature ejactulation problem?",
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?page=17&type=performance",
        back_link: "?page=15&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"Input in days,months or years",
            heading: "Since how long(PE problem)",
            clickHandler: choice_clickHandler,
            value: stateObj["Since how long(PE problem)"],
            invisible: !(stateObj["Do you have observed Pre-mature ejactulation problem?"] == "Yes")
          },
        ]
      },
    ],
    performance17: [
      {
        name: "Hair page 15",
        type: "category",
        question: `Have you used performance care products before?`,
        clickHandler: choice_clickHandler,
        state_Obj: stateObj,
        proceed_link: "?appointment=yes",
        back_link: "?page=16&type=performance",
        conditionMet: true,
        progress_bar: true,
        progress_bar_text: "My Performance",
        progress_step: "100",
        options: [
          {
            value: `Yes`,
            displayText: `Yes`,
          },
          {
            value: "No",
            displayText: "No",
          },
        ],
        inputOptions: [
          {
            placeholder:"List all products here",
            heading: "Healthcare products used",
            clickHandler: choice_clickHandler,
            value: stateObj["Healthcare products used"],
            invisible: !(stateObj["Have you used performance care products before?"] == "Yes")
          },
        ]
      },
    ],
    appointment: [
      {
        name: "Appointment page",
        type: "category",
        clickHandler: choice_clickHandler,
        question: "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?",
        state_Obj: stateObj,
        proceed_link: "?recommendation=yes",
        back_link: getBackPage(),
        required: "true",
        consultation_completion_status:"completed",
        options: [
          {
            value: "Yes, please",
            displayText: "Yes, please",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
    
    recommendation: [
      {
        name: "Appointment page",
        type: "recommendation",
        clickHandler: choice_clickHandler,
        stateObj: stateObj,
        conditionMet: true,
        data: {
          bannerHeader: `Know what's right for you`,
          bannerSubText:
            "Get your self assessment done, Book an appointment with our expert, get a personalized treatment plan.",
          bannerImageSrc:
            "https://cdn.shopify.com/s/files/1/0638/1391/0746/files/Doctor.png?v=1649252836",
        },
        options: [
          {
            value: "Yes, please ",
            displayText: "Yes, please ",
          },
          {
            value: "No, just tell me what to use",
            displayText: "No, just tell me what to use",
          },
        ],
      },
    ],
  };

  const mappings = {
    assessment: ({ data }) => (
      <LandingPage
        bannerHeader={data.bannerHeader}
        bannerSubText={data.bannerSubText}
        bannerImageSrc={data.bannerImageSrc}
        set_url_function={redirect_to_set_query_params}
        clickHandler={clickHandler_clear}
      />
    ),
    category: ({
      name,
      options,
      question,
      state_Obj,
      clickHandler,
      inputHandler,
      back_link,
      proceed_link,
      delay_time,
      overlay_screen_text,
      directNavigate,
      navigateTo,
      inputOptions,
      checkboxOptions,
      conditionMet,
      required,
      required_check,
      progress_bar,
      progress_bar_text,
      progress_step,
      consultation_completion_status
    }) => (
      <ChoicePage
        question={question}
        clickHandler={clickHandler}
        state_Obj={state_Obj}
        CustomComponent={CustomRadio}
        CustomInputComponent={InputCard}
        back_link={back_link}
        proceed_link={proceed_link}
        set_url_function={redirect_to_set_query_params}
        delay_time={delay_time}
        overlay_screen_text={overlay_screen_text}
        directNavigate={directNavigate}
        navigateTo={navigateTo}
        inputHandler={inputHandler}
        options={options}
        inputOptions={inputOptions}
        checkboxOptions={checkboxOptions}
        conditionMet={conditionMet}
        required={required}
        required_check={required_check}
        progress_bar={progress_bar}
        progress_bar_text={progress_bar_text}
        progress_step={progress_step}
        consultation_completion_status={consultation_completion_status}
      />
    ),
    recommendation: ({ stateObj, data }) => (
      <Recommendation
        stateObj={stateObj}
        bannerHeader={data.bannerHeader}
        bannerSubText={data.bannerSubText}
        bannerImageSrc={data.bannerImageSrc}
      />
    ),
  };

  return (
    <div className="main-container">
      <form>
        <DynamicFieldBuilder
          fields={builder_fields}
          mappings={mappings}
          fieldContext={{ isVisible: true }}
        />
      </form>
    </div>
  );
}
