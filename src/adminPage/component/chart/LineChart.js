import React, { useState } from "react";
import { MDBContainer } from "mdbreact";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';
import moment from "moment";

const LineChart = ({ orders = [] }) => {
    const [viewBy, setViewBy] = useState('day'); // State to manage view option

    // Aggregating data based on the view option (by day or by month)
    const aggregatedData = orders?.reduce((acc, order) => {
        const date = viewBy === 'day' 
            ? moment(order.createDate).format('YYYY-MM-DD')
            : moment(order.createDate).format('YYYY-MM');

        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {});

    // Convert aggregated data into chart data
    const labels = Object.keys(aggregatedData);
    const dataValues = Object.values(aggregatedData);

    const data = {
        labels,
        datasets: [
            {
                label: viewBy === 'day' ? "Số đơn đặt hàng theo ngày" : "Số đơn đặt hàng theo tháng",
                data: dataValues,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
            }
        ]
    };

    // Conditional styles for buttons
    const buttonStyle = (type) => ({
        marginRight: "10px",
        border: "none",
        fontSize: "13px",
        padding: "5px 10px",
        backgroundColor: viewBy === type ? "#f0f0f0" : "white",
        color: viewBy === type ? "#000" : "#007bff",
        cursor: "pointer",
        borderRadius: "5px"
    });

    return (
        <MDBContainer style={{ backgroundColor: "white" }}>
            <div style={{ textAlign: "end", marginBottom: "20px" }}>
                <button 
                    onClick={() => setViewBy('day')} 
                    style={buttonStyle('day')}
                >
                    Xếp theo ngày
                </button>
                <button 
                    onClick={() => setViewBy('month')} 
                    style={buttonStyle('month')}
                >
                    Xếp theo tháng
                </button>
            </div>
            <Line data={data} />
        </MDBContainer>
    );
};

export default LineChart;
