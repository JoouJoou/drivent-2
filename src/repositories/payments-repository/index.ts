import { prisma } from "@/config";

async function createPayment(
  ticketId: number,
  value: number,
  cardIssuer: string,
  cardLastDigits: string,
  updatedAt: Date,
) {
  await prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits,
      updatedAt,
    },
  });
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "PAID",
    },
  });
  return findPaidTicket(ticketId);
}

async function findPaidTicket(ticketId: number) {
  return await prisma.payment.findFirst({
    where: { ticketId },
  });
}

const paymentsRepository = {
  createPayment,
  findPaidTicket,
};

export default paymentsRepository;
