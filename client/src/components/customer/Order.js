import react from 'react';
import NavMenu from '../NavMenu';
import { Table } from 'react-bootstrap';

const Order = () => {
  // const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:6969/api/v1/orders')
  //     .then((res) => {
  //       setOrders(res.data.orderList);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div>
      <NavMenu />
      <div>
        <div className='h1 py-4'>Orders</div>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Id</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* {orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>{order.date}</td>
                </tr>
              );
            })} */}
            <td>61cd640d9f5847d029053740</td>
            <td>44.44</td>
            <td>Processing</td>
            <td>2021-12-30</td>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Order;
