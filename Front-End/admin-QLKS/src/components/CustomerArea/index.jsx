import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getCustomerRegisterByMonth } from "../../services/dashboardService";
import { Area } from "@ant-design/charts";

const CustomerArea = forwardRef(function CustomerArea({ year }, ref) {
    const [dataCustomer, setDataCustomer] = useState([]);

    useImperativeHandle(ref, () => ({
        getData: () => {
            return dataCustomer;
        }
    }));

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getCustomerRegisterByMonth(year);
            // console.log(response);
            setDataCustomer(response);
        }
        fetchApi();
    }, [year]);

    console.log("customer", dataCustomer);
    
    const config = {
        data: dataCustomer,
        xField: "month",
        yField: "count",
        smooth: true,
        point: true,
        slider: {
            start: 0,
            end: 1
        }
    }
    return (
        <>
            <h1>Biểu đồ khách hàng đăng kí năm {year}</h1>
            <Area {...config} />
        </>
    )
});

export default CustomerArea;