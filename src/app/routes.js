module.exports = (app, passport) => {

	// index routes
	app.get('/', (req, res) => {
		res.render('index');
	});

	//login view
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.get('/home', (req, res) => {
		res.render('pages/home.ejs');
	});
	app.get('/acercade', (req, res) => {
		res.render('pages/acercade.ejs');
	});

	app.get('/ubicacion', (req, res) => {
		res.render('pages/ubicacion.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.get('/videos', (req, res) => {
		res.render('pages/videos.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.get('/comercio', (req, res) => {
		res.render('pages/comercio.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.get('/redsocial', (req, res) => {
		res.render('pages/redsocial.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	//profile view
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('pages/profile', {
			user: req.user
		});
	});

	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}
