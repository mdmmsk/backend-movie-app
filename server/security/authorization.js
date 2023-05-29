function autorization(roles) {
	return (req, res, next) => {
		const userRoles = req.user.roles;
		for(let role of roles) {
			if(userRoles.includes(role)) {
				return next();
			}
		}
		res.status(403).send('You don\'t have permission!');
	}
}


module.exports = {
	autorization,
}