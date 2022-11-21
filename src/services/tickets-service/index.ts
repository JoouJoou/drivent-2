import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getAllTicketTypes() {
  return await ticketsRepository.findTicketsTypes();
}

async function reserveUserTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const now = new Date();
  return await ticketsRepository.reserveTicket(ticketTypeId, enrollment.id, now);
}

async function getAllUserTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticketsList = await ticketsRepository.findAllUserTickets(enrollment.id);
  if (ticketsList.length > 0) {
    return ticketsList;
  }
  throw notFoundError();
}

const ticketsService = {
  getAllTicketTypes,
  reserveUserTicket,
  getAllUserTickets,
};

export default ticketsService;
