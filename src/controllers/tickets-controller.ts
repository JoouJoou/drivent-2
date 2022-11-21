import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketstypes = await ticketsService.getAllTicketTypes();
    res.status(httpStatus.OK).send(ticketstypes);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const insertResponse = await ticketsService.reserveUserTicket(req.userId, Number(req.body.ticketTypeId));
    res.status(httpStatus.CREATED).send(insertResponse);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const getTicketsResponse = await ticketsService.getAllUserTickets(req.userId);
    res.status(httpStatus.OK).send(getTicketsResponse);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
