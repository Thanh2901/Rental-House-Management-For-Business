import React, {Component} from "react";
import { useLocation, Navigate } from "react-router-dom";
import ApiService from "./ApiService.js";

export const TenantRouter = ({element: Component}) => {
    const location = useLocation();
    return ApiService.isAuthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    )
}

export const AdminRouter = ({element: Component}) => {
    const location = useLocation();
    return ApiService.isAdmin() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    )
}