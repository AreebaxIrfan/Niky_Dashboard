import { ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, Tooltip, Line, Bar, CartesianGrid } from 'recharts';
import { Order, Customer } from '../types/charts'; // Define these types based on your Sanity schema

interface DataVisualizationProps {
  dataType: 'orders' | 'customers';
  data: Order[] | Customer[];
}

const processDateData = (data: Array<Order | Customer>) => {
  const dateMap = new Map();
  
  data.forEach(item => {
    const date = new Date(item.createdAt).toLocaleDateString();
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  return Array.from(dateMap, ([date, count]) => ({ date, count }));
};

export const DataVisualization = ({ dataType, data }: DataVisualizationProps) => {
  const chartData = processDateData(data);

  return (
    <div className="space-y-8">
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {dataType === 'orders' ? 'Order Trends' : 'Customer Activity'}
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {dataType === 'orders' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {dataType === 'orders' ? (
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => {
              if (dataType === 'orders') {
                const order = item as Order;
                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 text-sm truncate">{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              }
              
              const customer = item as Customer;
              return (
                <tr key={customer._id}>
                  <td className="px-6 py-4 text-sm">{customer.name}</td>
                  <td className="px-6 py-4 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};