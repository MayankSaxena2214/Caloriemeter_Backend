import jwt from "jsonwebtoken";
import { catchAsyncHandler } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./error.js";

export const isAuthenticated = catchAsyncHandler(async (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token ||  req.headers.token;
    console.log("Token is:",token)

    if (!token) {
        return next(new ErrorHandler("Authentication token is required", 401));
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach user data to the request object
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 403));
    }
});
