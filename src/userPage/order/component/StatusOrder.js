import { Popover, Steps } from 'antd';
import { useEffect, useState } from 'react';

const customDot = (dot) => (
    <Popover>
        {dot}
    </Popover>
);

const StatusOrder = ({ order }) => {
    const [current, setCurrent] = useState();

    useEffect(() => {
        if (order?.payMethod === "online") {
            switch (order?.status) {
                case 'Đang chờ thanh toán':
                    setCurrent(0);
                    break;
                case 'Chờ xác nhận':
                    setCurrent(1);
                    break;
                case 'Đang chuẩn bị hàng':
                    setCurrent(2);
                    break;
                case 'Đang vận chuyển':
                    setCurrent(3);
                    break;
                case 'Hoàn thành':
                    setCurrent(4);
                    break;
                default:
                    setCurrent(0);
            }
        } else {
            switch (order?.status) {
                case 'Chờ xác nhận':
                    setCurrent(0);
                    break;
                case 'Đang chuẩn bị hàng':
                    setCurrent(1);
                    break;
                case 'Đang vận chuyển':
                    setCurrent(2);
                    break;
                case 'Hoàn thành':
                    setCurrent(3);
                    break;
                default:
                    setCurrent(0);
            }
        }
    }, [order]);

    let item = [];
    if (order?.payMethod === "online") {
        item = [
            { title: 'Đang chờ thanh toán' },
            { title: 'Chờ xác nhận' },
            { title: 'Đang chuẩn bị hàng' },
            { title: 'Đang vận chuyển' },
            { title: 'Hoàn thành' },
        ];
    } else {
        item = [
            { title: 'Chờ xác nhận' },
            { title: 'Đang chuẩn bị hàng' },
            { title: 'Đang vận chuyển' },
            { title: 'Hoàn thành' },
        ];
    }

    return (
        <div style={{ padding: "50px 0" }}>
            <Steps
                current={current}
                progressDot={customDot}
                items={item}
            />
        </div>
    );
};

export default StatusOrder;
