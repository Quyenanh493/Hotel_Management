import LayoutDefault from "../layout/LayoutDefault";
import Error404 from "../pages/Error404";
import Customers from "../pages/Customers";
import Room from "../pages/Room";
import RoomReview from "../pages/RoomReview";
import Dashboard from "../pages/DashBoard";
import Hotel from "../pages/Hotel";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import ProtectedRoute from "../components/ProtectedRoute";
import User from "../pages/User";
import FactBooking from "../pages/FactBooking";
import Payment from "../pages/Payment";
import Amenities from "../pages/Amenities";
import Account from "../pages/Account";
import Permission from "../pages/Permission";
import Role from "../pages/Role";

export const routes = [
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <LayoutDefault />,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    {
                        path: "/hotel",
                        element: <Hotel />
                    },
                    {
                        path: "/customers",
                        element: <Customers />
                    },
                    {
                        path: "/user",
                        element: <User />
                    },
                    {
                        path: "/bookings/room",
                        element: <Room />
                    },
                    {
                        path: "/bookings/roomReview",
                        element: <RoomReview />
                    },
                    {
                        path: "/bookings/factBooking",
                        element: <FactBooking />
                    },
                    {
                        path: "/bookings/payment",
                        element: <Payment />
                    },
                    {
                        path: "/amenities",
                        element: <Amenities />
                    },
                    {
                        path: "/account",
                        element: <Account />
                    },
                    {
                        path: "/permission",
                        element: <Permission />
                    },
                    {
                        path: "/role",
                        element: <Role />
                    }
                ],
            },
        ],
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "*",
        element: <Error404 />
    },
];