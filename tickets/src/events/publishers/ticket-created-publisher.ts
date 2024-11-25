import { Publisher, Subjects, TicketCreatedEvent } from '@quicktix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
