import { checkIfUserLoggedIn } from "./checkForLogin.middleware.js";

export const checkUserLoggedInMiddleware = async (req, res, next) => {
    try {
        let refreshToken = req.cookies.refreshToken;

        // If refreshToken is not found in cookies, try to extract from local storage
        if (!refreshToken && typeof window !== 'undefined') {
            refreshToken = window.localStorage.getItem('refreshToken');
        }

        if (!refreshToken) {
            const loggedUser = null;
            return next();
        }

        const loggedUser = await checkIfUserLoggedIn(refreshToken);
        req.loggedUser = loggedUser; // Attach the logged-in user to the request object
        next(); // Call next middleware
    } catch (error) {
        // Handle errors
        console.error("Error in checkUserLoggedInMiddleware:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};
// export const checkUserLoggedInMiddleware = async (req, res, next) => {
//     try {
//         const refreshToken = req.headers.authorization;
//         // Extract the refreshToken from local storage
//         // refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : null;
//         console.log(refreshToken);
//         if (!refreshToken) {
//             const loggedUser = null;
//             return next();
//         }

//         const loggedUser = await checkIfUserLoggedIn(refreshToken);
//         console.log(loggedUser);
//         req.loggedUser = loggedUser; // Attach the logged-in user to the request object
//         next(); // Call next middleware
//     } catch (error) {
//         // Handle errors
//         console.error("Error in checkUserLoggedInMiddleware:", error);
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };
