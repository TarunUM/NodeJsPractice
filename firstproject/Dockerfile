FROM node:18

WORKDIR /

COPY . ./

# shell form
# it starts a shell
RUN npm install

COPY . .

# ENV PORT=8000

EXPOSE 8000

# Exec Form
# commands have been given in an array of strings
# it's the prefered way to do things
# it doesn't start up a shell session
CMD ["npm", "start"]