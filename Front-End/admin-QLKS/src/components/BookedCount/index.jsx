import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getBookingCount } from "../../services/dashboardService";

const BookedCount = forwardRef(function BookedCount({ year }, ref) {
    const [dataBooked, setDataBooked] = useState(0);

    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                value: dataBooked
            };
        }
    }));

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getBookingCount(year);
            setDataBooked(response);
        }
        fetchApi();
    }, [year])

    console.log("booking count", dataBooked);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataBooked}</h2>
        </>
    )
});

export default BookedCount;