import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const paymentResponse = await paymentsService.processPayment(req.body, req.userId);
    res.status(httpStatus.OK).send(paymentResponse);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "RequestError") {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketId = Number(req.query.ticketId);
    const getPaymentResponse = await paymentsService.findPaymentsByTicket(ticketId, req.userId);
    res.status(httpStatus.OK).send(getPaymentResponse);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "RequestError") {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
