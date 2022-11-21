import { prisma } from "@/config";

async function findTicketsTypes() {
  return await prisma.ticketType.findMany();
}

async function reserveTicket(ticketTypeId: number, enrollmentId: number, date: Date) {
  await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED",
      updatedAt: date,
    },
  });
  const ticketsList = await prisma.ticket.findMany();
  const newTicketId = ticketsList.pop().id;
  return findOneTicketById(newTicketId);
}

async function findOneTicketById(ticketId: number) {
  return await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      TicketType: true,
    },
  });
}

async function findAllUserTickets(enrollmentId: number) {
  return await prisma.ticket.findMany({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findTicketsTypes,
  reserveTicket,
  findAllUserTickets,
  findOneTicketById,
};

export default ticketsRepository;
