import { getTicketsTypes, getUserTickets, postTicket } from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { insertTicketSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .post("", validateBody(insertTicketSchema), postTicket)
  .get("", getUserTickets);

export { ticketsRouter };
