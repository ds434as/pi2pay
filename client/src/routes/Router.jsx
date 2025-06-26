import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Mainlayout from "../layout/Mainlayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Payin from "../pages/payin/Payin";
import Payout from "../pages/payout/Payout";
import Payoutapproval from "../pages/payout/Payoutapproval";
import Prepayment from "../pages/prepayment/Prepayment";
import Prepaymenthistory from "../pages/prepaymenthistory/Prepaymenthistory";
import Newbalance from "../pages/balance/Newbalance";
import Salesreport from "../pages/salesreport/Salesreport";
import Addbankaccount from "../pages/bank/Addbankaccount";
import Bankaccount from "../pages/bank/Bankaccount";
import Commissions from "../pages/commission/Commissions";
import Registration from "../pages/Registration";
import PayInApproval from "../pages/approval/PayInApproval ";
import Viewbankaccount from "../pages/bank/Viewbankaccount";
import Checkout from "../pages/checkout/Checkout";
import Payoutrequest from "../pages/payout/Payoutrequest";
import Payoutreports from "../pages/salesreport/Payoutreports";
import Apidocs from "../pages/Apidocs";
import MerchantLogin from "../pages/merchant/MerchantLogin";
import Merchantlayout from "../layout/Merchantlayout";
import Mdashboard from "../pages/merchant/mdashboard/Mdashboard";
import Mpayment from "../pages/merchant/mpayment/Mpayment";
import Masterprofile from "../pages/merchant/masterprofile/Masterprofile";
import Masterpayin from "../pages/merchant/masterpayin/Masterpayin";
import Masterpayout from "../pages/merchant/masterpayout/Masterpayout";

const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

const isMerchantAuthenticated = () => {
  return localStorage.getItem('merchantData') !== null;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const MerchantProtectedRoute = ({ children }) => {
  if (!isMerchantAuthenticated()) {
    return <Navigate to="/merchant-login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const MerchantPublicRoute = ({ children }) => {
  if (isMerchantAuthenticated()) {
    return <Navigate to="/merchant" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: "/merchant-login",
    element: <MerchantPublicRoute><MerchantLogin /></MerchantPublicRoute>
  },
  {
    path: "/registration",
    element: <PublicRoute><Registration /></PublicRoute>
  },
  {
    path: "/payment/docs",
    element: <Apidocs />
  },
  {
    path: "/checkout/:paymentId",
    element: <Checkout />
  },
  {
    path: "/merchant",
    element: <MerchantProtectedRoute><Merchantlayout /></MerchantProtectedRoute>,
    children: [
      {
        path: "/merchant",
        element: <Mdashboard />
      },
      {
        path: "/merchant/payment-request",
        element: <Mpayment />
      },
      {
        path: "/merchant/profile",
        element: <Masterprofile />
      },
      {
        path: "/merchant/payin",
        element: <Masterpayin />
      },
      {
        path: "/merchant/payout",
        element: <Masterpayout />
      }
    ]
  },
  {
    path: "/",
    element: <ProtectedRoute><Mainlayout /></ProtectedRoute>,
    children: [
      { 
        path: "/dashboard",
        element: <Dashboard />
      },
      { 
        path: "/pay-in",
        element: <Payin />
      },
      { 
        path: "/pay-in-approval",
        element: <PayInApproval />
      },
      { 
        path: "/pay-out",
        element: <Payout />
      },
      { 
        path: "/pay-out-approval",
        element: <Payoutapproval />
      },
      { 
        path: "/prepayment-requests",
        element: <Prepayment />
      },
      { 
        path: "/prepayment-history",
        element: <Prepaymenthistory />
      },
      { 
        path: "/payout-request",
        element: <Payoutrequest />
      },
      { 
        path: "/payout-reports",
        element: <Payoutreports />
      },
      { 
        path: "/new-balance",
        element: <Newbalance />
      },
      { 
        path: "/sales-report",
        element: <Salesreport />
      },
      {
        path: "/add-bank-account",
        element: <Addbankaccount />
      },
      {
        path: "/bank-accounts",
        element: <Bankaccount />
      },
      {
        path: "/bank-account/:id",
        element: <Viewbankaccount />
      },
      {
        path: "/applied-commission",
        element: <Commissions />
      },
    ]
  }
]);

export default router;