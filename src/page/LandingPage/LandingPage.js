import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner  } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";


const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  useEffect(() => {
    // 로딩 스피너
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);
  
  return (
    <Container>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
