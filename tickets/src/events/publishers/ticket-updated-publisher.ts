import { Publisher, Subjects, TicketUpdatedEvent } from '@quicktix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
