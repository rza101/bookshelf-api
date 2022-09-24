const hapi = require('@hapi/hapi');

const route = require('./route');

const init = async () => {
  const server = hapi.server({
    host: 'localhost',
    port: 5000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(route);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
