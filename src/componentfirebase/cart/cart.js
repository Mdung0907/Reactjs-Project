import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ProductDataServiceCart from "../service/product-services-tocart";
import ProductDataService from "../service/product-services";
import ProductDataServiceHistory from "../service/history-service";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
const Cart = ({ currentUser }) => {
  const [data, setdata] = useState([])
  const [cate, setcate] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fectProductcart()
      fectcategory()
    }
  }, [currentUser]);


  const fectProductcart = async () => {
    const data2 = await ProductDataServiceCart.getAllproductcartEmail(currentUser.email);
    setdata(data2.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const fectcategory = async () => {
    const data2 = await ProductDataService.getAllCategorys()
    setcate(data2.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  if (data.length === 0 || cate.length === 0) {
    return (
      <div style={{ display: 'block', width: 1000, padding: 30, margin: 'auto', textAlign: 'center' }}>
        <Spinner animation="grow" variant="warning" />
        <Row style={{
          margin: 'auto'
        }}><p>Giỏ hàng trống!</p></Row>
        <Row style={{
          margin: 'auto'
        }}><Button style={{ width: '100%' }} onClick={() => { navigate('/historypay') }}>Xem sản phẩm đã thanh toán</Button></Row>
      </div>
    )
  }
  function getNameCategory(id) {
    const check = cate.filter((item) => item.id === id)
    return check[0].name;
  }
  return (
    <Container>
      <Row>
        <Col>
          <h2>Giỏ hàng</h2>
          <Table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Hình ảnh</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{getNameCategory(item.category)}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td><img src={item.image} style={{ width: '100px' }} /></td>
                  <td>
                    <Button
                      onClick={async () => {
                        await ProductDataServiceCart.deleteProduct(item.id)
                        toast.success('Xóa thành công')
                        fectProductcart()
                      }}
                    >
                      Xóa
                    </Button>

                  </td>
                  <td>
                    <Button
                      onClick={async () => {
                        await ProductDataServiceHistory.addproduct(item.uid, item.name, item.price, item.category, item.quantity, item.description, item.image, item.usercreate);
                        await ProductDataServiceCart.deleteProduct(item.id)
                        fectProductcart()
                      }}
                    >
                      Thanh toán
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Row style={{
          margin: 'auto'
        }}><Button style={{ width: '20%' }} onClick={() => { navigate('/historypay') }}>Xem sản phẩm đã thanh toán</Button></Row>
      </Row>

    </Container >
  );
};
export default Cart;