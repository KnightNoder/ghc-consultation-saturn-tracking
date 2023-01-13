const axios = require("axios");

export function getProductId (stateObj, assessment_type) {
  // const hair_current_condition = window.localStorage.getItem(
  //   "hair_current_condition"
  // );
  // const past_allergy = window.localStorage.getItem("past_allergy");
  // const big_event_120_days = window.localStorage.getItem("big_event_120_days");
  // const age = window.localStorage.getItem("age");
  // switch (choice) {
  //   case "Hairfall":
  //     if (hair_current_condition == "Condition one") {
  //       return "6933666726052";
  //     } else if (hair_current_condition == "Condition two") {
  //       return "6920580530340";
  //     } else if (
  //       (hair_current_condition == "Condition three" ||
  //         hair_current_condition == "Condition four") &&
  //       past_allergy == "no" &&
  //       parseInt(age) > 30
  //     ) {
  //       return "6920192950436";
  //     } else if (
  //       (hair_current_condition == "Condition three" ||
  //         hair_current_condition == "Condition four") &&
  //       (past_allergy == "yes" || big_event_120_days == "yes")
  //     ) {
  //       return "6920580530340";
  //     } else {
  //       return "6732124520612";
  //     }
  //   case "Beard":
  //     const beard_stage = window.localStorage.getItem("beard_condition");
  //     if (
  //       beard_stage == "Patchy Beard" ||
  //       beard_stage == "No Beard growth" ||
  //       beard_stage == "Very less"
  //     )
  //       return "6980058677412";
  //     else return "6743341072548";
  //   case "WeightLoss":
  //     const weight = parseInt(window.localStorage.getItem("weight"));
  //     const height = parseInt(window.localStorage.getItem("height"));
  //     const BMI = (weight * 10000) / (height * height);
  //     if (BMI > 25) return "6679222288548";
  //     else if (BMI > 22 && BMI <= 25) return "6774754902180";
  //     else return "6766304428196";
  //   case "Performance":
  //     const erection_case = window.localStorage.getItem("erection_problem");
  //     const ejaculation_case = window.localStorage.getItem("ejaculation_case");
  //     const history_of_heart_issues = window.localStorage.getItem(
  //       "history_of_heart_issues"
  //     );
  //     if (
  //       (erection_case ==
  //         "Sometimes, I have issues with maintaining erection" ||
  //         erection_case ==
  //           "Most of the times, I have issues with getting & maintaining an erection") &&
  //       ejaculation_case == "Ejaculate too early during performance" &&
  //       history_of_heart_issues == "No"
  //     )
  //       return "5805028966564";
  //     else if (
  //       (erection_case ==
  //         "Sometimes, I have issues with maintaining erection" ||
  //         erection_case ==
  //           "Most of the times, I have issues with getting & maintaining an erection") &&
  //       ejaculation_case == "Ejaculate too early during performance" &&
  //       history_of_heart_issues != "No"
  //     )
  //       return "6734347174052";
  //     else if (
  //       erection_case == "No issues in maintaining erection" &&
  //       ejaculation_case == "Ejaculate too early during performance"
  //     )
  //       return "6734347174052";
  //     else if (
  //       erection_case == "No issues in maintaining erection" &&
  //       history_of_heart_issues == "No"
  //     )
  //       return "6718215651492";
  //     else return "6734347174052";
  //   case "Skin":
  //     const skin_concern = window.localStorage.getItem("skin_concern");
  //     const skin_allergy_to = window.localStorage.getItem("skin_allergy_to");
  //     if (skin_allergy_to == "None") {
  //       if (skin_concern == "Open pores") return "7524809375992";
  //       if (skin_concern == "Pigmentation") return "7524809375992";
  //       if (skin_concern == "Active Acne") return "6826093478052";
  //       if (skin_concern == "Aging") return "6877087105188";
  //       if (skin_concern == "Dark circles") return "7524809375992";
  //       if (skin_concern == "Acne marks & spots") return "7524809375992";
  //       if (skin_concern == "Dull Skin") return "7524809375992";
  //     } else if (skin_allergy_to == "Vitamin C") {
  //       if (skin_concern == "Open pores") return "7637440266488";
  //       if (skin_concern == "Pigmentation") return "7524810391800";
  //       if (skin_concern == "Active Acne") return "6826093478052";
  //       if (skin_concern == "Aging") return "6825877635236";
  //       if (skin_concern == "Dark circles") return "7637452128504";
  //       if (skin_concern == "Acne marks & spots") return "6826093478052";
  //       if (skin_concern == "Dull Skin") return "7516963406072";
  //     } else if (skin_allergy_to == "Salicylic Acid") {
  //       if (skin_concern == "Open pores") return "7516963406072";
  //       if (skin_concern == "Pigmentation") return "7524810391800";
  //       if (skin_concern == "Active Acne") return "7637452128504";
  //       if (skin_concern == "Aging") return "6973442228388";
  //       if (skin_concern == "Dark circles") return "7637473067256";
  //       if (skin_concern == "Acne marks & spots") return "7524810391800";
  //       if (skin_concern == "Dull Skin") return "7516963406072";
  //     } else if (skin_allergy_to == "Retinol") {
  //       if (skin_concern == "Open pores") return "7516963406072";
  //       if (skin_concern == "Pigmentation") return "7524810391800";
  //       if (skin_concern == "Active Acne") return "6826093478052";
  //       if (skin_concern == "Aging") return "6825877635236";
  //       if (skin_concern == "Dark circles") return "7637452128504";
  //       if (skin_concern == "Acne marks & spots") return "6826093478052";
  //       if (skin_concern == "Dull Skin") return "7637440266488";
  //     } else if (skin_allergy_to == "Niacinamide") {
  //       if (skin_concern == "Open pores") return "7524809375992";
  //       if (skin_concern == "Pigmentation") return "7524810391800";
  //       if (skin_concern == "Active Acne") return "7637452128504";
  //       if (skin_concern == "Aging") return "6825877635236";
  //       if (skin_concern == "Dark circles") return "6906399129764";
  //       if (skin_concern == "Acne marks & spots") return "7524810391800";
  //       if (skin_concern == "Dull Skin") return "6906399129764";
  //     } else if (skin_allergy_to == "Kojic Acid") {
  //       if (skin_concern == "Open pores") return "7516963406072";
  //       if (skin_concern == "Pigmentation") return "7524810391800";
  //       if (skin_concern == "Active Acne") return "6876951576740";
  //       if (skin_concern == "Aging") return "6825877635236";
  //       if (skin_concern == "Dark circles") return "6877027401892";
  //       if (skin_concern == "Acne marks & spots") return "6826093478052";
  //       if (skin_concern == "Dull Skin") return "7516963406072";
  //     }
  // }
  // const productId = getProductIdFromEngine(
  //   stateObj["questionnaire"],
  //   stateObj["Select category for consultation"]
  // );
};

export function getSendMailData (assessment_type, stateObj, productLink = "", productName = "") {
  const questionnaire = [];

  for (let key in stateObj) {
    if (
      key == "First Name" ||
      key == "Last Name" ||
      key == "Name" ||
      key == "Age" ||
      key == "Email" ||
      key == "Phone Number" ||
      key == "assessment_type" ||
      key == "Wasn’t that easy? Would you like a free consultation?" ||
      key == "Select category for consultation"
    ) {
    } else {
      if (key == "Do you have any pre-existing health issues?" || key == "What best describes your current body condition?" 
      || key == "Do you have any past allergic reactions to any of the below components?"  ||
      key == "Have you ever had allergic reactions to any of the components below?"){
        let problems = Object.keys(
          stateObj[key]
        );
        problems = problems.filter((problem) => {
          return stateObj[key][problem] == true;
        });
        problems = problems.toString();
        questionnaire.push({
          question: key,
          answer: problems,
        });
      } else {
        if(key == "Specify"){
          key = "Other problems"
          questionnaire.push({
            question: key,
            answer: stateObj["Specify"],
          });
        } else {
          questionnaire.push({
            question: key,
            answer: stateObj[key],
          });
        }
      }
    }
  }

  const data = JSON.stringify({
    firstName: stateObj["Name"],
    lastName: stateObj["Last Name"],
    age: stateObj["Age"],
    phone: stateObj["Phone Number"],
    email: stateObj["Email"],
    consultation_type: assessment_type,
    category:
      stateObj["Select category for consultation"] == "weightloss"
        ? "Wellness"
        : stateObj["Select category for consultation"],
    booking: stateObj["That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?"] == "Yes, please" ? 
    "Free consultation" : "Free recommendation",
    image: "",
    type: process.env.REACT_APP_BRAND.toLowerCase(),
    user_survey: questionnaire,
    productLink: productLink,
    productName: productName,
    consultation_completion_status:"completed"
  });

  return data;
};

export async function createDummyLead () {
  const state_object =  JSON.parse(window.localStorage.getItem("stateObj"));
  console.log(state_object,'state obj')
  const data = {
    "firstName": state_object.Name,
    "phone": state_object["Phone Number"],
    "consultation_type": state_object["assessment_type"],
    "category": state_object["Select category for consultation"],
    "booking": state_object["Free recommendation"] || "Free recommendation",
    "image": "",
    "type": "mars",
    "user_survey": [],
    "productLink": "",
    "productName": "",
    "consultation_completion_status":"started"
}
  const config = {
    method: "post",
    url: `http://${process.env.REACT_APP_SEND_MAIL_API_BASE_URL}/api/device/consultation`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

//   await fetch(`https://${process.env.REACT_APP_SEND_MAIL_API_BASE_URL}/api/device/consultation`, {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

  const response = await axios(config);
  console.log(response,'resp')
}
