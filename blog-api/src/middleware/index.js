import jwt from "jsonwebtoken";


const Authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    // Attach the decoded token payload to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default Authentication;
