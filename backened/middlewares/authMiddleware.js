import jwt from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).send({ success: false, message: "Token is missing" });

    const decoded = jwt.verify(token, process.env.Secret_Key);
    req.user = decoded; // Attach decoded token to req object
    next();
  } catch (error) {
    console.error("Error in requireSignIn:", error.message);
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};

export const requiresSignIn = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      // Fallback to cookie
      token = req.cookies.token;
      // console.log("Token from cookie:", token); // Debugging
    }

    if (!token) {
      // console.log("No token found in headers or cookies");
      return res.status(401).send({ success: false, message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.Secret_Key);
    // console.log("Decoded token:", decoded); // Debugging
    req.user = decoded; // Attach decoded token to req object
    next();
  } catch (error) {
    console.error("Error in requireSignIn:", error.message);
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ success: false, msg: "Unauthorized access" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    res.status(500).send({ success: false, message: "Error in admin middleware" });
  }
};

export const isInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res.status(403).send({ success: false, msg: "Unauthorized access" });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).send({ success: false, msg: "Unauthorized access" });
  }
  next();
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // Get token from cookies
    if (!token) return res.status(401).json({ success: false, message: "Token is missing" });

    const decoded = jwt.verify(token, process.env.Secret_Key);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}