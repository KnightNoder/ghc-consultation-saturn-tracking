import Header from "./Header";
import logo from "../images/mars-logo.png";
import doctor from "../images/doctor-small.png";
import phone from "../images/call.png";
import GenericButton from "./GenericButton";
import "../css/Recommendation.css";
import { useEffect, useState } from "react";
import "../css/ProceedTemplate.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const { sendMail } = require("../common/utils");
import { getSendMailData } from "../common/utils";
const { getProductIdFromEngine } = require("../common/engine");
const { getProductIdFromUSAEngine } = require("../common/usa-engine");
const axios = require("axios");

const CallBack = ({
  stateObj,
  bannerHeader,
  bannerSubText,
  bannerImageSrc,
}) => {
  const [image_1, Set_image_1] = useState("");
  const [price_1, Set_price_1] = useState("");
  const [compare_at_price_1, Set_compare_at_price_1] = useState("");
  const [title_1, Set_title_1] = useState("");
  const [product_link_1, Set_link_1] = useState("");

  const [image_2, Set_image_2] = useState("");
  const [price_2, Set_price_2] = useState("");
  const [compare_at_price_2, Set_compare_at_price_2] = useState("");
  const [title_2, Set_title_2] = useState("");
  const [product_link_2, Set_link_2] = useState("");

  const [bmi, Set_bmi] = useState("");
  const [disp, Set_disp] = useState(true);

  useEffect(() => {
    var product_id = "";
    let category = "";
    const product_id_promise = process.env.REACT_APP_COUNTRY == 'USA' ? getProductIdFromUSAEngine(stateObj) : getProductIdFromEngine(stateObj);
    product_id_promise
      .then(async(response) => {
        product_id = response;
        console.log(response,'resp')
        if (stateObj["assessment_type"] == "6 mins") {
          var product_id_1 = product_id[0];
          var product_id_2 = product_id[1];
        } else {
          var product_id_1 = product_id;
          
        }
        if (stateObj["Select category for consultation"] == "weightloss") {
          var weight = parseInt(stateObj["Weight"]);
          var height = parseInt(stateObj["Height"]);
          if(process.env.REACT_APP_COUNTRY == 'USA'){
            var BMI = parseInt((weight*0.45*10000) / (height * height))
          } else {
            var BMI = parseInt((weight * 10000) / (height * height));
          }
          Set_bmi(BMI);
        }

        if (stateObj["Select category for consultation"] == "weightloss") {
          category = "wellness";
        }
        if (stateObj["Select category for consultation"] == "hair") {
          if(process.env.REACT_APP_COUNTRY == 'USA'){
            category='hair';
          } else {
            category = (process.env.REACT_APP_BRAND == 'Saturn') ? "hair-products" : "hair-1"
          }
        }
        if (stateObj["Select category for consultation"] == "skin") {
          category = "skin";
        }

        if (stateObj["Select category for consultation"] == "beard") {
          category = "beard";
        }

        if (stateObj["Select category for consultation"] == "performance") {
          category = "performance";
        }

        const getData = async () => {
          var config = {
            method: "get",
            url: `https://${process.env.REACT_APP_GET_PRODUCTS_BASE_URL}/${category}/products.json?limit=250`,
            headers: {
              "Content-Type": "application/json",
            },
          };
          await axios(config)
            .then((response) => {
              const product_recommended_1 = response.data["products"].filter(
                (item) => item.id == product_id_1
              );

              let product_title_1 = product_recommended_1[0]["title"];
              const product_price_1 =
                product_recommended_1[0]["variants"][0]["price"];
              const compare_price_1 =
                product_recommended_1[0]["variants"][0]["compare_at_price"];
              const img_src_1 = product_recommended_1[0]["images"][0]["src"];
              const variant_id_1 =
                product_recommended_1[0]["variants"][0]["id"];
              const utm_tag =
                stateObj["assessment_type"] == "30 sec"
                  ? "utm_source=website-consultation&utm_medium=short-consultation&utm_campaign=recommended-product"
                  : "utm_source=website-consultation&utm_medium=long-consultation&utm_campaign=highly-recommended-product";
              const product_link_temp = `${variant_id_1}:1?checkout[shipping_address][first_name]=${stateObj["Name"].trim().replace(/\s/g, '+')}&checkout[shipping_address][phone]=${stateObj["Phone Number"].trim().replace(/\s/g, '')}&${utm_tag}`
              Set_link_1(product_link_temp);
              // Set_product_subtext(subtext);
              Set_title_1(product_title_1);
              Set_image_1(img_src_1);
              Set_price_1(product_price_1);
              Set_compare_at_price_1(compare_price_1);
              // Set_link(product_recommended[0]["handle"]);

              if (product_id_2) {
                const product_recommended_2 = response.data["products"].filter(
                  (item) => item.id == product_id_2
                );
                let product_title_2 = product_recommended_2[0]["title"];
                const product_price_2 =
                  product_recommended_2[0]["variants"][0]["price"];
                const compare_price_2 =
                  product_recommended_2[0]["variants"][0]["compare_at_price"];
                const img_src_2 = product_recommended_2[0]["images"][0]["src"];
                const variant_id_2 =
                  product_recommended_2[0]["variants"][0]["id"];
                Set_link_2(`${variant_id_2}:1?checkout[shipping_address][first_name]=${stateObj["Name"]}&checkout[shipping_address][phone]=${stateObj["Phone Number"]}&${utm_tag}`);
                Set_title_2(product_title_2);
                Set_image_2(img_src_2);
                Set_price_2(product_price_2);
                Set_compare_at_price_2(compare_price_2);
              }
              const data = getSendMailData(stateObj["assessment_type"], stateObj, product_link_temp, product_title_1);
              console.log(data,'mail data');
              const SendWhatsappMessage = async () => {
                const config = {
                  method: "post",
                  url: `https://${process.env.REACT_APP_SEND_MAIL_API_BASE_URL}/api/device/consultation`,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: data,
                };
                axios(config)
                  .then((response) => {
                    console.log("success");
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              };
              if(window.localStorage.getItem('visit_number') == 1){
                let form_id;
                if(process.env.REACT_APP_COUNTRY == 'USA'){
                  if(process.env.REACT_APP_BRAND == 'Saturn'){
                    form_id=process.env.REACT_APP_SATURN_FORM_SUBMIT_ID;
                  } else {
                    form_id=process.env.REACT_APP_MARS_FORM_SUBMIT_ID
                  }
                  const config = {
                    method: "post",
                    url: `https://submit-form.com/${form_id}`,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    data: data,
                  };
                  axios(config)
                    .then((response) => {
                      console.log("success");
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                } else {
                  SendWhatsappMessage();
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        };

        await getData();
      })
      .catch((error) => {
        console.log(error, "error");
      });

    setTimeout(() => {
      Set_disp(false);
    }, 4000);
  }, []);
  return (
    <>
      <div
        className={`${disp ? "show-overlay-screen" : "hide-overlay-screen"}`}
      >
        Our best minds are curating a personalized wellness plan for you
        <div className="progress-bar-saturn">
          <div className="in"></div>
        </div>
      </div>
      <Header
        bannerHeader={bannerHeader}
        bannerSubText={bannerSubText}
        bannerImageSrc={bannerImageSrc}
      />
      <div className="recommendation-section">
        <div className="doctor-info2" style={{ marginTop: "0%" }}>
          <div className="logo">
            <img
              src= { process.env.REACT_APP_BRAND == 'Saturn' ? "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/saturn.png?v=1659701745" : 
              "https://cdn.shopify.com/s/files/1/0607/6029/3588/files/mars-logo.png?v=1661108668"
            }
              className="image"
              alt=""
            />
          </div>
          <div className="details2">
            <div className="name-designation">
              <div className="name">
                Thank you for filling out the assessment!
              </div>
              {stateObj[
                "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?"
              ] == "Yes, please" ? (
                <div className="designation">
                  One of our health experts will call you shortly.
                </div>
              ) : (
                <div className="designation"> </div>
              )}
              <div className="designation">
                {stateObj[
                  "That was easy, wasn't it? Would you like a free consultation with our health experts for a more in-depth treatment plan?"
                ] == "Yes, please"
                  ? "Meanwhile,check out our recommended products."
                  : "Check out our recommended products."}
                
              </div>
            </div>
          </div>
        </div>
        <div className="product-info">
          <div className="product-header">
            <h3 className="shown-h3">We Recommend only the best for you</h3>
            <h3 className="hidden-h3">Our Recommendation</h3>
            {bmi ? (
              <div className="bmi">
                <div className="bmi-text">Your BMI</div>
                <div className="bmi-number">{bmi}</div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mobile-carousel">
            {/* <Carousel> */}
              <div className="product-card">
                <div className="image-section">
                  <img
                    src={image_1}
                    className="image"
                    alt="Product1"
                    srcset=""
                  />
                </div>
                <div className="details">
                  <div className="reco-1">Highly Recommended</div>
                  <div className="heading">
                    {title_1}
                  </div>
                  <div className="price">
                    {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                    {price_1}{" "}
                    {compare_at_price_1 ? (
                      <span className="strike-text">
                      &nbsp;&nbsp;<strike>
                      {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."} 
                      {compare_at_price_1}</strike>
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={`${
                      stateObj["assessment_type"] == "30 sec"
                        ? "no-display"
                        : ""
                    } buy-button product-checkout-button`}
                  >
                    <GenericButton
                      productNavigate="true"
                      productLink={product_link_1}
                      radiusBottom="true"
                      text={"Buy Now"}
                    />
                  </div>
                </div>
              </div>

              {(stateObj["assessment_type"] == "6 mins" && title_1 != title_2)? (
                <div className="product-card">
                  <div className="image-section">
                    <img
                      src={image_2}
                      className="image"
                      alt="Product1"
                      srcset=""
                    />
                  </div>
                  <div className="details">
                    <div className="reco-1">Recommended</div>
                    <div className="heading">
                      {title_2}
                    </div>
                    <div className="price">
                    {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                      {price_2}{" "}
                      {compare_at_price_2 ? (
                        <span className="strike-text">
                          &nbsp;&nbsp;<strike>
                          {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                          {compare_at_price_2}</strike>
                        </span>
                      ) : null}
                    </div>
                    <div className="buy-button product-checkout-button">
                      <GenericButton
                        productNavigate="true"
                        productLink={product_link_2}
                        radiusBottom="true"
                        text={"Buy Now"}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            {/* </Carousel> */}
          </div>
          <div className="no-mobile-carousel">
            <div className="product-card">
              <div className="image-section">
                <img src={image_1} className="image" alt="Product1" srcset="" />
              </div>
              <div className="details">
                <div className="reco-1">Highly Recommended</div>
                <div className="heading">
                  {title_1}
                </div>
                <div className="price">
                  {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                  {price_1}{" "}
                  {compare_at_price_1 ? (
                    <span className="strike-text">
                      &nbsp;&nbsp;<strike>
                      {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                      {compare_at_price_1}</strike>
                    </span>
                  ) : null}
                </div>
                <div
                  className={`${
                    stateObj["assessment_type"] == "30 sec" ? "no-display" : ""
                  } buy-button product-checkout-button`}
                >
                  <GenericButton
                    productNavigate="true"
                    productLink={product_link_1}
                    radiusBottom="true"
                    text={"Buy Now"}
                  />
                </div>
              </div>
            </div>

            {(stateObj["assessment_type"] == "6 mins" && title_1 != title_2 )? (
              <div className="product-card">
                <div className="image-section">
                  <img
                    src={image_2}
                    className="image"
                    alt="Product1"
                    srcset=""
                  />
                </div>
                <div className="details">
                  <div className="reco-1">Recommended</div>
                  <div className="heading">
                    {title_2}
                  </div>
                  <div className="price">
                  {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                    {price_2}{" "}
                    {compare_at_price_2 ? (
                      <span className="strike-text">
                        &nbsp;&nbsp;<strike>
                        {process.env.REACT_APP_COUNTRY == 'USA' ? "$" : "Rs."}
                        {compare_at_price_2}</strike>
                      </span>
                    ) : null}
                  </div>
                  <div className="buy-button product-checkout-button">
                    <GenericButton
                      productNavigate="true"
                      productLink={product_link_2}
                      radiusBottom="true"
                      text={"Buy Now"}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {stateObj["assessment_type"] == "30 sec" ? (
          <div className="product-checkout">
            <div className="proceed-container">
              <div className="proceed-button">
                <GenericButton
                  text="BUY NOW"
                  productNavigate="true"
                  productLink={product_link_1}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
    // <>
    // Hello
    // </>
  );
};

export default CallBack;
