import Joi from "joi";

export const insertTicketSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});
