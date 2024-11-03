import { Container } from "react-bootstrap"
import { MdContentPaste } from "react-icons/md";
import { PiShoppingBag } from "react-icons/pi";
import { Link } from "react-router-dom";
const SideBar = () => {
    const sidebarStyle = {
        width: "100%",
        padding: "5px 0",
        border: "none",
        textAlign: "start",
        display: "block",
        color: "black",
        textDecoration: "none"
    }
    return (
        <Container style={{ padding: "15px 30px", background: "white", marginTop: "2px" }}>
            <div><MdContentPaste /> Quản lý đơn hàng</div>
            <ul style={{ listStyle: "none" }}>
                {['Tất cả', 'Chờ xác nhận', 'Đang chuẩn bị hàng', 'Đang vận chuyển', 'Hoàn thành', 'Đã hủy'].map((label, index) => (
                    <li key={index}>
                        <Link
                            className="sidebar-button"
                            style={sidebarStyle}
                            to={`?statusOrder=${label}`}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div><PiShoppingBag /> Quản lý sản phẩm</div>
            <ul style={{ listStyle: "none" }}>
                <li><Link className="sidebar-button" style={sidebarStyle}>Tất cả sản phẩm</Link></li>
                <li><Link className="sidebar-button" style={sidebarStyle}>Thêm sản phẩm</Link></li>
            </ul>
        </Container>
    )
}
export default SideBar