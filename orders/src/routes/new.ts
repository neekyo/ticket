import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@quicktix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';

const router = express.Router();

// amount of time before ticket reservation expires!
const EXPIRATION_WINDOW_SECONDS = 15 * 60; // move to env

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find ticket user is trying to order in DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new BadRequestError('Ticket is already reserved');
      throw new NotFoundError();
    }

    // make sure ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // calculate exp date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save to DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();

    // publish event saying order was created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
