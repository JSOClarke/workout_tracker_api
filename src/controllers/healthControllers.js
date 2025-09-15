const healthCheck = async (req, res) => {
  console.log("Health check succesfull");
  res.status(200).json({ health: "Your all good brother man" });
};

export default healthCheck;
