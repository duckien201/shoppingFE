import React, { useState } from "react";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import moment from "moment";

const BarChart = ({ orders = [] }) => {
    const [viewBy, setViewBy] = useState('day'); // State to manage view option

    const aggregatedData = orders?.reduce((acc, order) => {
        const date = viewBy === 'day'
            ? moment(order.createDate).format('YYYY-MM-DD')
            : moment(order.createDate).format('YYYY-MM');

        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += order?.totalOrder * 5 / 100;
        return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const dataValues = Object.values(aggregatedData);

    const data = {
        labels,
        datasets: [
            {
                label: viewBy === 'day' ? "Lợi nhuận theo ngày" : "Lợi nhuận theo tháng",
                data: dataValues,
                backgroundColor: "#02b844",
                borderWidth: 1,
                borderColor: "#000000",
            }
        ]
    }

    return (
        <MDBContainer style={{ backgroundColor: "white" }}>
            <div style={{ textAlign: "end", marginBottom: "20px" }}>
                <button 
                    onClick={() => setViewBy('day')} 
                    style={{ 
                        marginRight: "10px", 
                        border: "none", 
                        fontSize: "13px", 
						padding: "5px 10px",
                        backgroundColor: viewBy === 'day' ? "#f0f0f0" : "white" ,
						color: viewBy === 'day' ? "#000" : "#007bff",
						borderRadius: "5px"
                    }}
                >
                    Xếp theo ngày
                </button>
                <button 
                    onClick={() => setViewBy('month')} 
                    style={{ 
                        border: "none", 
                        fontSize: "13px", 
						padding: "5px 10px",
                        backgroundColor: viewBy === 'month' ? "#f0f0f0" : "white" ,
						color: viewBy === 'month' ? "#000" : "#007bff",
						borderRadius: "5px"
                    }}
                >
                    Xếp theo tháng
                </button>
            </div>
            <Bar data={data} style={{ maxHeight: '600px' }} />
        </MDBContainer>
    );
}

export default BarChart;
