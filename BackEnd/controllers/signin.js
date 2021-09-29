const handleSignIn = (req, res, postgres, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Bad Request, Incorrect form Submission!");
  }
  postgres
    .select("email", "hash")
    .where("email", "=", email)
    .from("login")
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return postgres
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else res.status(400).json("wrong credentials");
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignIn: handleSignIn,
};
