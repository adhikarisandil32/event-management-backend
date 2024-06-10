## Summary Of This Project

This is the backend portion of Event Management Full Stack Project ([Frontend](https://github.com/adhikarisandil32/event-management-frontend)) where a user can register and login to create, view, edit and delete events. Basically manage events over all.

---

1. Clone the project
2. Install all the dependencies `npm i`
3. Create a .env file on the root similar to .env.sample file but with values
4. FRONTEND_ORIGIN on the .env file should be the domain from which the request is coming from. For example, if you're developing React App using Vite, its default development server runs at http://localhost:5173 which should be the value of FRONTEND_ORIGIN
5. Run the Development server `npm run dev`

---

The routes available for users can be seen on file `routes/user.routes.js` and the routes available for events can be seen on file `routes/event.routes.js`
