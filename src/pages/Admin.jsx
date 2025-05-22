import React, { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [errorReservations, setErrorReservations] = useState(null);
  const [reservationFilter, setReservationFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [reservationSort, setReservationSort] = useState({ key: 'date', direction: 'asc' });
  const [orderSort, setOrderSort] = useState({ key: 'created_at', direction: 'desc' });
  const [errorOrders, setErrorOrders] = useState(null);
  const [reservationCurrentPage, setReservationCurrentPage] = useState(1);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this number

  useEffect(() => {
    // Fetch Reservations
    fetch('/api/reservation')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for reservations`);
        }
        return response.json();
      })
      .then(data => {
        setReservations(data);
      })
      .catch(error => {
        setErrorReservations(new Error(handleApiError(error)));
      });

    // Fetch Orders
    fetch('/api/order')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for orders`);
        }
        return response.json();
      })
      .then(data => {
        setOrders(data);
      })
      .catch(error => {
        setErrorOrders(new Error(handleApiError(error)));
      })
      .finally(() => {
        setLoading(false); // Set loading to false after both fetches are complete
      });
  }, []);

  const handleReservationFilterChange = (e) => {
    setReservationFilter(e.target.value);
  };

  const handleOrderFilterChange = (e) => {
    setOrderFilter(e.target.value);
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (key === 'date' || key === 'created_at') {
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        if (direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        if (direction === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      } else {
        if (direction === 'asc') {
          return valA - valB;
        } else {
          return valB - valA;
        }
      }
    });
  };

  const handleReservationSort = (key) => {
    setReservationSort(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleOrderSort = (key) => {
    setOrderSort(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredReservations = reservations.filter(
    (reservation) =>
      Object.values(reservation).some(
        (value) => value && value.toString().toLowerCase().includes(reservationFilter.toLowerCase())
      )
  );

  const filteredOrders = orders.filter(order =>
    Object.values(order).some(value =>
      value && typeof value !== 'object' && value.toString().toLowerCase().includes(orderFilter.toLowerCase())
    )
  );

  // Apply sorting to filtered data
  const sortedFilteredReservations = sortData(filteredReservations, reservationSort.key, reservationSort.direction);
  const sortedFilteredOrders = sortData(filteredOrders, orderSort.key, orderSort.direction);

  // Pagination logic
  const indexOfLastReservation = reservationCurrentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = sortedFilteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  
  const indexOfLastOrder = orderCurrentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedFilteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginateReservations = (pageNumber) => setReservationCurrentPage(pageNumber);
  const paginateOrders = (pageNumber) => setOrderCurrentPage(pageNumber);

  // Pagination controls
  const reservationPageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredReservations.length / itemsPerPage); i++) {
    reservationPageNumbers.push(i);
  }

  const orderPageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / itemsPerPage); i++) {
    orderPageNumbers.push(i);
  }

  return (
    <div className="container mt-4">
      <h1>Admin Panel</h1>
      {loading && <p>Loading data...</p>}

      {/* Reservations Section */}
      <h2>Reservations</h2>
      {errorReservations && <p>Error loading reservations: {errorReservations.message}</p>}
      {!loading && !errorReservations && (
        <>
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter reservations..."
                  value={reservationFilter}
                  onChange={handleReservationFilterChange}
                />
              </div>
              <Table striped bordered hover responsive className="mb-4">
                <thead>
                  <tr>
                    <th onClick={() => handleReservationSort('id')}>ID {reservationSort.key === 'id' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('name')}>Name {reservationSort.key === 'name' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('email')}>Email {reservationSort.key === 'email' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('phone')}>Phone {reservationSort.key === 'phone' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('date')}>Date {reservationSort.key === 'date' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('time')}>Time {reservationSort.key === 'time' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleReservationSort('guests')}>Guests {reservationSort.key === 'guests' && (reservationSort.direction === 'asc' ? '▲' : '▼')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map(reservation => (
                    <tr key={`reservation-${reservation.id}`}>
                      <td>{reservation.id}</td>
                      <td>{reservation.name}</td>
                      <td>{reservation.email}</td>
                      <td>{reservation.phone}</td>
                      <td>
                        {reservation.date ? new Date(reservation.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td>{reservation.time}</td>
                      <td>{reservation.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => paginateReservations(reservationCurrentPage - 1)} disabled={reservationCurrentPage === 1} />
                {reservationPageNumbers.map(number => (
                  <Pagination.Item key={number} active={number === reservationCurrentPage} onClick={() => paginateReservations(number)}>
                    {number}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginateReservations(reservationCurrentPage + 1)} disabled={reservationCurrentPage === reservationPageNumbers.length} />
              </Pagination>
            </>
          )}
        </>
      )}

      {/* Orders Section */}
      <h2>Orders</h2>
      {errorOrders && <p>Error loading orders: {errorOrders.message}</p>}
      {!loading && !errorOrders && (
        <>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter orders..."
                  value={orderFilter}
                  onChange={handleOrderFilterChange}
                />
              </div>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th onClick={() => handleOrderSort('id')}>ID {orderSort.key === 'id' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleOrderSort('customer_name')}>Customer Name {orderSort.key === 'customer_name' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleOrderSort('customer_email')}>Customer Email {orderSort.key === 'customer_email' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleOrderSort('customer_phone')}>Customer Phone {orderSort.key === 'customer_phone' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th>Order Items</th>
                    <th onClick={() => handleOrderSort('total_amount')}>Total Amount {orderSort.key === 'total_amount' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleOrderSort('created_at')}>Order Date {orderSort.key === 'created_at' && (orderSort.direction === 'asc' ? '▲' : '▼')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map(order => (
                    <tr key={`order-${order.id}`}>
                      <td>{order.id}</td>
                      <td>{order.customer_name || 'N/A'}</td>
                      <td>{order.customer_email || 'N/A'}</td>
                      <td>{order.customer_phone || 'N/A'}</td>
                      <td>
                        <ul>
                          {order.order_items && Array.isArray(order.order_items) && order.order_items.map((item, index) => (
                            <li key={index}>
                              {item.name} (x{item.quantity}) - {item.price ? `${item.price.toFixed(2)} € each` : `${item.amount ? item.amount.toFixed(2) : 'N/A'} €`}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{order.total_amount ? order.total_amount.toFixed(2) : 'N/A'} €</td>
                      <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => paginateOrders(orderCurrentPage - 1)} disabled={orderCurrentPage === 1} />
                {orderPageNumbers.map(number => (
                  <Pagination.Item key={number} active={number === orderCurrentPage} onClick={() => paginateOrders(number)}>
                    {number}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginateOrders(orderCurrentPage + 1)} disabled={orderCurrentPage === orderPageNumbers.length} />
              </Pagination>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;