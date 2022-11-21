import { notFoundError, requestError, unauthorizedError } from "@/errors";
import { payment } from "@/protocols";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";

async function processPayment(paymentData: payment, userId: number) {
  const checkTicket = await ticketsRepository.findOneTicketById(paymentData.ticketId);
  if (!checkTicket) {
    throw notFoundError();
  }
  const checkIfIsPaid = await paymentsRepository.findPaidTicket(paymentData.ticketId);
  if (checkIfIsPaid !== null) {
    throw requestError(400, "Payment has already been made");
  }
  const getEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (checkTicket.enrollmentId !== getEnrollment.id) {
    throw unauthorizedError();
  }

  const value = await ticketsRepository.findOneTicketById(paymentData.ticketId);

  return await paymentsRepository.createPayment(
    paymentData.ticketId,
    value.TicketType.price,
    paymentData.cardData.issuer,
    String(paymentData.cardData.number).slice(-4),
    new Date(),
  );
}

async function findPaymentsByTicket(ticketId: number, userId: number) {
  if (!ticketId) {
    throw requestError(400, "Missing ticket id");
  }
  const checkPayment = await paymentsRepository.findPaidTicket(ticketId);
  if (!checkPayment) {
    throw notFoundError();
  }
  const checkTicket = await ticketsRepository.findOneTicketById(ticketId);
  const getEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (checkTicket.enrollmentId !== getEnrollment.id) {
    throw unauthorizedError();
  }

  return await paymentsRepository.findPaidTicket(ticketId);
}

const paymentsService = {
  processPayment,
  findPaymentsByTicket,
};

export default paymentsService;
