## Summary Of This Project

This is an event management backend project where a user can register and login to create, view, edit and delete events. Basically manage events over all.

---

1. Clone the project
2. Install all the dependencies
3. Create a .env file on the root similar to .env.sample file but with values
4. FRONTEND_ORIGIN on the .env file should be the domain from which the request is coming from. For example, if you're developing React App using Vite, its default development server runs at http://localhost:5173 which should be the value of FRONTEND_ORIGIN

---

The routes available for users can be seen on file `routes/user.routes.js` and the routes available for events can be seen on file `routes/event.routes.js`
