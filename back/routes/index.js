const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/users', userRoutes);
};

module.exports = constructorMethod;