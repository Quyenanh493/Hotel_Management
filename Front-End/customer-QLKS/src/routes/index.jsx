import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import LayoutDefault from "../layout/LayoutDefault";
import Error404 from "../pages/Error404";
import { Spin } from "antd";
import ProtectedBookingRoute from "../components/ProtectedBookingRoute";

// Lazy load components
const Home = lazy(() => import("../pages/Home"));
const Room = lazy(() => import("../pages/Room"));
const Contact = lazy(() => import("../pages/Contact"));
const Introduce = lazy(() => import("../pages/Introduce"));
const Profile = lazy(() => import("../pages/Profile"));
const Logout = lazy(() => import("../pages/Logout"));
const RoomDetail = lazy(() => import("../pages/RoomDetail"));
const HotelDetail = lazy(() => import("../pages/RoomDetail")); // Reusing the same component but renamed
const BookingConfirmation = lazy(() => import("../pages/BookingConfirmation"));
const BookingAmenities = lazy(() => import("../pages/BookingAmenities"));
const HistoryRoom = lazy(() => import("../pages/HistoryRoom"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("../pages/PaymentFailure"));

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/room",
                element: <Room />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/introduce",
                element: <Introduce />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/logout",
                element: <Logout />
            },
            {
                path: "/room-detail/:roomId",
                element: <RoomDetail />
            },
            {
                path: "/hotel-detail/:hotelId",
                element: <HotelDetail />
            },
            {
                path: "/booking-confirmation",
                element: <BookingConfirmation />
            },
            {
                path: "/booking-amenities",
                element: <ProtectedBookingRoute><BookingAmenities /></ProtectedBookingRoute>
            },
            {
                path: "/history-room",
                element: <HistoryRoom />
            },
            {
                path: "/payment/success",
                element: <PaymentSuccess />
            },
            {
                path: "/payment/failed",
                element: <PaymentFailure />
            },
        ],
    },
    {
        path: "*",
        element: <Error404 />
    },
];

const router = createBrowserRouter(routes);

export default router;