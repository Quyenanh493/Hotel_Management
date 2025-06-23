import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getTotalRevenue } from "../../services/dashboardService";

const Revenue = forwardRef(function Revenue({ year }, ref) {
    const [dataRev, setDataRev] = useState(0);
    
    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                value: dataRev
            };
        }
    }));
    
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getTotalRevenue(year);
            // console.log(response);
            setDataRev(response);
        }
        fetchApi();
    }, [year]);

    console.log("revenue", dataRev);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataRev} VNĐ</h2>
        </>
    )
});

export default Revenue;