'use strict';
const Hapi = require('@hapi/hapi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/items',
    handler: async (request, h) => {
      try {
        const newItem = await prisma.item.create({
          data: request.payload,
        });
        return h.response(newItem).code(201);
      } catch (error) {
        return h.response(error.message).code(500);
      }
    },

  });

  server.route({
    method: 'GET',
    path: '/item-list',
    handler: async (request, h) => {
      const items = await prisma.item.findMany();
      return h.response(items).code(200);
    },
  });



  server.route({
    method: 'PUT',
    path: '/items/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      const updatedItem = await prisma.item.update({
        where: { id: parseInt(id) },
        data: request.payload,
      });
      return h.response(updatedItem).code(200);
    },
    
        }),
      


  server.route({
    method: 'DELETE',
    path: '/items/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      await prisma.item.delete({
        where: { id: parseInt(id) },
      });
      return h.response().code(204);
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
