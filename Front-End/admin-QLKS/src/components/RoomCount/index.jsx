import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getRoomCount } from "../../services/dashboardService";

const RoomCount = forwardRef(function RoomCount(props, ref) {
    const [dataRoom, setDataRoom] = useState(0);

    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                value: dataRoom
            };
        }
    }));

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getRoomCount();
            setDataRoom(response);
        }
        fetchApi();
    }, [])

    console.log("room", dataRoom);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataRoom}</h2>
        </>
    )
});

export default RoomCount;