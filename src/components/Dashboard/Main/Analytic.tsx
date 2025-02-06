import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Order {
    createdAt: string;
    total: number;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    totalOrders: number;
}

interface AnalyticsProps {
    data: {
        orders: Order[];
        customers: Customer[];
    };
}

export function Analytics({ data }: AnalyticsProps) {
    // Process the data to get daily totals
    const dailyData = data.orders.reduce((acc: { [key: string]: { date: string; revenue: number; orders: number } }, order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-CA')
        if (!acc[date]) {
            acc[date] = { date, revenue: 0, orders: 0 }
        }
        acc[date].revenue += order.total
        acc[date].orders += 1
        return acc
    }, {})

    const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 p-6 bg-gray-50">
            <Card className="col-span-4 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Sales Analytics</CardTitle>
                    <CardDescription className="text-gray-500">Daily revenue and order count</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis yAxisId="left" stroke="#888" />
                            <YAxis yAxisId="right" orientation="right" stroke="#888" />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                            <Legend 
                                wrapperStyle={{
                                    paddingTop: '10px',
                                }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-3 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Top Customers</CardTitle>
                    <CardDescription className="text-gray-500">Customers with the most orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {
                            data.customers
                                .sort((a, b) => b.totalOrders - a.totalOrders)
                                .slice(0, 5)
                                .map((customer) => (
                                    <li key={customer._id} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 mr-4 flex items-center justify-center font-semibold text-blue-600">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-sm font-medium text-gray-800">{customer.name}</div>
                                            <div className="text-sm text-gray-500">{customer.email}</div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-800">{customer.totalOrders} orders</div>
                                    </li>
                                ))
                        }
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}