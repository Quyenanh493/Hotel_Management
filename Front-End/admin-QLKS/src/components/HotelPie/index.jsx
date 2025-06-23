import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getRevenueByHotel } from "../../services/dashboardService";
import { Pie } from "@ant-design/charts"

const HotelPie = forwardRef(function HotelPie({ year }, ref) {
    const [dataPie, setDataPie] = useState([]);
    
    useImperativeHandle(ref, () => ({
        getData: () => {
            return dataPie;
        }
    }));
    
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getRevenueByHotel(year);
            setDataPie(response);
        }
        fetchApi();
    }, [year]);
    
    const config = {
        data: dataPie,
        angleField: "totalRevenue",
        colorField: "hotelName",
        label: {
            type: 'spider',
            formatter: (datum) => `${datum.hotelName}\n${datum.totalRevenue ? datum.totalRevenue.toLocaleString() : 0} VNĐ`,
        },
        tooltip: {
            formatter: (datum) => ({
                name: datum.hotelName,
                value: (datum.totalRevenue ? datum.totalRevenue.toLocaleString() : 0) + ' VNĐ'
            })
        },
        legend: { position: 'right' },
        radius: 1,
        appendPadding: 10,
    }
    console.log("hotel", dataPie);

    return (
        <>
            <h1>Biểu đồ số tiền kiếm được của mỗi khách sạn {year}</h1>
            <Pie {...config} />
        </>
    )
});

export default HotelPie;