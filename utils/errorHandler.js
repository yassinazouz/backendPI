function handleError(err, res) {
    console.error(err);
    res.status(500).send({ error: "An unexpected error occurred" });
}

module.exports = handleError;
