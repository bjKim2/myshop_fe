import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm }) => {
  
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={`header-${index}`}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={`order-${index}`} onClick={() => openEditForm(item)}>
                <th>{index}</th>
                <th>{item.orderNum}</th>
                <th>{item.createdAt.slice(0, 10)}</th>
                <th>{item.userId.email}</th>
                {item.items.length > 0 ? (
                  <th>
                    {item.items[0].productId.name}
                    {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                  </th>
                ) : (
                  <th></th>
                )}

                <th>{item.shipTo.address + " " + item.shipTo.city}</th>

                <th>{currencyFormat(item.totalPrice)}</th>
                {item.paymentAmount ? <th>{currencyFormat(item.paymentAmount)}</th> : <th>{currencyFormat(item.totalPrice)}</th>}
                {item.couponId ? (  item.couponId.type !== "rate" ? 
                ( <th>{currencyFormat(item.couponId.discount)}원</th>) 
                : (<th>{item.couponId.discount}%</th>)) 
                : (  <th>쿠폰 미적용</th>)}
                {/* {item.couponId && item.couponId.type === "rate" && <th>{item.couponId.discount}%</th>} */}
                {/* {item.couponId && item.couponId.type !== "rate" && <th>{currencyFormat(item.couponId.discount)}원</th>} */}

                {/* {item.couponId ?  "rate" && <th>{currencyFormat(item.couponId.discount)}원</th>} */}
                <th>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default OrderTable;
