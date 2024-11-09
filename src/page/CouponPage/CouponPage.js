import React, { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserCoupons } from "../../features/coupon/couponSlice"; // 쿠폰 데이터를 가져오는 액션

import { currencyFormat,cc_expires_format,convertToKoreanTime } from "../../utils/number";



const CouponPage = () => {
  const dispatch = useDispatch();
  const { couponList } = useSelector((state) => state.coupon);
  const [loading, setLoading] = useState(true);
  const availableCouponList = couponList.filter((coupon) => coupon.active);

  useEffect(() => {
    dispatch(getUserCoupons()).then(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h2>쿠폰함</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>쿠폰 이름</th>
            <th>할인</th>
            <th>최소 주문 금액</th>
            <th>유효기간</th>
          </tr>
        </thead>
        <tbody>
          {availableCouponList.length > 0 ? (
            availableCouponList.map((coupon, index) => (
              <tr key={coupon.id || index}>
                <td>{index + 1}</td>
                <td>{coupon.name}</td>
                {coupon.type === "rate" ? <td>{coupon.discount}%</td> : <td>₩ {currencyFormat(coupon.discount)}</td>}
                <td>{currencyFormat(coupon.minimumPurchase)}</td>
                <td>{convertToKoreanTime(coupon.expiry)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">사용 가능한 쿠폰이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CouponPage;
