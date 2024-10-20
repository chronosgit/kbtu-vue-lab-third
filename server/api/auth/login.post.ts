import { ObjectId } from 'mongoose';
import User from '~/server/models/User';
import verifyPassword from '~/server/utils/verifyPassword';

export default defineEventHandler(async (e) => {
	try {
		const { username, password } = await readBody(e);

		const user = await User.findOne({ username });
		if (!user) {
			throw createError({
				statusCode: 404,
				statusMessage: "Such user doesn't exist",
			});
		}

		if (!(await verifyPassword(password, user.password))) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Invalid password',
			});
		}

		if (!user.isEmailConfirmed) {
			throw createError({
				statusCode: 403,
				statusMessage: "Account isn't activated",
			});
		}

		user.lastLoggedIn = new Date();
		await user.save();

		const { accessToken, refreshToken } = getTokens(
			user._id as ObjectId,
			user.email,
			user.username
		);

		setCookie(e, 'access_token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 3600, // def: 1h
			path: '/',
		});

		setCookie(e, 'refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: '/',
		});

		const userToReturn = {
			id: user._id,
			username: user.username,
			email: user.email,
			age: user.age,
			location: user.location,
			likes: user.likes,
			rating: user.rating,
			lastLoggedIn: user.lastLoggedIn,
			isEmailConfirmed: user.isEmailConfirmed,
		};

		return getSuccessResponse(200, 'Authenticated', { user: userToReturn });
	} catch (err) {
		console.error(err);

		throw createError(getErrorOptions(err));
	}
});
