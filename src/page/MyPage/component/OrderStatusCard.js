import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.image}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>상품 총액:₩ {currencyFormat(orderItem.totalPrice)}</div>
          {orderItem.couponId && orderItem.couponId.type === "rate" && (<div>쿠폰 적용: {currencyFormat(orderItem.couponId.discount)}%</div>) }
          {orderItem.couponId && orderItem.couponId.type !== "rate" && (<div>쿠폰 적용:₩ {currencyFormat(orderItem.couponId.discount)}</div>) }
          {orderItem.couponId && <div>결제 금액:₩ {currencyFormat(orderItem.paymentAmount)}</div>}
          {!orderItem.couponId && <div>쿠폰 미적용</div>}
          {!orderItem.couponId && <div>결제 금액:₩ {currencyFormat(orderItem.totalPrice)}</div>}
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
