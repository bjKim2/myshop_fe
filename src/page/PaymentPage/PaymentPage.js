import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format,  currencyFormat } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";
import ToastMessage from "../../common/component/ToastMessage";
import { getUserCoupons } from "../../features/coupon/couponSlice"; // 쿠폰 목록 가져오기
import { toast } from "react-toastify";
import { showToastMessage } from "../../features/common/uiSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const { couponList } = useSelector((state) => state.coupon);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    dispatch(getUserCoupons());
  }, [dispatch]);

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
    const { firstName, lastName, contact, address, city, zip } = shipInfo;
    var paymentAmount = totalPrice;
    if (selectedCoupon) {
      paymentAmount = selectedCoupon.type === "rate" ? Math.floor(totalPrice*(-selectedCoupon.discount+100)/100) : totalPrice - selectedCoupon.discount;
      paymentAmount = Math.max(paymentAmount, 0);
    }

    dispatch(createOrder({
      totalPrice,
      shipInfo: { address, city, zip },
      contact: { firstName, lastName, contact },
      orderList: cartList.map((item) => { return { productId: item.productId._id, price: item.productId.price, size: item.size, qty: item.qty } }),
      paymentAmount,
      couponId: selectedCoupon?._id,
      // cardValue, 
      navigate
    }));
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const { name, value } = event.target;
    if (name === "expiry") {
      let newvalue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newvalue });
      return;
    };
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  const handleCouponSelect = (event) => {
    console.log("event",event.target.value);
    const selectedCouponId = event.target.value;
    const coupon = couponList.find(coupon => coupon._id === selectedCouponId);
    setSelectedCoupon(coupon);
    console.log("coupon",coupon);
    // setCouponMessage(`쿠폰 '${coupon.name}'이 선택되었습니다.`);
    // dispatch(showToastMessage(`쿠폰 '${coupon}'이 선택되었습니다.`, "success"));
  };

  if (cartList?.length === 0) {
    dispatch(ToastMessage("카트에 아이템이 없습니다.", "error"));
    navigate("/cart");
  }

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>

                <div className="coupon-select-area mb-3">
                  <Form.Group controlId="couponSelect">
                    <Form.Label>쿠폰 선택</Form.Label>
                    <Form.Control as="select" onChange={handleCouponSelect}>
                      <option value="">쿠폰을 선택하세요</option>
                      {couponList.map((coupon) => (
                        coupon.active &&
                        <option key={coupon._id} value={coupon._id}>
                          {coupon.name} - {coupon.type === "rate" ? `${coupon.discount}%` : `${currencyFormat(coupon.discount)}원`} 최소주문금액 {currencyFormat(coupon.minimumPurchase)}원
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {couponMessage && <Alert variant="info" className="mt-2">{couponMessage}</Alert>}
                </div>

                <div className="mobile-receipt-area">
                  {/* <OrderReceipt /> */}
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm cardValue={cardValue} handlePaymentInfoChange={handlePaymentInfoChange} handleInputFocus={handleInputFocus} />
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                  disabled={cartList.length === 0}
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} coupon={selectedCoupon} />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
